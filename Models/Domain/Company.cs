using AutoMapper;
using InvoiceCafe.Models;
using InvoiceCafe.Models.ViewModels.DomainViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.Domain
{
    public class Company
    {
        [Key]
        public Guid Id { get; set; }
        public Guid Guid { get; set; }

        [Required]
        public AGENT_TYPES AgentType { get; set; }
        [Required]
        public int LegalForm { get; set; }
        /*
         * IP
         * OAO
         * ZAO
         * OOO
         */
        [Required]
        public string CompanyName { get; set; }
        public string CompanyEmail { get; set; }
        public string CompanyPhone { get; set; }

        [Required]
        public bool IsRezident { get; set; }
        public bool IsESignature { get; set; }
        [Required]
        public string INN { get; set; }
        public string OGRNIP { get; set; }
        public string OGRN { get; set; }

        public int RegisterSteps { get; set; }   // Какие шаги регистрации пройдены, какие остались. В двоичном формате: 1 - шаг пройден, 0 - шаг не пройден. Т.о., например, если RegisterSteps = 5, т.е. 101 - пройдены шаги 1 и 3, а шаг 2 не пройден

        public DateTime _recordCreated { get; set; }

        public virtual ICollection<Person> Persons { get; set; }
        public virtual ICollection<Offer> InvestorOffers { get; set; }
        //public virtual ICollection<Deal> Deals { get; set; }      // потом подумать, как все-таки добавить это в класс. пока EF ругается 

        /*
        public virtual ICollection<DebtorSupplier> DebtorSupplier { get; set; }
        public virtual ICollection<Company> Debtors { get; set; }
        public virtual ICollection<Company> Suppliers { get; set; }
        */

        public virtual ICollection<FilterForLots> InvestorFilters { get; set; }

        public virtual SignForm SignForm { get; set; }

        public COMPANY_STATUS Status { get; set; }

        public decimal Deals_MaxSum { get; set; }
        public DateTime Deals_LastDate { get; set; }

        public Company()
        { }

        public Company (RegisterFormViewModel appForm)
        {
            Guid = Guid.NewGuid();
            AgentType = (AGENT_TYPES)appForm.AgentType;
            LegalForm = appForm.LegalForm;
            CompanyName = appForm.CompanyName;
            CompanyEmail = appForm.CompanyEmail;
            CompanyPhone = appForm.CompanyPhone;

            IsRezident = appForm.IsRezident;
            IsESignature = appForm.IsESignature;
            INN = appForm.INN;
            OGRN = appForm.OGRN;
            OGRNIP = appForm.OGRNIP;

            Persons = new List<Person>();
        }

        public Company(CompanyViewModel appForm)
        {
            Guid = Guid.NewGuid();
            AgentType = (AGENT_TYPES)appForm.AgentType;
            LegalForm = appForm.LegalForm;
            CompanyName = appForm.CompanyName;
            CompanyEmail = appForm.CompanyEmail;
            CompanyPhone = appForm.CompanyPhone;

            IsRezident = appForm.IsRezident;
            IsESignature = appForm.IsESignature;
            INN = appForm.INN;
            OGRN = appForm.OGRN;
            OGRNIP = appForm.OGRNIP;
        }
    }

    public class DebtorSupplier
    {
        public Guid DebtorId { get; set; }
        public Company Debtor { get; set; }

        public Guid SupplierId { get; set; }
        public Company Supplier { get; set; }
    }
}
