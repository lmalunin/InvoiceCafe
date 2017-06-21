using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using InvoiceCafe.Services;
using InvoiceCafe.Models;
using Microsoft.Extensions.Logging;
using InvoiceCafe.Controllers.api;
using Microsoft.AspNetCore.Http;
using System.Security.Principal;
using InvoiceCafe.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using InvoiceCafe.Models.ViewModels.DomainViewModels;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Localization;
using System.Globalization;
using Microsoft.Extensions.Configuration;
using InvoiceCafe.Models.Domain;

namespace InvoiceCafe.Controllers
{
    public class StartController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        private readonly string  _currentUserId;
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _config;
        private readonly ClaimsPrincipal _currentUser;
        private readonly IStringLocalizer<StartController> _localizer;
        private readonly CultureInfo _culture;

        public StartController(
            UserManager<ApplicationUser> userManager,
            IConfiguration config,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender,
            ISmsSender smsSender,
            ILoggerFactory loggerFactory,
            ApplicationDbContext dbContext,
            IHttpContextAccessor httpContextAccessor,
            IStringLocalizer<StartController> localizer)
        {
            _userManager = userManager;
            _config = config;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _smsSender = smsSender;
            _logger = loggerFactory.CreateLogger<AccountController>();
            _db = dbContext;
            _currentUser = httpContextAccessor.HttpContext.User;
            _localizer = localizer;
            _culture = httpContextAccessor.HttpContext.Features.Get<IRequestCultureFeature>().RequestCulture.UICulture;

            if (_currentUser.Identity.IsAuthenticated)
            {
                _currentUserId = userManager.GetUserId(httpContextAccessor.HttpContext.User);
            }
        }

        public IActionResult Index()
        {            
            ViewBag.Hello = CultureInfo.CurrentUICulture.Name + ": " + _localizer["Добро пожаловать на сайт Invoice.Cafe"];
            if (_currentUser.Identity.IsAuthenticated)
            {
                if (_currentUser.IsInRole("Admin"))
                {
                    ViewBag.CompanyType = "ADMIN";
                }
                else
                {
                    var currentUser = _db.Persons.Include(i => i.Company).Where(p => p.Id.ToString() == _currentUserId).Single();
                    ViewBag.UserName = currentUser.FullName;
                    ViewBag.CompanyName = currentUser.Company.CompanyName;
                    if (currentUser.Company.AgentType == Models.Domain.AGENT_TYPES.SUPPLIER)
                        ViewBag.CompanyType = "SUPPLIER";
                    if (currentUser.Company.AgentType == Models.Domain.AGENT_TYPES.INVESTOR)
                        ViewBag.CompanyType = "INVESTOR";
                    if (currentUser.Company.AgentType == Models.Domain.AGENT_TYPES.DEBTOR)
                        ViewBag.CompanyType = "DEBTOR";
                }
            }
            else
            {
                ViewBag.UserName = "-";
                ViewBag.CompanyName = "-";
                ViewBag.CompanyType = "-";
            }
            return View();
        }

        //логин с mvc страницы
        [HttpPost]
        [AllowAnonymous]
        //[ValidateAntiForgeryToken]
        [ActionName("Login")]
        public async Task<IActionResult> Login(LoginViewModel model)
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
                    return RedirectToAction("Index", "AdminHome");
                }

                if (roles.Contains("Supplier"))
                {
                    return RedirectToAction("Index", "SupplierHome");
                }

                if (roles.Contains("Debtor"))
                {
                    return RedirectToAction("Index", "DebtorHome");
                }

                if (roles.Contains("Investor"))
                {
                    return RedirectToAction("Index", "InvestorHome");
                }

                ModelState.AddModelError(string.Empty, "Не найдено сопоставление учетной записи пользователя.");
                return View("Login");
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Не найдено имя пользователя или пароль.");
                return View("Login");
            }
        }


        public IActionResult About()
        {
            ViewBag.HomeTitle = _localizer["Главная"];
            ViewBag.PageTitle = _localizer["О проекте"];
            return View();
        }

        public IActionResult Partners()
        {
            ViewBag.HomeTitle = _localizer["Главная"];
            ViewBag.PageTitle = _localizer["Наши клиенты"];
            return View();
        }

        public IActionResult Register()
        {
            AGENT_TYPES type;

            switch (this.HttpContext.Request.QueryString.Value)
            {
                case "?Seller": type = AGENT_TYPES.SUPPLIER; break;
                case "?Debtor": type = AGENT_TYPES.DEBTOR; break;
                case "?Investor": type = AGENT_TYPES.INVESTOR; break;

                default: type = AGENT_TYPES.SUPPLIER; break;
            }

            ViewBag.HomeTitle = _localizer["Главная"];
            ViewBag.PageTitle = _localizer["Регистрация"];
            ViewBag.CurrentLanguage = _config.GetValue<string>("App:DefaultLanguage");
            ViewBag.AgentType = (int)type;
            return View();
        }

        [HttpGet]
        public IActionResult Login()
        {
            ViewBag.HomeTitle = _localizer["Главная"];
            ViewBag.PageTitle = _localizer["Вход"];
            return View();
        }

        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            ViewBag.HomeTitle = _localizer["Главная"];
            ViewBag.PageTitle = _localizer["Вход"];
            return View("Login");
        }

        public IActionResult HowItWorks()
        {
            ViewBag.HomeTitle = _localizer["Главная"];
            ViewBag.PageTitle = _localizer["Как это работает?"];
            return View();
        }

        public IActionResult Pricing()
        {
            ViewBag.HomeTitle = _localizer["Главная"];
            ViewBag.PageTitle = _localizer["Стоимость"];
            return View();
        }

        public IActionResult ForDebtor()
        {
            ViewBag.HomeTitle = _localizer["Главная"];
            ViewBag.PageTitle = _localizer["Дебитору"];
            return View();
        }

        public IActionResult ForInvestor()
        {
            ViewBag.HomeTitle = _localizer["Главная"];
            ViewBag.PageTitle = _localizer["Инвестору"];
            return View();
        }

        public IActionResult ForSeller()
        {
            ViewBag.HomeTitle = _localizer["Главная"];
            ViewBag.PageTitle = _localizer["Поставщику"];
            return View();
        }
        public IActionResult Test()
        {
            ViewBag.HomeTitle = _localizer["Главная"];
            ViewBag.PageTitle = _localizer["Test"];
            return View();
        }
    }
}