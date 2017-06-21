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

namespace InvoiceCafe.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class CompaniesController : Controller
    {
        private readonly Microsoft.Extensions.Configuration.IConfiguration _config;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _db;
        private readonly string _currentUser, _currentUserId;
        private static string GetDocsForUserBaseUrl;
        private static string DeleteUserDocsBaseUrl;
        public CompaniesController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext dbContext,
            IHttpContextAccessor httpContextAccessor,
            Microsoft.Extensions.Configuration.IConfiguration config)
        {
            _userManager = userManager;
            _db = dbContext;
            _config = config;

            _currentUser = httpContextAccessor.HttpContext.User.Identity.Name;
            _currentUserId = userManager.GetUserId(httpContextAccessor.HttpContext.User);

            GetDocsForUserBaseUrl = _config.GetValue<string>("App:GetDocsForUserBaseUrl");
            DeleteUserDocsBaseUrl = _config.GetValue<string>("App:DeleteUserDocsBaseUrl");

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Company, CompanyViewModel>();
                cfg.CreateMap<Contract, ContractViewModel>();
                cfg.CreateMap<DZ, DZViewModel>();
                cfg.CreateMap<Person, PersonViewModel>();
            });
        }

        [HttpGet]
        [ActionName("GetFiltersForInvestor")]
        public async Task<IActionResult> GetFiltersForInvestor(string id)
        {
            Guid guid;
            if (!Guid.TryParse(id, out guid))
            {
                return BadRequest("Bad id");
            }
            Company company;
            var currentUser = _db.Persons.Include(i => i.Company).Where(p => p.Id.ToString() == _currentUserId).Single();
            try
            {
                company = await _db.Companies.Include(i => i.InvestorFilters).Where(c => c.Id == guid).SingleAsync();
                if (company.Id != currentUser.Company.Id)   //пользователь запросил фильтры от другой компании
                {
                    return BadRequest("Access denied");
                }
                IList<FilterForLots> filters = company.InvestorFilters.ToList();
                return Ok(filters);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Database", ex.Message);
                return BadRequest(ModelState);
            }
        }

        [HttpGet]
        [ActionName("GetFilter")]
        public async Task<IActionResult> GetFilter(int id)
        {
            FilterForLots filter;
            var currentUser = _db.Persons.Include(i => i.Company).Where(p => p.Id.ToString() == _currentUserId).Single();
            try
            {
                filter = await _db.FiltersForLots.Where(w => w.Id == id).SingleAsync();
                if (filter.CompanyId != currentUser.Company.Id)   //пользователь запросил фильтры от другой компании
                {
                    return BadRequest("Access denied");
                }
                return Ok(filter);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Database", ex.Message);
                return BadRequest(ModelState);
            }
        }

        [HttpPost]
        [ActionName("AddOrUpdateFilter")]
        public async Task<IActionResult> AddOrUpdateFilter([FromBody]SearchLotsViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<SearchLotsViewModel, FilterForLots>();
            });

            FilterForLots filter;
            Company investor;
            try
            {
                if ((DB_OPERATION)model.AddOrUpdate == DB_OPERATION.Add)
                {
                    filter = Mapper.Map<SearchLotsViewModel, FilterForLots>(model);
                    investor = await _db.Companies.Include(i => i.InvestorFilters).Where(w => w.Id == Guid.Parse(model.CompanyId)).SingleAsync();
                    investor.InvestorFilters.Add(filter);
                }
                else
                {
                    //filter = await _db.FiltersForLots.Where(w => w.Id == model.Id).SingleAsync();
                    filter = Mapper.Map<SearchLotsViewModel, FilterForLots>(model);
                    _db.Entry(filter).State = EntityState.Modified;
                }
                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Database", ex.Message);
                return BadRequest(ModelState);
            }

            return Ok(model);
        }

        [HttpGet]
        [ActionName("GetDebtorsForSupplier")]
        public async Task<IActionResult> GetDebtorsForSupplier(Guid id)    //c83b8385-a9a0-4143-90c5-fc3c33ad736d
        {
            var debtors = await
                _db.DebtorsSuppliers
                    .Include(i => i.Debtor)
                    .Include(i => i.Supplier)
                    .Where(w => w.SupplierId == id)
                    .Select(s => Mapper.Map<Company, CompanyViewModel>(s.Debtor)).ToListAsync();

            return Ok(debtors);
        }

        [HttpGet]
        [ActionName("GetCompanyDetails")]
        public IActionResult GetCompanyDetails(string guid)    //c83b8385-a9a0-4143-90c5-fc3c33ad736d
        {
            try
            {
                Guid gGuid = Guid.Parse(guid);
                Mapper.Initialize(cfg =>
                {
                    cfg.CreateMap<Company, CompanyViewModel>();
                });

                CompanyViewModel company = _db.Companies.Where(w => w.Guid == gGuid).Select(s => Mapper.Map<Company, CompanyViewModel>(s)).Single();
                return Ok(company);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        [AllowAnonymous]
        [ActionName("GetCompanyByINN")]
        public IActionResult GetCompanyByINN(string inn)
        {
            try
            {
                Mapper.Initialize(cfg =>
                {
                    cfg.CreateMap<Company, CompanyViewModel>();
                });

                CompanyViewModel company = _db.Companies.Where(w => w.INN == inn).Select(s => Mapper.Map<Company, CompanyViewModel>(s)).Single();
                return Ok(company);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [ActionName("AddNewDebtorBySupplier")]
        public async Task<IActionResult> AddNewDebtorBySupplier([FromBody]CompanyViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _db.Companies.AnyAsync(i => i.INN == model.INN))
            {
                ModelState.AddModelError("Company", "Компания с указанным ИНН уже существует в системе. Пожалуйста, воспользуйтесь поиском.");
                return BadRequest(ModelState);
            }

            var currentUser = _db.Persons.Include(i => i.Company).Where(p => p.Id.ToString() == _currentUserId).Single();
            Company company = new Company(model);
            _db.Companies.Add(company);
            DebtorSupplier link = new DebtorSupplier();
            link.Debtor = company;
            link.Supplier = currentUser.Company;
            _db.DebtorsSuppliers.Add(link);
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Database", ex.Message + ": " + ex.InnerException.Message);
                return BadRequest(ModelState);
            }
            return Ok(model);
        }

        [HttpGet]
        [ActionName("AttachDebtorToSupplier")]
        public async Task<IActionResult> AttachDebtorToSupplier(string dGuid, string sGuid)
        {
            try
            {
                Guid g1 = Guid.Parse(dGuid);
                Guid g2 = Guid.Parse(sGuid);

                Mapper.Initialize(cfg =>
                {
                    cfg.CreateMap<Company, CompanyViewModel>();
                });

                Company debtor = _db.Companies.Where(w => w.Guid == g1).Single();
                Company supplier = _db.Companies.Where(w => w.Guid == g2).Single();

                //потом переписать, слишком много запросов здесь
                if (await _db.DebtorsSuppliers.AnyAsync(i => i.Debtor == debtor && i.Supplier == supplier))
                {
                    ModelState.AddModelError("Database", "Дебитор уже добавлен для текущего поставщика.");
                    return BadRequest(ModelState);
                }

                DebtorSupplier link = new DebtorSupplier();
                link.Debtor = debtor;
                link.Supplier = supplier;
                _db.DebtorsSuppliers.Add(link);

                await _db.SaveChangesAsync();

                return Ok(Mapper.Map<Company, CompanyViewModel>(debtor));
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Database", ex.Message);
                return BadRequest(ModelState);
            }
        }

        [HttpGet]
        [ActionName("GetDZForDebtor")]
        public IList<DZViewModel> GetDZForDebtor(string guid)    //c83b8385-a9a0-4143-90c5-fc3c33ad736d
        {
            Guid gGuid = Guid.Parse(guid);
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
                .Where(w => w.Debtor.Guid == gGuid);

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
            dz.Status = DZ_STATUS.AcceptedByDebtor;
            dz.VerificationType = DZ_VERIFICATION_TYPE.Debtor;
            await _db.SaveChangesAsync();
            model.Status = (int)DZ_STATUS.AcceptedByDebtor;
            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetSubscriberForDebtor(Guid id)
        {
            PersonViewModel personVM = null;
            try
            {         
                var contractPerson = await _db.ContractPersons.Include(cp => cp.Person).Include(cp => cp.PersonsCompany).FirstOrDefaultAsync(cp => cp.PersonsCompany.Id == id && cp.PersonType == CONTRACT_PERSON_TYPE.DEBTOR_SIGNER);

                if (contractPerson != null)
                {
                    personVM = Mapper.Map<Person, PersonViewModel>(contractPerson.Person);
                }
                else
                {
                    personVM = new PersonViewModel()
                    {
                        Id = Guid.Empty,
                        FullName = "",
                        FullPowersDocumentsNames = "[]",
                        IdentityDocumentsNames = "[]",
                        GetDocsBaseUrl = GetDocsForUserBaseUrl,
                        DeleteDocsBaseUrl = DeleteUserDocsBaseUrl,
                        DateOfBirth = DateTime.UtcNow,
                        AuthDateFrom = DateTime.UtcNow,
                        AuthDateTo = DateTime.UtcNow,
                        Company = Mapper.Map<Company, CompanyViewModel>(await _db.Companies.Include(c => c.Persons).FirstOrDefaultAsync(c => c.Id == id))
                    };
                }

                return Ok(personVM);
            }
            catch (Exception ex)
            {
#if DEBUG
                ModelState.AddModelError("GetSubscriberForDebtor", ex.Message);
                return BadRequest(ModelState);
#else
                _logger.LogError(ex.Message);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
#endif
            }
        }
    }
}