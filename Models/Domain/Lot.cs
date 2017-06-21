using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.Domain
{
    public class Lot
    {
        public int Id { get; set; }
        public Contract Contract { get; set; }
        [IgnoreMap]
        public DZ DZ { get; set; }

        public decimal Sum { get; set; }
        public decimal DZPart { get; set; }
        public decimal YearPercent { get; set; }

        public LOT_STATUS Status { get; set; }
        public virtual ICollection<Offer> InvestorOffers { get; set; }

        public DateTime _recordCreated { get; set; }
    }
}
