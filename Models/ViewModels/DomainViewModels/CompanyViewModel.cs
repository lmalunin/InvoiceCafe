using InvoiceCafe.Models.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

/*  прошу оставлять комментарии именно в таком виде: проще копировать блок и переносить его в ts модель
import { UUID } from 'angular2-uuid';
import { PersonViewModel } from './PersonViewModel';
import { SearchLotsViewModel } from './SearchLotsViewModel';
*/

namespace InvoiceCafe.Models.ViewModels.DomainViewModels
{
    public class CompanyViewModel
    {
        public Guid Id { get; set; }
        public Guid Guid { get; set; }

        public int AgentType { get; set; }
        public int LegalForm { get; set; }
        [Required]
        public string CompanyName { get; set; }
        public string CompanyEmail { get; set; }
        public string CompanyPhone { get; set; }

        public bool IsRezident { get; set; }
        public bool IsESignature { get; set; }
        //[Required]
        public string INN { get; set; }
        public string OGRNIP { get; set; }
        public string OGRN { get; set; }

        public int RegisterSteps { get; set; }

        public int Status { get; set; }
        public IList<SearchLotsViewModel> Filters { get; set; }
        public int AddOrUpdate { get; set; }     //1 - create new, 5 - update
    }
}

