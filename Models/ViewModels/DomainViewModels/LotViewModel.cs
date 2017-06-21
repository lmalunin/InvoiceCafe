using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

/*
import { DZViewModel } from './DZViewModel';
*/

namespace InvoiceCafe.Models.ViewModels.DomainViewModels
{
    public class LotViewModel
    {
        public int Id { get; set; }
        public string ContractGuid { get; set; }
        [IgnoreMap]
        public DZViewModel DZ { get; set; }

        public decimal Sum { get; set; }
        public decimal DZPart { get; set; }
        public decimal YearPercent { get; set; }

        public int Status { get; set; }

        public DateTime _recordCreated { get; set; }

        public bool IsChecked { get; set; }
    }
}
