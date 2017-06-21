using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using InvoiceCafe.Models;
using InvoiceCafe.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using InvoiceCafe.Models.Domain;
using InvoiceCafe.Models.ViewModels.DomainViewModels;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using InvoiceCafe.Models.Engines;

namespace InvoiceCafe.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class AdminController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _db;
        private readonly string _currentUser;
        private readonly Guid _currentUserId;
        private readonly HttpContext _context;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _config;

        public AdminController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext dbContext,
            Microsoft.Extensions.Configuration.IConfiguration config,
            IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _db = dbContext;
            _config = config;
            _context = httpContextAccessor.HttpContext;
            _currentUser = httpContextAccessor.HttpContext.User.Identity.Name;

            var userId = userManager.GetUserId(httpContextAccessor.HttpContext.User);
            if (userId != null)
            {
                _currentUserId = Guid.Parse(userId);
            }
        }

        [HttpGet]
        [ActionName("GetSignForms")]
        public IList<SignFormViewModel> GetSignForms()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Company, CompanyViewModel>();
                cfg.CreateMap<SignForm, SignFormViewModel>();
            });

            IList<SignFormViewModel> signForms = _db.SignForms.Include(i => i.Company)
                //.Where(w => w.Status == SIGN_FORM_STATUS.ToAcceptByAdmin)     //пока тестируем, пусть все выводятся
                .OrderByDescending(o => o._recordCreated)
                .AsEnumerable()
                .Select(s => Mapper.Map<SignForm, SignFormViewModel>(s)).ToList();

            return signForms;
        }

        [HttpGet]
        [ActionName("GetSignFormDetails")]
        public IActionResult GetSignFormDetails(Guid id)    //c83b8385-a9a0-4143-90c5-fc3c33ad736d
        {
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Company, CompanyViewModel>();
                cfg.CreateMap<SignForm, SignFormViewModel>();
            });

            var signForm = _db.SignForms.Include(i => i.Company).Where(w => w.Id == id).Single();

            return Ok(Mapper.Map<SignForm, SignFormViewModel>(signForm));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ActionName("AcceptSignForm")]
        public async Task<IActionResult> AcceptSignForm([FromBody]SignFormViewModel model)
        {
            //SignForm sf;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Company c = _db.Companies.Include(i => i.SignForm).Where(w => w.Id == model.Id).Single();
            c.Status = COMPANY_STATUS.DocumentsAcceptedByAdmin;
            c.SignForm.Status = SIGN_FORM_STATUS.Accepted;
            await _db.SaveChangesAsync();
            model.Status = (int)SIGN_FORM_STATUS.Accepted;

            //после согласования первичной формы необходимо создать документы, которые будут подписываться ЭЦП клиента
            //может быть этот документ надо создать раньше, сразу после регистрации? уточнить.

            DocumentsEngine docEngine = new DocumentsEngine(string.Format("{0}://{1}", _context.Request.Scheme, _context.Request.Host),
                _config.GetValue<string>("App:FileStorageCatalog"));

            EDSDocument doc = new EDSDocument();
            doc.UserId = _currentUserId;
            doc.CompanyId = c.Id;
            doc.DocumentType = EDS_DOCUMENT_TYPE.Questionnaire;
            doc.Title = "Анкета о присоединении";

            if (!docEngine.CreateDocument(doc))
            {
                ModelState.AddModelError("Server", "Error in creating pdf form: " + docEngine.errorMessage);
                return BadRequest(ModelState);
            }

            _db.EDSDocuments.Add(doc);
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Error in saving document to db: " + ex.Message);
                return BadRequest(ModelState);
            }
            return Ok(model);
        }

        [HttpPost]
        [ActionName("AcceptEDS")]
        public async Task<IActionResult> AcceptEDS()
        {
            var currentUser = _db.Persons.Include(i => i.Company).Where(p => p.Id == _currentUserId).Single();

            Company c = currentUser.Company;
            c.RegisterSteps = c.RegisterSteps | 2;
            if (c.RegisterSteps == 7 && c.Status == COMPANY_STATUS.DocumentsAcceptedByAdmin)
                c.Status = COMPANY_STATUS.Approved;
            await _db.SaveChangesAsync();
            return Ok( new { result = "Ok" });
        }

        [HttpPost]
        [ActionName("AcceptRules")]
        public async Task<IActionResult> AcceptRules()
        {
            var currentUser = _db.Persons.Include(i => i.Company).Where(p => p.Id == _currentUserId).Single();

            Company c = currentUser.Company;
            c.RegisterSteps = c.RegisterSteps | 4;
            if (c.RegisterSteps == 7 && c.Status == COMPANY_STATUS.DocumentsAcceptedByAdmin)
                c.Status = COMPANY_STATUS.Approved;
            await _db.SaveChangesAsync();
            return Ok(new { result = "Ok" });
        }

        [HttpGet]
        [ActionName("GetDZForAdmin")]
        public IList<DZViewModel> GetDZForAdmin()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Company, CompanyViewModel>();
                cfg.CreateMap<Lot, LotViewModel>();
                cfg.CreateMap<DZ, DZViewModel>();
            });

            var dz = _db.DZ.Include(i => i.Supplier)
                .Include(i => i.Debtor)
                .Include(i => i.Contract)
                .OrderByDescending(o => o._recordCreated)
                .Where(w => w.Status == DZ_STATUS.ToAcceptByDebtor || w.Status == DZ_STATUS.Init);

            IList<DZViewModel> dzvm = new List<DZViewModel>();

            //переделать
            foreach (var o in dz)
            {
                var d = new DZViewModel();
                d = Mapper.Map<DZ, DZViewModel>(o);
                d.ContractGuid = o.Contract.Guid.ToString();
                d.DocumentsURLs = o.sDocumentsURLs.Split('|');
                dzvm.Add(d);
            }

            return dzvm;
        }

        [HttpPost]
        [ActionName("AcceptDZ")]
        public async Task<IActionResult> AcceptDZ([FromBody]DZViewModel model)
        {
            DZ dz;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            dz = _db.DZ.Where(w => w.Id == model.Id).Single();
            dz.Status = DZ_STATUS.AcceptedByPlatform;
            dz.VerificationType = DZ_VERIFICATION_TYPE.Platform;
            await _db.SaveChangesAsync();
            model.Status = (int)DZ_STATUS.AcceptedByPlatform;
            return Ok(model);
        }
    }
}