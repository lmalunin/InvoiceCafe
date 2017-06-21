using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.Domain
{
    public class Contract
    {
        public int Id { get; set; }
        public Guid Guid { get; set; }

        public Company Supplier { get; set; }
        public Company Debtor { get; set; }

        public CONTRACT_TYPE ContractType { get; set; }
        public string ContractNumber { get; set; }
        public string ContractName { get; set; }

        public DateTime DateOfSign { get; set; }

        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int Duration { get; set; }
        public string DaysCount { get; set; }

        public DateTime DebtorObligationsDate { get; set; }
        public DateTime SupplierDeliveryDate { get; set; }
        public DateTime PropertyRightsTransferDate { get; set; }

        public string CounterClaimTerms { get; set; }
        public string MoneyBackTerms { get; set; }
        public string AcceptanceTerms { get; set; }
        public string PaymentTerms { get; set; }
        public string ContractMatter { get; set; }

        public DateTime _recordCreated { get; set; }

        public CONTRACT_DELIVERY_TYPE DeliveryType { get; set; }

        public bool IsCessionAcceptable { get; set; }

        public virtual IList<ContractPersons> ContractPersons { get; set; }

        public virtual IList<DZ> DZ { get; set; }
    }
}
