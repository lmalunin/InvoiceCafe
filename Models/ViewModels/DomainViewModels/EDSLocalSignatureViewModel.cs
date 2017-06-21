using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.ViewModels.DomainViewModels
{
    public class EDSLocalSignatureViewModel
    {
        public string message { get; set; }
        public bool detached { get; set; }
        public string certificate { get; set; }

        public string fileId { get; set; }
        public string Id { get; set; }

        public string signature { get; set; }
    }
}
