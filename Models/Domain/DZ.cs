using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.Domain
{
    public class DZ
    {
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public decimal Sum { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int Days { get; set; }

        public Company Debtor { get; set; }
        public Company Supplier { get; set; }

        public DZ_STATUS Status { get; set; }
        public Contract Contract { get; set; }

        public string DocumentName { get; set; }
        public string sDocumentsURLs { get; set; }

        public virtual IList<Lot> Lots { get; set; }
        public DZ_VERIFICATION_TYPE VerificationType { get; set; }

        public DateTime _recordCreated { get; set; }
    }
}
