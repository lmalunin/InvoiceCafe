using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

/*
import { DZViewModel } from './DZViewModel';
import { LotViewModel } from './LotViewModel';
import { OfferViewModel } from './OfferViewModel';
import { CompanyViewModel } from './CompanyViewModel';
*/
namespace InvoiceCafe.Models.ViewModels.DomainViewModels
{
    public class DealViewModel
    {
        public int Id { get; set; }
        public CompanyViewModel Supplier { get; set; }
        public CompanyViewModel Debtor { get; set; }
        public CompanyViewModel Investor { get; set; }
        public string ContractGuid { get; set; }
        public DZViewModel DZ { get; set; }
        public LotViewModel Lot { get; set; }
        public OfferViewModel Offer { get; set; }

        public decimal Sum { get; set; }
        public decimal DZPart { get; set; }
        public decimal YearPercent { get; set; }

        public DateTime CreationDate { get; set; }
    }
}
