using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.Domain
{
    public class Deal
    {
        public int Id { get; set; }
        public Company Supplier { get; set; }
        public Company Debtor { get; set; }
        public Company Investor { get; set; }
        public Contract Contract { get; set; }
        public DZ DZ { get; set; }
        public Lot Lot { get; set; }
        public Offer Offer { get; set; }

        public decimal Sum { get; set; }
        public decimal DZPart { get; set; }
        public decimal YearPercent { get; set; }

        public DateTime CreationDate { get; set; }
    }
}
