using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

/*
import { CompanyViewModel } from './CompanyViewModel';
import { ContractViewModel } from './ContractViewModel';
import { LotViewModel } from './LotViewModel';
*/

namespace InvoiceCafe.Models.ViewModels.DomainViewModels
{
    public class DZViewModel
    {
        public int Id { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Please enter a value bigger than {1}")]
        public decimal Sum { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Please enter a value bigger than {1}")]
        public int Days { get; set; }

        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }

        public CompanyViewModel Debtor { get; set; }
        public CompanyViewModel Supplier { get; set; }

        public int Status { get; set; }
        public string ContractGuid { get; set; }

        public string DocumentName { get; set; }
        public string sDocumentsURLs { get; set; }
        public string[] DocumentsURLs { get; set; }
        public IList<LotViewModel> Lots { get; set; }
        public int VerificationType { get; set; }

        public DateTime _recordCreated { get; set; }
    }
}
