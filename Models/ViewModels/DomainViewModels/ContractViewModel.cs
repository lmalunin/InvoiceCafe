using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

/*
import { CompanyViewModel } from './CompanyViewModel';
import { PersonViewModel } from './PersonViewModel';
import { DZViewModel } from './DZViewModel';
*/

namespace InvoiceCafe.Models.ViewModels.DomainViewModels
{
    public class ContractViewModel
    {
        public int Id { get; set; }
        public Guid Guid { get; set; }

        [Required]
        public int ContractType { get; set; }
        [Required]
        public string ContractName { get; set; }
        [Required]
        public string ContractNumber { get; set; }

        public CompanyViewModel Supplier { get; set; }
        [Required]
        public PersonViewModel SupplierSigner { get; set; }

        [Required]
        public IList<CompanyViewModel> Debtors { get; set; }
        public string DebtorsSummary { get; set; }
        [Required]
        public IList<PersonViewModel> DebtorSigners { get; set; }

        [Required]
        public DateTime DateOfSign { get; set; }
        [Required]
        public DateTime DateFrom { get; set; }
        [Required]
        public DateTime DateTo { get; set; }
        [Required]
        public int Duration { get; set; }
        //[Required]
        public string DaysCount { get; set; }

        [Required]
        public DateTime DebtorObligationsDate { get; set; }
        [Required]
        public DateTime SupplierDeliveryDate { get; set; }
        [Required]
        public DateTime PropertyRightsTransferDate { get; set; }

        public string CounterClaimTerms { get; set; }
        public string MoneyBackTerms { get; set; }
        public string AcceptanceTerms { get; set; }
        public string PaymentTerms { get; set; }
        public string ContractMatter { get; set; }
        public int DeliveryType { get; set; }

        public bool IsCessionAcceptable { get; set; }

        public IList<DZViewModel> DZ { get; set; }
    }
}
