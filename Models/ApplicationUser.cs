using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using InvoiceCafe.Models.Domain;

namespace InvoiceCafe.Models
{
    public class ApplicationUser: IdentityUser<Guid>
    {
        public virtual Person Person { get; set; }
    }
}
