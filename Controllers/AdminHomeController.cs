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
    [Authorize(Roles = "Admin")]

    public class AdminHomeController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _db;
        private readonly string _currentUser, _currentUserId;

        public AdminHomeController(
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
            ViewBag.UserName = _currentUser;
            ViewBag.CurrentLanguage = _config.GetValue<string>("App:DefaultLanguage");
            return View();
        }
    }
}