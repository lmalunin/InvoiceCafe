using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.Domain
{
    public class Offer
    {
        public int Id { get; set; }
        public Contract Contract { get; set; }
        public DZ DZ { get; set; }
        public Lot Lot { get; set; }
        public Company Investor { get; set; }

        public decimal DZPart { get; set; }
        public decimal YearPercent { get; set; }

        public OFFER_STATUS Status { get; set; }
        public OFFER_TYPE Type { get; set; }

        public bool Viewed_S { get; set; }  // просмотрен поставщиком. потом переделать на очереди и сообщения

        public DateTime _recordCreated { get; set; }
    }
}
