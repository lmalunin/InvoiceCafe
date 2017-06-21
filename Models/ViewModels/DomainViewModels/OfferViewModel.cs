using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

/*
import { DZViewModel } from './DZViewModel';
import { LotViewModel } from './LotViewModel';
import { CompanyViewModel } from './CompanyViewModel';
*/

namespace InvoiceCafe.Models.ViewModels.DomainViewModels
{
    public class OfferViewModel
    {
        public int Id { get; set; }
        public string ContractGuid { get; set; }
        public DZViewModel DZ { get; set; }
        public LotViewModel Lot { get; set; }
        public CompanyViewModel Investor { get; set; }

        public decimal DZPart { get; set; }
        public decimal YearPercent { get; set; }

        public int Type { get; set; }
        public int Status { get; set; }

        public bool FullAccept { get; set; }

        public DateTime _recordCreated { get; set; }
    }
}
