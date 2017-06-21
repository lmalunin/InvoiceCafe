using InvoiceCafe.Data;
using InvoiceCafe.Models.AccountViewModels;
using InvoiceCafe.Models.Domain;
using InvoiceCafe.Models.ViewModels.DomainViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.Engines
{
    public class CompanyEngine
    {
        private readonly ApplicationDbContext _db;

        public CompanyEngine(ApplicationDbContext dbContext)
        {
            _db = dbContext;
        }

        public ICollection<Company> GetDebtorsForSupplier(Company supplier)
        {
            var debtors = from t1 in _db.Companies
                          join t2 in _db.DebtorsSuppliers on t1.Id equals t2.DebtorId
                          where t2.SupplierId == supplier.Id
                          select t1;

            return debtors.ToList();
        }

        public void AddDebtorForSupplier(Company supplier, CompanyViewModel model)
        {
            Company debtor = new Company(model);
            DebtorSupplier link = new DebtorSupplier();

            _db.Companies.Add(debtor);
            link.Debtor = debtor;
            link.Supplier = supplier;
            _db.DebtorsSuppliers.Add(link);

            _db.SaveChanges();
        }
    }
}
