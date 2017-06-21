using InvoiceCafe.Models.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.ViewModels.DomainViewModels
{
    public class RegisterFormViewModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Требуется организационная форма")]
        public int AgentType { get; set; }
        [Required]
        public int LegalForm { get; set; }
        [Required]
        public string CompanyName { get; set; }
        [Required]
        public string CompanyEmail { get; set; }
        [Required]
        public string CompanyPhone { get; set; }

        public bool IsRezident { get; set; }
        public bool IsESignature { get; set; }
        [Required]
        public string INN { get; set; }
        public string OGRNIP { get; set; }
        public string OGRN { get; set; }

        [Required(ErrorMessage = "Требуется ФИО представителя")]
        public string PersonName { get; set; }
        public string PersonPlaceOfBirth { get; set; }
        [Required]
        public DateTime PersonBirthDate { get; set; }
        public string PersonCitizenship { get; set; }
        public string PersonOccupation { get; set; }
        [Required(ErrorMessage = "Требуется Email/login")]
        public string PersonEmail { get; set; }
        [Required(ErrorMessage = "Требуется пароль")]
        public string PersonPassword { get; set; }
        [Required]
        public string PersonMobilePhone { get; set; }

        public string PersonBirthDate_str { get; set; }

        public bool IsNew { get; set; }
    }
}
