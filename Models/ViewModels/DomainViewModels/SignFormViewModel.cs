using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

/*
import { CompanyViewModel } from './CompanyViewModel';
*/
namespace InvoiceCafe.Models.ViewModels.DomainViewModels
{
    public class SignFormViewModel
    {
        public Guid Id { get; set; }

        public CompanyViewModel Company { get; set; }

        public int AnnualTurnover { get; set; }
        public string FieldOfActivity { get; set; }
        public string WebSite { get; set; }
        public int NumOfConractors { get; set; }
        public int TypeOfContractors { get; set; }

        public string ScanURL_ogrn { get; set; }
        public string ScanURL_ustav { get; set; }
        public string ScanURL_izmen { get; set; }
        public string ScanURL_inn { get; set; }
        public string ScanURL_egrul { get; set; }
        public string ScanURL_reshenie { get; set; }
        public string ScanURL_migrdocs { get; set; }
        public string ScanURL_vstup { get; set; }
        public string ScanURL_rukovod { get; set; }
        public string ScanURL_p_polnom { get; set; }
        public string ScanURL_p_lichn { get; set; }
        public string ScanURL_licen { get; set; }
        public string ScanURL_inoe { get; set; }
        public string ScanURL_vypiska { get; set; }

        public string DirectorFullName { get; set; }
        public DateTime DirectorBDate { get; set; }
        public string DirectorCitizenship { get; set; }
        public string DirectorPlaceOfBirth { get; set; }

        public int Tarif { get; set; }
        public int Status { get; set; }
    }
}
