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
using Microsoft.Extensions.Configuration;

namespace InvoiceCafe.Controllers
{
    [Authorize(Roles = "Investor")]
    public class InvestorHomeController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _db;
        private readonly string _currentUser, _currentUserId;

        public InvestorHomeController(
            UserManager<ApplicationUser> userManager,
            IConfiguration config,
            ApplicationDbContext dbContext,
            IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _config = config;
            _db = dbContext;

            _currentUser = httpContextAccessor.HttpContext.User.Identity.Name;
            _currentUserId = userManager.GetUserId(httpContextAccessor.HttpContext.User);
        }

        public IActionResult Index()
        {
            //var claims = User.Claims;

            var currentUser = _db.Persons.Include(i => i.Company).Where(p => p.Id.ToString() == _currentUserId).Single();
            ViewBag.CompanyGuid = currentUser.Company.Guid;

            ViewBag.UserName = currentUser.FullName;
            ViewBag.CompanyName = currentUser.Company.CompanyName;
            ViewBag.CompanyId = currentUser.Company.Id;
            ViewBag.CompanyStatus = (int)currentUser.Company.Status;
            ViewBag.CompanyType = (int)currentUser.Company.AgentType;
            ViewBag.LegalForm = currentUser.Company.LegalForm;
            ViewBag.RegisterSteps = currentUser.Company.RegisterSteps;

            ViewBag.CurrentLanguage = _config.GetValue<string>("App:DefaultLanguage");
            return View();
        }
    }
}