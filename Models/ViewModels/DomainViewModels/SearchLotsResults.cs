using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.ViewModels.DomainViewModels
{
    public class SearchLotsResults
    {
        public int LotId { get; set; }
        public string SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string DebtorId { get; set; }
        public string DebtorName { get; set; }
        public int DZDays { get; set; }
        public decimal DZPart { get; set; }
        public decimal LotYearPercent { get; set; }
        public decimal LotSum { get; set; }
        public int LotStatus { get; set; }
        public DateTime recordCreated { get; set; }
        public bool IsChecked { get; set; }
        public decimal OfferDZPart { get; set; }
        public decimal OfferYearPercent { get; set; }
        public int OfferType { get; set; }  //OFFER_TYPE
    }
}
