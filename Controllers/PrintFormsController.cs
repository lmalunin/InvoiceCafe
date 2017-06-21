using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace InvoiceCafe.Controllers
{
    public class PrintFormsController : Controller
    {
        public IActionResult Anketa()
        {
            return View();
        }
    }
}