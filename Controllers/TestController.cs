using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using Newtonsoft.Json;
using System.Text;
using System.Net.Http.Headers;
using System.Net;
using InvoiceCafe.Models.Engines;
using Microsoft.AspNetCore.Identity;
using InvoiceCafe.Data;
using InvoiceCafe.Models;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using InvoiceCafe.Models.EDSStorage;

namespace InvoiceCafe.Controllers
{
    public class TestController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _config;
        private readonly ClaimsPrincipal _currentUser;
        private readonly Guid _currentUserId;

        public TestController(
            UserManager<ApplicationUser> userManager,
            IConfiguration config,
            SignInManager<ApplicationUser> signInManager,
            ApplicationDbContext dbContext,
            IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _config = config;
            _signInManager = signInManager;
            _db = dbContext;
            _currentUser = httpContextAccessor.HttpContext.User;

            var strId = userManager.GetUserId(httpContextAccessor.HttpContext.User);
            if (strId != null)
            {
                _currentUserId = Guid.Parse(strId);
            }
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult TestEDS()
        {
            return View();
        }

        public async Task<IActionResult> Subscribe()
        {

            return View("TestEDS");
        }
    }
}