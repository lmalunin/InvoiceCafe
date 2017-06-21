using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.Domain
{
    public class FilterForLots
    {
        public int Id { get; set; }
        [Required]
        public Guid CompanyId { get; set; }
        public string FilterName { get; set; }
        public bool useFilters { get; set; }
        public bool bySupplierName { get; set; }
        public bool bySupplierDealsSum { get; set; }
        public bool bySupplierDealsDate { get; set; }

        public bool byDebtorName { get; set; }
        public bool byDebtorDealsSum { get; set; }
        public bool byDebtorDealsDate { get; set; }

        public bool byDZDays { get; set; }
        public bool byDZVerType { get; set; }

        public bool byLotSum { get; set; }
        public bool byLotDZPart { get; set; }
        public bool byLotYearPercent { get; set; }

        public string SupplierName { get; set; }
        public decimal SupplierDealsSum_min { get; set; }
        public decimal SupplierDealsSum_max { get; set; }
        public DateTime SupplierDealsDate_from { get; set; }
        public int SupplierDealsDays_min { get; set; }
        public int SupplierDealsDays_max { get; set; }

        public string DebtorName { get; set; }
        public decimal DebtorDealsSum_min { get; set; }
        public decimal DebtorDealsSum_max { get; set; }
        public DateTime DebtorDealsDate_from { get; set; }
        public int DebtorDealsDays_min { get; set; }
        public int DebtorDealsDays_max { get; set; }

        public int DZDays_min { get; set; }
        public int DZDays_max { get; set; }
        public int DZVerType { get; set; }

        public decimal LotSum_min { get; set; }
        public decimal LotSum_max { get; set; }
        public decimal LotDZPart_min { get; set; }
        public decimal LotDZPart_max { get; set; }
        public decimal LotYearPercent_min { get; set; }
        public decimal LotYearPercent_max { get; set; }
    }
}
