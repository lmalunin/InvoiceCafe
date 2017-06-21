using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.Domain
{
    public class ContractPersons
    {
        public int Id { get; set; }
        public Contract Contract { get; set; }       
        public Person Person { get; set; }
        public CONTRACT_PERSON_TYPE PersonType { get; set; }
        public Company PersonsCompany { get; set; }

        public DateTime _recordCreated { get; set; }
    }
}
