using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using InvoiceCafe.Models;
using InvoiceCafe.Services;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using InvoiceCafe.Models.Domain;
using InvoiceCafe.Data;
using InvoiceCafe.Models.AccountViewModels;
using Microsoft.EntityFrameworkCore;

using System.Security.Claims;
using InvoiceCafe.Models.ViewModels.DomainViewModels;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.Authentication;
using AutoMapper;
using System.IO;
using System.Runtime.InteropServices;
using Microsoft.Extensions.Configuration;

namespace InvoiceCafe.Controllers.api
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _config;

        private readonly Guid _currentUserId;

        private readonly ApplicationDbContext _db;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ApplicationDbContext dbContext,
            IEmailSender emailSender,
            ISmsSender smsSender,
            ILoggerFactory loggerFactory,
            IHttpContextAccessor httpContextAccessor,
            Microsoft.Extensions.Configuration.IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;

            _emailSender = emailSender;
            _smsSender = smsSender;
            _logger = loggerFactory.CreateLogger<AccountController>();

            _config = config;

            _db = dbContext;

            var user = httpContextAccessor.HttpContext.User;
            var userId = userManager.GetUserId(httpContextAccessor.HttpContext.User);
            if (userId != null)
            {
                _currentUserId = Guid.Parse(userId);
            }
            //_currentUserId = Guid.Parse(userManager.GetUserId(httpContextAccessor.HttpContext.User));
        }

        [HttpGet]
        [AllowAnonymous]
        [ActionName("Test")]
        public string Test()
        {
            return "Ok";
        }

        [HttpPost]
        [AllowAnonymous]
        //[ValidateAntiForgeryToken]
        [ActionName("Register")]
        public async Task<IActionResult> Register([FromBody]RegisterFormViewModel model)
        {
            //System.Threading.Thread.Sleep(5000);
            //return Ok(model);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Person person = new Person()
            {
                FullName = model.PersonName,
                PlaceOfBirth = model.PersonPlaceOfBirth ?? string.Empty,
                DateOfBirth = model.PersonBirthDate,
                Citizenship = model.PersonCitizenship,
                Occupation = model.PersonOccupation,
                MobilePhone = model.PersonMobilePhone,
                _recordCreated = DateTime.UtcNow,

                IsActive = true,
                CounterOfferAcceptPossibility = false,
                Position = string.Empty,
                SourceOfAuthority = string.Empty,
                FullPowersDocumentsNames = "[]",
                IdentityDocumentsNames = "[]",

            };

            ApplicationUser user = new ApplicationUser
            {
                UserName = model.PersonEmail,
                Email = model.PersonEmail,
                PhoneNumber = model.PersonMobilePhone,
                Person = person,
            };

            //переделать здесь - поставить добавление пользовател€ после создани€ компании, а то пользователи добавл€ютс€ зр€
            IdentityResult _result = await _userManager.CreateAsync(user, model.PersonPassword);

            if (!_result.Succeeded)
            {
                ModelState.AddModelError("Database", _result.Errors.FirstOrDefault().Description);
                return BadRequest(ModelState);
            }

            try
            {
                Company company = await _db.Companies.Include(i => i.Persons).Where(w => w.INN == model.INN).SingleOrDefaultAsync();
                if (company == null)
                {
                    company = new Company(model);
                    company._recordCreated = person._recordCreated;
                    _db.Companies.Add(company);
                }
                else
                {
                    //нашли в базе компанию с таким »ЌЌ
                    //допустимо создавать новых пользователей из открытой части только если компани€ еще не отправл€ла документы на присоединение
                    if (company.Status != COMPANY_STATUS.Init)
                    {
                        ModelState.AddModelError("Company", "You cannot add new user to this company. Please contact companies administrator.");
                        return BadRequest(ModelState);
                    }
                }
                company.Persons.Add(person);
                await _db.SaveChangesAsync();

                if ((AGENT_TYPES)model.AgentType == AGENT_TYPES.SUPPLIER)
                {
                    await _userManager.AddToRoleAsync(user, "SUPPLIER");
                }

                if ((AGENT_TYPES)model.AgentType == AGENT_TYPES.INVESTOR)
                {
                    await _userManager.AddToRoleAsync(user, "INVESTOR");
                }

                if ((AGENT_TYPES)model.AgentType == AGENT_TYPES.DEBTOR)
                {
                    await _userManager.AddToRoleAsync(user, "DEBTOR");
                }

                return Ok(model);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Database", ex.Message);
                return BadRequest(ModelState);
            }
        }

        //логин из сервиса
        [HttpPost]
        [AllowAnonymous]
        //[ValidateAntiForgeryToken]
        [ActionName("Login")]
        public async Task<IActionResult> Login([FromBody]LoginViewModel model)
        {
            Microsoft.AspNetCore.Identity.SignInResult result;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
            }
            catch (Exception ex)
            {
                result = Microsoft.AspNetCore.Identity.SignInResult.Failed;
                ModelState.AddModelError("Auth", "Sign in server error: " + ex.Message);
                return BadRequest(ModelState);
            }

            if (result.Succeeded)
            {
                model.IsOk = true;
                ApplicationUser user = _userManager.Users
                    .Include(i => i.Person)
                    .Include(i => i.Person.Company)
                    .FirstOrDefault(u => u.Email == model.Email);

                var roles = await _userManager.GetRolesAsync(user);
                if (roles.Contains("Admin"))
                {
                    model.mainRole = "ADMIN";
                    return Ok(model);
                }
                //user.InvoiceCafeUserProfile = _db.InvoiceCafeUserProfiles.Include(i => i.Company).Where(w => w.Id == user.Id).Single();
                //if (await _userManager.IsInRoleAsync(user, "Supplier"))
                //{
                //    model.mainRole = "SUPPLIER";
                //    //return RedirectToAction("Index", "Supplier");
                //    //return model;
                //}
                if (user.Person.Company.AgentType == AGENT_TYPES.SUPPLIER)
                {
                    //await _userManager.AddClaimAsync(user, new Claim(ClaimsIdentity.DefaultRoleClaimType, "Supplier"));
                    //var claims = new List<Claim>
                    //{
                    //    new Claim(ClaimsIdentity.DefaultNameClaimType, "Supplier")
                    //};
                    //// создаем объект ClaimsIdentity
                    //ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType,
                    //    ClaimsIdentity.DefaultRoleClaimType);
                    //// установка аутентификационных куки
                    //await HttpContext.Authentication.SignInAsync("Cookies", new ClaimsPrincipal(id));
                    model.mainRole = "SUPPLIER";
                }

                if (user.Person.Company.AgentType == AGENT_TYPES.INVESTOR)
                {
                    model.mainRole = "INVESTOR";
                }

                if (user.Person.Company.AgentType == AGENT_TYPES.DEBTOR)
                {
                    model.mainRole = "DEBTOR";
                }
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Ќе найдено им€ пользовател€ или пароль.");
                model.IsOk = false;
                model.errorMessage = "Ќе найдено им€ пользовател€ или пароль.";
                return BadRequest(ModelState);
            }

            //return View(model);
            return Ok(model);
        }

        //логин с mvc страницы
        [HttpPost]
        [AllowAnonymous]
        //[ValidateAntiForgeryToken]
        [ActionName("LoginFP")]
        public async Task<IActionResult> LoginFP(LoginViewModel model)
        {
            //var model = new LoginViewModel();
            Microsoft.AspNetCore.Identity.SignInResult result;

            if (!ModelState.IsValid)
            {
                return View("Login");
            }

            try
            {
                result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
            }
            catch (Exception ex)
            {
                result = Microsoft.AspNetCore.Identity.SignInResult.Failed;
                ModelState.AddModelError("Auth", "Sign in server error: " + ex.Message);
                return View("Login");
            }

            if (result.Succeeded)
            {
                model.IsOk = true;
                ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.Email == model.Email);

                var roles = await _userManager.GetRolesAsync(user);
                if (roles.Contains("Admin"))
                {
                    RedirectToAction("Index", "Admin");
                }

                if (roles.Contains("Supplier"))
                {
                    RedirectToAction("Index", "SupplierHome");
                }

                if (roles.Contains("Debtor"))
                {
                    RedirectToAction("Index", "DebtorHome");
                }

                if (roles.Contains("Investor"))
                {
                    RedirectToAction("Index", "InvestorHome");
                }

                ModelState.AddModelError(string.Empty, "Ќе найдено сопоставление учетной записи пользовател€.");
                return View("Login");
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Ќе найдено им€ пользовател€ или пароль.");
                return View("Login");
            }
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        [ActionName("Logout")]
        public async Task<IActionResult> Logout([FromBody]LoginViewModel model)
        {
            await _signInManager.SignOutAsync();
            return Ok(model);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> _create_roles()
        {
            var roleStore = new RoleStore<InvoiceCafeRole, ApplicationDbContext, Guid>(_db);
            var roleManager = new RoleManager<InvoiceCafeRole>(roleStore, null, null, null, null, null);

            await roleManager.CreateAsync(new InvoiceCafeRole() { Name = "Admin" });
            await roleManager.CreateAsync(new InvoiceCafeRole() { Name = "Supplier" });
            await roleManager.CreateAsync(new InvoiceCafeRole() { Name = "Debtor" });
            await roleManager.CreateAsync(new InvoiceCafeRole() { Name = "Investor" });

            //await roleManager.CreateAsync(new IdentityRole("Admin"));

            //await roleManager.CreateAsync(new IdentityRole("Supplier"));
            //await roleManager.CreateAsync(new IdentityRole("Debtor"));
            //await roleManager.CreateAsync(new IdentityRole("Investor"));
            return Ok();
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> _create_admin()
        {
            Person profile = new Person()
            {
                FullName = "Admin",
                Position = "Admin"
            };

            ApplicationUser user = new ApplicationUser
            {
                UserName = "admin@admin.net",
                Email = "admin@admin.net",
                Person = profile
            };

            IdentityResult _result = await _userManager.CreateAsync(user, "QWer12#$");
            await _userManager.AddToRoleAsync(user, "ADMIN");
            return Ok();
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> _service_op()
        {
            //var user = await UserManager.FindByNameAsync("test@test.ru");
            //string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
            //var result = await UserManager.ResetPasswordAsync(user.Id, code, "QCd&K1@");

            var u1 = await _userManager.FindByNameAsync("i1@pisem.net");
            var u2 = await _userManager.FindByNameAsync("vg01@cher.ru");
            string code;
            IdentityResult result;
            code = await _userManager.GeneratePasswordResetTokenAsync(u1);
            result = await _userManager.ResetPasswordAsync(u1, code, "12345");

            code = await _userManager.GeneratePasswordResetTokenAsync(u2);
            result = await _userManager.ResetPasswordAsync(u2, code, "12345");
            return Ok();
        }

        [HttpPost]
        [ActionName("AddSignForm")]
        public async Task<IActionResult> AddSignForm([FromBody]SignFormViewModel model)
        {
            SignForm sf;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentUser = _db.Persons.Include(i => i.Company).Where(p => p.Id == _currentUserId).Single();

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<CompanyViewModel, Company>();
                cfg.CreateMap<SignFormViewModel, SignForm>();
            });

            try
            {
                sf = Mapper.Map<SignFormViewModel, SignForm>(model);
                sf.UserId = currentUser.Id;

                string pathSrc = Path.Combine(_config.GetValue<string>("App:TempFileCatalog"), _currentUserId.ToString());
                string pathDst = Path.Combine(_config.GetValue<string>("App:FileStorageCatalog"),
                    currentUser.Company.Guid.ToString(), "signform");

                if (!System.IO.Directory.Exists(pathDst))
                {
                    System.IO.Directory.CreateDirectory(pathDst);
                }

                _transfer_file(model.ScanURL_ogrn, pathSrc, pathDst);
                _transfer_file(model.ScanURL_ustav, pathSrc, pathDst);
                _transfer_file(model.ScanURL_izmen, pathSrc, pathDst);
                _transfer_file(model.ScanURL_inn, pathSrc, pathDst);
                _transfer_file(model.ScanURL_egrul, pathSrc, pathDst);
                _transfer_file(model.ScanURL_reshenie, pathSrc, pathDst);
                _transfer_file(model.ScanURL_migrdocs, pathSrc, pathDst);
                _transfer_file(model.ScanURL_vstup, pathSrc, pathDst);
                _transfer_file(model.ScanURL_rukovod, pathSrc, pathDst);
                _transfer_file(model.ScanURL_p_polnom, pathSrc, pathDst);
                _transfer_file(model.ScanURL_p_lichn, pathSrc, pathDst);
                _transfer_file(model.ScanURL_licen, pathSrc, pathDst);
                _transfer_file(model.ScanURL_inoe, pathSrc, pathDst);
                _transfer_file(model.ScanURL_vypiska, pathSrc, pathDst);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Mapping or file transfer error: " + ex.Message);
                return BadRequest(ModelState);
            }
            sf.Company = currentUser.Company;
            try
            {
                sf.Status = SIGN_FORM_STATUS.ToAcceptByAdmin;
                _db.SignForms.Add(sf);
                _db.Entry(sf.Company).State = EntityState.Unchanged;
                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Database", ex.Message);
                return BadRequest(ModelState);
            }
            sf.Company.Status = COMPANY_STATUS.ToAcceptByAdmin;
            sf.Company.RegisterSteps = sf.Company.RegisterSteps | 1;    //фиксируем прохождение шага 1
            await _db.SaveChangesAsync();
            return Ok(model);
        }

        private void _transfer_file(string fileName, string pathSrc, string pathDst)
        {
            if (fileName != null && System.IO.File.Exists(Path.Combine(pathSrc, fileName)))
            {
                System.IO.File.Copy(Path.Combine(pathSrc, fileName), Path.Combine(pathDst, fileName));
                System.IO.File.Delete(Path.Combine(pathSrc, fileName));
            }
        }
    }
}