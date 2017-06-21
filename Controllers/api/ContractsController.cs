using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using InvoiceCafe.Models;
using InvoiceCafe.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using InvoiceCafe.Models.Domain;
using InvoiceCafe.Models.ViewModels.DomainViewModels;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System.Threading;
using Microsoft.EntityFrameworkCore.Storage;
using Newtonsoft.Json;

namespace InvoiceCafe.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class ContractsController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _db;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _config;
        private readonly ILogger _logger;
        private readonly string _currentUser, _currentUserId;

        private static string GetDocsForUserBaseUrl;
        private static string DeleteUserDocsBaseUrl;

        private string pathSrc;

        public ContractsController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext dbContext,
            IHttpContextAccessor httpContextAccessor,
            Microsoft.Extensions.Configuration.IConfiguration config,
            ILoggerFactory loggerFactory)
        {
            _userManager = userManager;
            _db = dbContext;
            _config = config;

            _currentUser = httpContextAccessor.HttpContext.User.Identity.Name;
            _currentUserId = userManager.GetUserId(httpContextAccessor.HttpContext.User);
            _logger = loggerFactory.CreateLogger<ContractsController>();

            this.pathSrc = Path.Combine(_config.GetValue<string>("App:TempFileCatalog"), _currentUserId);

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Company, CompanyViewModel>();
                cfg.CreateMap<CompanyViewModel, Company>();
                cfg.CreateMap<Person, PersonViewModel>();
                cfg.CreateMap<PersonViewModel, Person>();
                cfg.CreateMap<ContractViewModel, Contract>();
                cfg.CreateMap<Contract, ContractViewModel>();
                cfg.CreateMap<DZ, DZViewModel>();
                cfg.CreateMap<Lot, LotViewModel>();
            });

            GetDocsForUserBaseUrl = _config.GetValue<string>("App:GetDocsForUserBaseUrl");
            DeleteUserDocsBaseUrl = _config.GetValue<string>("App:DeleteUserDocsBaseUrl");
        }

        [HttpGet]
        [ActionName("GetContractsForSupplier")]
        public IList<ContractViewModel> GetContractsForSupplier(Guid id)    //c83b8385-a9a0-4143-90c5-fc3c33ad736d
        {
            //переделать!!!
            Company supplier = _db.Companies.Where(w => w.Id == id).Single();

            IList<ContractViewModel> contracts = _db.Contracts
                .Include(i => i.Debtor)
                .Where(w => w.Supplier == supplier)
                .OrderByDescending(o => o._recordCreated)
                .Select(i => new ContractViewModel
                {
                    Id = i.Id,
                    Guid = i.Guid,
                    ContractNumber = i.ContractNumber,
                    ContractName = i.ContractName,
                    DateFrom = (DateTime)i.DateFrom,
                    DateTo = (DateTime)i.DateTo,
                    Debtors = new List<CompanyViewModel>() { Mapper.Map<Company, CompanyViewModel>(i.Debtor) },
                    DebtorsSummary = i.Debtor.CompanyName
                }).ToList();

            return contracts;
        }

        [HttpGet]
        [ActionName("GetLotsForSupplier")]
        public IList<LotViewModel> GetLotsForSupplier(string guid)
        {
            Guid g = Guid.Parse(guid);

            IList<LotViewModel> lots = _db.Lots
                .Include(i => i.DZ).ThenInclude(t => t.Debtor)
                .Where(w => w.DZ.Supplier.Guid == g)
                .OrderByDescending(o => o._recordCreated)
                .Select(i => new LotViewModel
                {
                    Id = i.Id,
                    Sum = i.Sum,
                    DZPart = i.DZPart,
                    YearPercent = i.YearPercent,
                    Status = (int)i.Status,
                    DZ = new DZViewModel
                    {
                        Id = (int)i.DZ.Id,
                        DateFrom = (DateTime)i.DZ.DateFrom,
                        DateTo = (DateTime)i.DZ.DateTo,
                        Debtor = new CompanyViewModel
                        {
                            CompanyName = i.DZ.Debtor.CompanyName
                        }
                    }
                }).ToList();

            return lots;
        }

        [HttpGet]
        [ActionName("GetFreeLots")]
        public IList<LotViewModel> GetFreeLots(string guid)    //c83b8385-a9a0-4143-90c5-fc3c33ad736d
        {
            IList<LotViewModel> lots = _db.Lots
                .Include(i => i.DZ).ThenInclude(t => t.Debtor)
                .Include(i => i.DZ).ThenInclude(t => t.Supplier)
                .Select(i => new LotViewModel
                {
                    Id = i.Id,
                    Sum = i.Sum,
                    DZPart = i.DZPart,
                    YearPercent = i.YearPercent,
                    DZ = new DZViewModel
                    {
                        DateFrom = (DateTime)i.DZ.DateFrom,
                        DateTo = (DateTime)i.DZ.DateTo,
                        Debtor = new CompanyViewModel
                        {
                            CompanyName = i.DZ.Debtor.CompanyName
                        },
                        Supplier = new CompanyViewModel
                        {
                            CompanyName = i.DZ.Supplier.CompanyName
                        }
                    }
                }).ToList();

            return lots;
        }

        [HttpPost]
        [ActionName("SearchLots_old")]
        public IActionResult SearchLots_old([FromBody]SearchLotsViewModel filters)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}
            StringBuilder sb = new StringBuilder();
            StringBuilder filtersString = new StringBuilder();
            List<object> sqlParams = new List<object>();

            sb.Append("select lots.* from lots, dz, companies s, companies d ");
            sb.Append("where lots.DZId=dz.Id and dz.DebtorId=d.Id and dz.SupplierId=s.Id ");

            /*
            if (filters.byDebtorName)
                filtersString.Append(" and d.CompanyName like N'%").Append(filters.DebtorName).Append("%'");   //позже экранировать!!!
            if (filters.bySupplierName)
                filtersString.Append(" and s.CompanyName like N'%").Append(filters.SupplierName).Append("%'");   //позже экранировать!!!
            if (filters.byDZDays)
                filtersString.Append(" and dz.Days>=").Append(filters.DZDays_min).Append(" and dz.Days<=").Append(filters.DZDays_max);   //позже добавить проверку на валидный инт!!!
            if (filters.byLotSum)
                filtersString.Append(" and lots.Sum>=").Append(filters.LotSum_min).Append(" and lots.Sum<=").Append(filters.LotSum_max);   //позже добавить проверку на валидный инт!!!
            if (filters.byLotDZPart)
                filtersString.Append(" and lots.DZPart>=").Append(filters.LotDZPart_min).Append(" and lots.DZPart<=").Append(filters.LotDZPart_max);   //позже добавить проверку на валидный инт!!!
            if (filters.byLotYearPercent)
                filtersString.Append(" and lots.YearPercent>=").Append(filters.LotYearPercent_min).Append(" and lots.YearPercent<=").Append(filters.LotYearPercent_max);   //позже добавить проверку на валидный инт!!!
            if (filters.byDZVerType)
                filtersString.Append(" and dz.VerificationType=").Append(filters.DZVerType);   //позже добавить проверку на валидный инт!!!
            if (filters.byDebtorDealsSum)
                filtersString.Append(" and d.Deals_MaxSum>").Append(filters.DebtorDealsSum_min);   //позже добавить проверку на валидный инт!!!
            if (filters.byDebtorDealsDate)
                filtersString.Append(" and d.Deals_LastDate>convert(datetime,'").Append(filters.DebtorDealsDate_from.ToShortDateString()).Append("',104)");     //ну вы поняли
            if (filters.bySupplierDealsSum)
                filtersString.Append(" and s.Deals_MaxSum>").Append(filters.SupplierDealsSum_min);   //позже добавить проверку на валидный инт!!!
            if (filters.bySupplierDealsDate)
                filtersString.Append(" and s.Deals_LastDate>convert(datetime,'").Append(filters.SupplierDealsDate_from.ToShortDateString()).Append("',104)");     //ну вы поняли
                */

            //filtersString.Append(" and (lots.Status<{0})");
            //sqlParams.Add(5);

            //if (filters.DebtorName != null && filters.DebtorName != string.Empty)
            //{
            //    filtersString.Append(" and d.CompanyName like N'%{1}");
            //    sqlParams.Add(filters.DebtorName);
            //}
            //if (filters.SupplierName != null && filters.SupplierName != string.Empty)
            //{
            //    filtersString.Append(" and s.CompanyName like N'%{2}");
            //    sqlParams.Add(filters.SupplierName);
            //}

            //if (filtersString != null)
            //{
            //    sb.Append(" and (lots.Status<5 ").Append(filtersString).Append(")");
            //}
            //else
            //{
            //    // добавить что-то ограиничивающее выборку
            //}


            IList<LotViewModel> lots = _db.Lots.FromSql(sb.ToString(), sqlParams.ToArray())
                .Include(i => i.DZ).ThenInclude(t => t.Debtor)
                .Include(i => i.DZ).ThenInclude(t => t.Supplier)
                .Include(i => i.DZ).ThenInclude(t => t.Contract)
                .OrderByDescending(o => o._recordCreated)
                .Select(i => new LotViewModel
                {
                    Id = i.Id,
                    Sum = i.Sum,
                    DZPart = i.DZPart,
                    YearPercent = i.YearPercent,
                    ContractGuid = i.DZ.Contract.Guid.ToString(),
                    DZ = new DZViewModel
                    {
                        Id = (int)i.DZ.Id,
                        Days = (int)i.DZ.Days,
                        VerificationType = (int)i.DZ.VerificationType,
                        Debtor = new CompanyViewModel
                        {
                            Id = i.DZ.Debtor.Id,
                            CompanyName = i.DZ.Debtor.CompanyName
                        },
                        Supplier = new CompanyViewModel
                        {
                            Id = i.DZ.Supplier.Id,
                            CompanyName = i.DZ.Supplier.CompanyName
                        }
                    }
                }).ToList();

            return Ok(lots);
        }


        [HttpPost]
        [ActionName("SearchLots")]
        public async Task<IActionResult> SearchLots([FromBody]SearchLotsViewModel filter)
        {
            List<object> sqlParams = new List<object>();
            if (filter == null)
                filter = new SearchLotsViewModel();
            /*
            if (filters.byDebtorName)
                filtersString.Append(" and d.CompanyName like N'%").Append(filters.DebtorName).Append("%'");   //позже экранировать!!!
            if (filters.bySupplierName)
                filtersString.Append(" and s.CompanyName like N'%").Append(filters.SupplierName).Append("%'");   //позже экранировать!!!
            if (filters.byDZDays)
                filtersString.Append(" and dz.Days>=").Append(filters.DZDays_min).Append(" and dz.Days<=").Append(filters.DZDays_max);   //позже добавить проверку на валидный инт!!!
            if (filters.byLotSum)
                filtersString.Append(" and lots.Sum>=").Append(filters.LotSum_min).Append(" and lots.Sum<=").Append(filters.LotSum_max);   //позже добавить проверку на валидный инт!!!
            if (filters.byLotDZPart)
                filtersString.Append(" and lots.DZPart>=").Append(filters.LotDZPart_min).Append(" and lots.DZPart<=").Append(filters.LotDZPart_max);   //позже добавить проверку на валидный инт!!!
            if (filters.byLotYearPercent)
                filtersString.Append(" and lots.YearPercent>=").Append(filters.LotYearPercent_min).Append(" and lots.YearPercent<=").Append(filters.LotYearPercent_max);   //позже добавить проверку на валидный инт!!!
            if (filters.byDZVerType)
                filtersString.Append(" and dz.VerificationType=").Append(filters.DZVerType);   //позже добавить проверку на валидный инт!!!
            if (filters.byDebtorDealsSum)
                filtersString.Append(" and d.Deals_MaxSum>").Append(filters.DebtorDealsSum_min);   //позже добавить проверку на валидный инт!!!
            if (filters.byDebtorDealsDate)
                filtersString.Append(" and d.Deals_LastDate>convert(datetime,'").Append(filters.DebtorDealsDate_from.ToShortDateString()).Append("',104)");     //ну вы поняли
            if (filters.bySupplierDealsSum)
                filtersString.Append(" and s.Deals_MaxSum>").Append(filters.SupplierDealsSum_min);   //позже добавить проверку на валидный инт!!!
            if (filters.bySupplierDealsDate)
                filtersString.Append(" and s.Deals_LastDate>convert(datetime,'").Append(filters.SupplierDealsDate_from.ToShortDateString()).Append("',104)");     //ну вы поняли
                */
            int paramCount = 0;
            StringBuilder sb = new StringBuilder();
            sb.Append(@"
		        select 
			        lots.Id as LotId,
			        s.Id as SupplierId,
			        s.CompanyName as SupplierName,
			        d.Id as DebtorId,
			        d.CompanyName as DebtorName,
			        dz.Days as DZDays,
			        lots.DZPart as DZPart,
			        lots.YearPercent as LotYearPercent,
			        lots.Sum as LotSum,
			        lots.Status as LotStatus,
			        lots._recordCreated as _recordCreated
		        from 
			        lots, 
			        dz, 
			        companies s, 
			        companies d
		        where 
			        lots.DZId=dz.Id 
			        and dz.DebtorId=d.Id 
			        and dz.SupplierId=s.Id");

            if (filter.SupplierName != null && filter.SupplierName != string.Empty)
            {
                sb.Append(" and s.CompanyName like {" + paramCount + "}");
                sqlParams.Add("%" + filter.SupplierName + "%");
                paramCount++;
            }
            if (filter.SupplierDealsSum_min > 0)
            {
                sb.Append(" and s.Deals_MaxSum > {" + paramCount + "}");
                sqlParams.Add(filter.SupplierDealsSum_min);
                paramCount++;
            }
            if (filter.SupplierDealsDays_max > 0)
            {
                var d = DateTime.Now.AddDays(-filter.SupplierDealsDays_max);
                sb.Append(" and s.Deals_LastDate > {" + paramCount + "}");
                sqlParams.Add(d);
                paramCount++;
            }
            if (filter.DebtorName != null && filter.DebtorName != string.Empty)
            {
                sb.Append(" and d.CompanyName like {" + paramCount + "}");
                sqlParams.Add("%" + filter.DebtorName + "%");
                paramCount++;
            }
            if (filter.DZDays_max > 0)
            {
                sb.Append(" and dz.Days <= {" + paramCount + "}");
                sqlParams.Add(filter.DZDays_max);
                paramCount++;
            }
            if (filter.DZVerType > 0)
            {
                sb.Append(" and dz.VerificationType = {" + paramCount + "}");
                sqlParams.Add(filter.DZVerType);
                paramCount++;
            }
            if (filter.LotSum_max > 0)
            {
                sb.Append(" and lots.Sum <= {" + paramCount + "}");
                sqlParams.Add(filter.LotSum_max);
                paramCount++;
            }
            if (filter.LotDZPart_max > 0)
            {
                sb.Append(" and lots.DZPart <= {" + paramCount + "}");
                sqlParams.Add(filter.LotDZPart_max);
                paramCount++;
            }
            if (filter.LotYearPercent_max > 0)
            {
                sb.Append(" and lots.YearPercent <= {" + paramCount + "}");
                sqlParams.Add(filter.LotYearPercent_max);
                paramCount++;
            }


            sb.Append(@"
		        order by
			        lots._recordCreated desc");

            // Здесь хак, т.к. пока в EF Core нет прямого вызова SQL (Raw SQL queries for non-Model types). Обещают в версии 1.2 : https://github.com/aspnet/EntityFramework/wiki/Roadmap
            //var dr = _db.Database.ExecuteSqlQuery("SearchLots", sqlParams.ToArray());
            var cts = new CancellationTokenSource();
            var cancellationToken = cts.Token;

            IList<SearchLotsResults> res = new List<SearchLotsResults>();
            try
            {
                var dr = await _db.Database.ExecuteSqlQueryAsync(sb.ToString(), cancellationToken, sqlParams.ToArray());

                while (dr.DbDataReader.Read())
                {
                    res.Add(new SearchLotsResults
                    {
                        LotId = (int)dr.DbDataReader[0],
                        SupplierId = dr.DbDataReader[1].ToString(),
                        SupplierName = dr.DbDataReader[2].ToString(),
                        DebtorId = dr.DbDataReader[3].ToString(),
                        DebtorName = dr.DbDataReader[4].ToString(),
                        DZDays = (int)dr.DbDataReader[5],
                        DZPart = (decimal)dr.DbDataReader[6],
                        LotYearPercent = (decimal)dr.DbDataReader[7],
                        LotSum = (decimal)dr.DbDataReader[8],
                        LotStatus = (int)dr.DbDataReader[9],
                        recordCreated = (DateTime)dr.DbDataReader[10]
                    });
                }
                dr.Dispose();   //нормально ли, что он здесь? выполнится ли при ошибке?
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Mapping error: " + ex.Message);
                return BadRequest(ModelState);
            }

            //IList<SearchLotsResults> lots = _db.Database.SqlQuery("SearchLots", sqlParams.ToArray())  не реализовано в EF Core

            return Ok(res);
        }


        [HttpGet]
        [ActionName("GetContractDetails")]
        public async Task<IActionResult> GetContractDetails(string guid)
        {
            ContractViewModel contract;

            Guid contractGuid = Guid.Parse(guid);

            Contract ctr = await _db.Contracts
                .Include(i => i.ContractPersons).ThenInclude(t => t.Person).ThenInclude(t => t.Company)
                .Include(i => i.Debtor)
                .Include(i => i.Supplier)
                .Include(i => i.DZ).ThenInclude(l => l.Lots)
                .Where(w => w.Guid == contractGuid).FirstOrDefaultAsync();

            try
            {
                contract = Mapper.Map<Contract, ContractViewModel>(ctr);
                contract.DebtorSigners = contract.DebtorSigners ?? new List<PersonViewModel>();
                contract.Debtors = await _db.DebtorsSuppliers.Where(r => r.Supplier.Id == ctr.Supplier.Id).Select(f => f.Debtor).Select(d => Mapper.Map<Company, CompanyViewModel>(d)).ToListAsync();

                contract.SupplierSigner = Mapper.Map<Person, PersonViewModel>(ctr.ContractPersons.Where(w => w.PersonType == CONTRACT_PERSON_TYPE.SUPPLIER_SIGNER && w.PersonsCompany.Id == contract.Supplier.Id).Select(s => s.Person).FirstOrDefault());
                contract.SupplierSigner.GetDocsBaseUrl = GetDocsForUserBaseUrl;
                contract.SupplierSigner.DeleteDocsBaseUrl = DeleteUserDocsBaseUrl;

                IQueryable<Person> debtorSigners = ctr.ContractPersons.
                    Where(cp => cp.PersonsCompany.Id == ctr.Debtor.Id && cp.PersonType == CONTRACT_PERSON_TYPE.DEBTOR_SIGNER)
                    .Select(cpp => cpp.Person).AsQueryable();

                foreach (Person p in debtorSigners)
                {
                    var personVM = Mapper.Map<Person, PersonViewModel>(p);
                    personVM.GetDocsBaseUrl = GetDocsForUserBaseUrl;
                    personVM.DeleteDocsBaseUrl = DeleteUserDocsBaseUrl;
                    contract.DebtorSigners.Add(personVM);
                }

                foreach (DZViewModel dz in contract.DZ)
                    dz.DocumentsURLs = dz.sDocumentsURLs.Split('|');

                contract.DZ.ToList().Sort((dz1, dz2) => (dz2._recordCreated.CompareTo(dz1._recordCreated)));
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Mapping error: " + ex.Message);
                return BadRequest(ModelState);
            }

            return Ok(contract);
        }

        [HttpGet]
        [ActionName("GetLotDetails")]
        public IActionResult GetLotDetails(int id)    //c83b8385-a9a0-4143-90c5-fc3c33ad736d
        {
            LotViewModel lotVM;

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Company, CompanyViewModel>();
                cfg.CreateMap<Person, PersonViewModel>();
                cfg.CreateMap<DZ, DZViewModel>();
                cfg.CreateMap<Contract, ContractViewModel>();
                cfg.CreateMap<Lot, LotViewModel>();
            });

            try
            {
                lotVM = _db.Lots.Include(i => i.DZ).ThenInclude(t => t.Supplier)
                    .Include(i => i.DZ).ThenInclude(t => t.Debtor)
                    .Include(i => i.Contract).Where(w => w.Id == id).Select(s => new LotViewModel
                    {
                        Id = s.Id,
                        ContractGuid = s.Contract.Guid.ToString(),

                        Sum = s.Sum,
                        DZPart = s.DZPart,
                        YearPercent = s.YearPercent,

                        Status = (int)s.Status,

                        DZ = new DZViewModel
                        {
                            Id = (int)s.DZ.Id,
                            Days = (int)s.DZ.Days,
                            Sum = (decimal)s.DZ.Sum,        //зачем приведение.. но без него почему то ошибка. разобраться позже
                            Status = (int)s.DZ.Status,
                            DateFrom = (DateTime)s.DZ.DateFrom,
                            DateTo = (DateTime)s.DZ.DateTo,
                            Supplier = Mapper.Map<Company, CompanyViewModel>(s.DZ.Supplier),
                            Debtor = Mapper.Map<Company, CompanyViewModel>(s.DZ.Debtor),
                            DocumentName = s.DZ.DocumentName,
                            DocumentsURLs = s.DZ.sDocumentsURLs.Split('|')
                        }
                    }).Single();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Mapping error: " + ex.Message);
                return BadRequest(ModelState);
            }

            return Ok(lotVM);
        }

        [HttpGet]
        [ActionName("GetOfferDetails")]
        public IActionResult GetOfferDetails(int id)    //c83b8385-a9a0-4143-90c5-fc3c33ad736d
        {
            OfferViewModel offerVM;

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Company, CompanyViewModel>();
                cfg.CreateMap<Person, PersonViewModel>();
                cfg.CreateMap<DZ, DZViewModel>();
                cfg.CreateMap<Contract, ContractViewModel>();
                cfg.CreateMap<Lot, LotViewModel>();
                cfg.CreateMap<Offer, OfferViewModel>();
            });

            try
            {
                offerVM = _db.Offers.Include(i => i.DZ)
                    .Include(i => i.Lot)
                    .Include(i => i.Investor)
                    .Include(i => i.DZ).ThenInclude(t => t.Debtor)
                    .Include(i => i.Contract).Where(w => w.Id == id).Select(s => new OfferViewModel
                    {
                        Id = s.Id,
                        ContractGuid = s.Contract.Guid.ToString(),

                        DZPart = s.DZPart,
                        YearPercent = s.YearPercent,

                        Status = (int)s.Status,
                        Lot = Mapper.Map<Lot, LotViewModel>(s.Lot),
                        Investor = Mapper.Map<Company, CompanyViewModel>(s.Investor),
                        DZ = new DZViewModel
                        {
                            Id = (int)s.DZ.Id,
                            Days = (int)s.DZ.Days,
                            Sum = (decimal)s.DZ.Sum,        //зачем приведение.. но без него почему то ошибка. разобраться позже
                            Status = (int)s.DZ.Status,
                            Supplier = Mapper.Map<Company, CompanyViewModel>(s.DZ.Supplier),
                            Debtor = Mapper.Map<Company, CompanyViewModel>(s.DZ.Debtor),
                            DocumentsURLs = s.DZ.sDocumentsURLs.Split('|')
                        }
                    }).Single();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Mapping error: " + ex.Message);
                return BadRequest(ModelState);
            }

            return Ok(offerVM);
        }

        [HttpGet]
        [ActionName("GetDZDetails")]
        public IActionResult GetDZDetails(int id)    //c83b8385-a9a0-4143-90c5-fc3c33ad736d
        {
            DZViewModel dzVM;

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Company, CompanyViewModel>();
                cfg.CreateMap<Person, PersonViewModel>();
                cfg.CreateMap<DZ, DZViewModel>();
                cfg.CreateMap<Contract, ContractViewModel>();
                cfg.CreateMap<Lot, LotViewModel>();
            });

            dzVM = _db.DZ.Include(t => t.Supplier)
                .Include(t => t.Debtor)
                .Include(i => i.Contract).Where(w => w.Id == id).Select(s => new DZViewModel
                {
                    Id = (int)s.Id,
                    Days = (int)s.Days,
                    Sum = (decimal)s.Sum,        //зачем приведение.. но без него почему то ошибка. разобраться позже
                    DateFrom = (DateTime)s.DateFrom,
                    DateTo = (DateTime)s.DateTo,
                    Status = (int)s.Status,
                    Supplier = Mapper.Map<Company, CompanyViewModel>(s.Supplier),
                    Debtor = Mapper.Map<Company, CompanyViewModel>(s.Debtor),
                    DocumentsURLs = s.sDocumentsURLs.Split('|'),
                    DocumentName = s.DocumentName,
                    ContractGuid = s.Contract.Guid.ToString()
                }).Single();

            try
            {

            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Mapping error: " + ex.Message);
                return BadRequest(ModelState);
            }

            return Ok(dzVM);
        }

        [HttpPost]
        [ActionName("Add")]
        public async Task<IActionResult> Add([FromBody]ContractViewModel model)
        {
            Person supplierSigner, debtorSigner;
            Contract contract;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                supplierSigner = Mapper.Map<PersonViewModel, Person>(model.SupplierSigner);
                debtorSigner = Mapper.Map<PersonViewModel, Person>(model.DebtorSigners[0]);
                if (string.IsNullOrEmpty(supplierSigner.FullPowersDocumentsNames)) { supplierSigner.FullPowersDocumentsNames = "[]"; }
                if (string.IsNullOrEmpty(supplierSigner.IdentityDocumentsNames)) { supplierSigner.IdentityDocumentsNames = "[]"; }
                if (string.IsNullOrEmpty(debtorSigner.FullPowersDocumentsNames)) { debtorSigner.FullPowersDocumentsNames = "[]"; }
                if (string.IsNullOrEmpty(debtorSigner.IdentityDocumentsNames)) { debtorSigner.IdentityDocumentsNames = "[]"; }

                contract = Mapper.Map<ContractViewModel, Contract>(model);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Mapping error: " + ex.Message);
                return BadRequest(ModelState);
            }

            contract.Guid = Guid.NewGuid();
            contract._recordCreated = DateTime.Now;
            var currentUser = _db.Persons.Include(i => i.Company).Where(p => p.Id.ToString() == _currentUserId).Single();

            string pathDst = Path.Combine(_config.GetValue<string>("App:FileStorageCatalog"), currentUser.Company.Guid.ToString(), contract.Guid.ToString());

            if (!System.IO.Directory.Exists(pathDst))
            {
                System.IO.Directory.CreateDirectory(pathDst);
            }

            if (supplierSigner.AuthDocumentURL != null && System.IO.File.Exists(Path.Combine(pathSrc, supplierSigner.AuthDocumentURL)))
            {
                System.IO.File.Copy(Path.Combine(pathSrc, supplierSigner.AuthDocumentURL), Path.Combine(pathDst, supplierSigner.AuthDocumentURL));
            }
            else
            {
                ModelState.AddModelError("Server", "No supplierSigner.AuthDocumentURL provided");
                return BadRequest(ModelState);
            }

            if (debtorSigner.AuthDocumentURL != null && System.IO.File.Exists(Path.Combine(pathSrc, debtorSigner.AuthDocumentURL)))
            {
                System.IO.File.Copy(Path.Combine(pathSrc, debtorSigner.AuthDocumentURL), Path.Combine(pathDst, debtorSigner.AuthDocumentURL));
            }
            else
            {
                ModelState.AddModelError("Server", "No debtorSigner.AuthDocumentURL provided");
                return BadRequest(ModelState);
            }

            contract.Supplier = currentUser.Company;
            try
            {
                contract.Debtor = Mapper.Map<CompanyViewModel, Company>(model.Debtors[0]);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "No correct debtor provided");
                return BadRequest(ModelState);
            }

            supplierSigner.Company = currentUser.Company;

            contract.ContractPersons = new List<ContractPersons>();
            contract.ContractPersons.Add(new ContractPersons
            {
                Contract = contract,
                Person = supplierSigner,
                PersonsCompany = currentUser.Company,
                PersonType = CONTRACT_PERSON_TYPE.SUPPLIER_SIGNER
            });
            contract.ContractPersons.Add(new ContractPersons
            {
                Contract = contract,
                Person = debtorSigner,
                PersonsCompany = debtorSigner.Company,
                PersonType = CONTRACT_PERSON_TYPE.DEBTOR_SIGNER
            });

            try
            {
                _db.Contracts.Add(contract);
                _db.Entry(contract.Supplier).State = EntityState.Unchanged;
                _db.Entry(contract.Debtor).State = EntityState.Unchanged;
                contract.ContractPersons.ToList().ForEach(i => _db.Entry(i.PersonsCompany).State = EntityState.Unchanged);
                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Saving error: " + ex.Message);
                return BadRequest(ModelState);
            }

            System.IO.File.Delete(Path.Combine(pathSrc, supplierSigner.AuthDocumentURL));
            System.IO.File.Delete(Path.Combine(pathSrc, debtorSigner.AuthDocumentURL));
            return Ok(model);
        }

        [HttpPost]
        public async Task<IActionResult> Update([FromBody]string[] body)
        {
            var contract = JsonConvert.DeserializeObject<ContractViewModel>(body[0]);
            var debtor = JsonConvert.DeserializeObject<CompanyViewModel>(body[1]);

            try
            {
                Contract ctr = await _db.Contracts
                    .Include(i => i.ContractPersons).ThenInclude(t => t.Person)
                    .Include(i => i.Debtor)
                    .Include(i => i.Supplier)
                    .Where(w => w.Guid == contract.Guid).FirstOrDefaultAsync();

                var supplierSigner = ctr.ContractPersons.FirstOrDefault(cp => cp.Person.Id == contract.SupplierSigner.Id).Person;

                Mapper.Map(contract, ctr);
                Mapper.Map(contract.Supplier, ctr.Supplier);
                Mapper.Map(contract.SupplierSigner, supplierSigner);

                if (contract.DebtorSigners[0].Id == Guid.Empty)
                {
                    var dc = _db.Companies.FirstOrDefault(c => c.Id == debtor.Id);
                    var contractPersons = new ContractPersons()
                    {
                        
                        Person = Mapper.Map<PersonViewModel, Person>(contract.DebtorSigners[0]),
                        Contract = ctr,
                        PersonType = CONTRACT_PERSON_TYPE.DEBTOR_SIGNER,
                        PersonsCompany = dc,
                        _recordCreated = DateTime.UtcNow
                    };
                    _db.Entry(contractPersons.PersonsCompany).State = EntityState.Modified;
                    ctr.ContractPersons.Add(contractPersons);
                    ctr.Debtor = dc;
                }
                else
                {
                    Mapper.Map(contract.DebtorSigners[0], ctr.ContractPersons.FirstOrDefault(cp => cp.Person.Id == contract.DebtorSigners[0].Id).Person);
                    Mapper.Map(debtor, ctr.Debtor);
                }

                await _db.SaveChangesAsync();

                string pathDst = Path.Combine(_config.GetValue<string>("App:FileStorageCatalog"), contract.SupplierSigner.Company.Id.ToString(), contract.SupplierSigner.Id.ToString());
                if (!Directory.Exists(pathDst))
                {
                    Directory.CreateDirectory(pathDst);
                }
                if (!string.IsNullOrEmpty(supplierSigner.FullPowersDocumentsNames) && supplierSigner.FullPowersDocumentsNames != "[]")
                {
                    var FullPowersDocumentsNames = JArray.Parse(supplierSigner.FullPowersDocumentsNames);
                    var FullPowersDocumentsNames_Response = _File_Relocation(FullPowersDocumentsNames, pathSrc, pathDst);
                }

                pathDst = Path.Combine(_config.GetValue<string>("App:FileStorageCatalog"), contract.DebtorSigners[0].Company.Id.ToString(), contract.DebtorSigners[0].Id.ToString());
                if (!Directory.Exists(pathDst))
                {
                    Directory.CreateDirectory(pathDst);
                }
                if (!string.IsNullOrEmpty(contract.DebtorSigners[0].FullPowersDocumentsNames) && contract.DebtorSigners[0].FullPowersDocumentsNames != "[]")
                {
                    var FullPowersDocumentsNames = JArray.Parse(contract.DebtorSigners[0].FullPowersDocumentsNames);
                    var FullPowersDocumentsNames_Response = _File_Relocation(FullPowersDocumentsNames, pathSrc, pathDst);
                }

                contract.DebtorSigners[0].GetDocsBaseUrl = GetDocsForUserBaseUrl;
                contract.DebtorSigners[0].DeleteDocsBaseUrl = DeleteUserDocsBaseUrl;
            }
            catch (Exception ex)
            {
#if DEBUG
                ModelState.AddModelError("UpdateContract", ex.Message);
                return BadRequest(ModelState);
#else
                _logger.LogError(ex.Message);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
#endif
            }

            return Ok(contract);
        }

        [HttpPost]
        [ActionName("AddDz")]
        public async Task<IActionResult> AddDz([FromBody]DZViewModel model)
        {
            DZ dz;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<CompanyViewModel, Company>();
                cfg.CreateMap<DZViewModel, DZ>();
            });

            try
            {
                dz = Mapper.Map<DZViewModel, DZ>(model);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Mapping error: " + ex.Message);
                return BadRequest(ModelState);
            }

            var currentUser = _db.Persons.Include(i => i.Company).Where(p => p.Id.ToString() == _currentUserId).Single();
            dz.Status = DZ_STATUS.ToAcceptByDebtor;
            dz.sDocumentsURLs = model.DocumentsURLs.Aggregate((current, next) => current + "|" + next);

            //кривовато, потом переделать - лишний запрос к БД
            Contract contract = _db.Contracts.Where(w => w.Guid.ToString() == model.ContractGuid).Single();

            dz.Contract = contract;
            dz.Supplier = currentUser.Company;
            dz._recordCreated = DateTime.Now;
            try
            {
                _db.DZ.Add(dz);
                _db.Entry(dz.Debtor).State = EntityState.Unchanged;
                _db.Entry(dz.Supplier).State = EntityState.Unchanged;
                _db.Entry(dz.Contract).State = EntityState.Unchanged;
                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Saving error: " + ex.Message);
                return BadRequest(ModelState);
            }

            string pathSrc = Path.Combine(_config.GetValue<string>("App:TempFileCatalog"), _currentUserId);
            string pathDst = Path.Combine(_config.GetValue<string>("App:FileStorageCatalog"),
                currentUser.Company.Guid.ToString(), model.ContractGuid.ToString(), dz.Id.ToString());

            if (!System.IO.Directory.Exists(pathDst))
            {
                System.IO.Directory.CreateDirectory(pathDst);
            }

            try
            {
                foreach (string fName in model.DocumentsURLs)
                    _transfer_file(fName, pathSrc, pathDst);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Moving files error: " + ex.Message);
                return BadRequest(ModelState);
            }

            return Ok(model);
        }

        [HttpPost]
        [ActionName("AddLot")]
        public async Task<IActionResult> AddLot([FromBody]LotViewModel model)
        {
            Lot lot;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<CompanyViewModel, Company>();
                cfg.CreateMap<DZViewModel, DZ>();
                cfg.CreateMap<LotViewModel, Lot>();
            });

            try
            {
                lot = Mapper.Map<LotViewModel, Lot>(model);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Mapping error: " + ex.Message);
                return BadRequest(ModelState);
            }

            var currentUser = _db.Persons.Include(i => i.Company).Where(p => p.Id.ToString() == _currentUserId).Single();
            lot.Status = LOT_STATUS.ReadyForSale;

            //кривовато, потом переделать - лишний запрос к БД
            Contract contract = _db.Contracts
                .Include(i => i.DZ)
                .Where(w => w.Guid.ToString() == model.ContractGuid).Single();

            lot.Contract = contract;
            lot.DZ = contract.DZ.Single(i => i.Id == model.DZ.Id);  //прочитаем референсный объект ДЗ из базы, т.к. сейчас будем обновлять, чтобы не перезаписать грязными данными из viewmodel
            lot.DZ.Status = DZ_STATUS.AtAuction;
            lot._recordCreated = DateTime.Now;
            try
            {
                _db.Lots.Add(lot);
                //_db.Entry(lot.DZ.Debtor).State = EntityState.Unchanged;
                //_db.Entry(lot.DZ).State = EntityState.Unchanged;
                _db.Entry(lot.Contract).State = EntityState.Unchanged;
                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Saving error: " + ex.Message);
                return BadRequest(ModelState);
            }

            return Ok(model);
        }

        [HttpPost]
        [ActionName("ProcessOffer")]
        public async Task<IActionResult> ProcessOffer([FromBody]OfferViewModel model)
        {
            Offer offer;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<CompanyViewModel, Company>();
                cfg.CreateMap<DZViewModel, DZ>();
                cfg.CreateMap<LotViewModel, Lot>();
            });

            try
            {
                offer = await _db.Offers
                    .Include(i => i.Lot)
                    .Include(i => i.DZ)
                    .Include(i => i.Investor)
                    .Include(i => i.DZ).ThenInclude(i => i.Supplier)
                    .Include(i => i.DZ).ThenInclude(i => i.Debtor)
                    .Where(w => w.Id == model.Id).SingleAsync();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Database error: " + ex.Message);
                return BadRequest(ModelState);
            }

            var currentUser = _db.Persons.Include(i => i.Company).Where(p => p.Id.ToString() == _currentUserId).Single();

            if (model.Status == (int)OFFER_STATUS.Accepted)
            {
                offer.Status = OFFER_STATUS.Accepted;
                offer.Lot.Status = LOT_STATUS.CounterOfferAcceptedBySupplier;
                offer.DZ.Status = DZ_STATUS.Sold;

                //этот же код есть в создании сделки для быстрого акцепта инвестором. потом свести все в одно место
                offer.DZ.Supplier.Deals_LastDate = DateTime.Now;
                offer.DZ.Supplier.Deals_MaxSum = Math.Max(offer.DZ.Supplier.Deals_MaxSum, offer.Lot.Sum);
                offer.DZ.Debtor.Deals_LastDate = DateTime.Now;
                offer.DZ.Debtor.Deals_MaxSum = Math.Max(offer.DZ.Debtor.Deals_MaxSum, offer.Lot.Sum);
                Deal deal = new Deal
                {
                    DZPart = offer.DZPart,
                    YearPercent = offer.YearPercent,
                    Offer = offer,
                    Lot = offer.Lot,
                    DZ = offer.DZ,
                    Investor = offer.Investor,
                    Supplier = offer.DZ.Supplier,
                    Debtor = offer.DZ.Debtor,
                    Sum = offer.Lot.Sum,
                    CreationDate = DateTime.Now
                };
                _db.Deals.Add(deal);
            }
            else
            {
                offer.Lot.Status = LOT_STATUS.ReadyForSale;
                offer.Status = OFFER_STATUS.Declined;
            }


            try
            {
                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Saving error: " + ex.Message);
                return BadRequest(ModelState);
            }

            return Ok(model);
        }

        [HttpPost]
        [ActionName("AddOffers")]
        public async Task<IActionResult> AddOffers([FromBody]IList<SearchLotsResults> model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //Mapper.Initialize(cfg =>
            //{
            //    cfg.CreateMap<CompanyViewModel, Company>();
            //    cfg.CreateMap<DZViewModel, DZ>();
            //    cfg.CreateMap<LotViewModel, Lot>();
            //    cfg.CreateMap<OfferViewModel, Offer>();
            //});

            var currentUser = _db.Persons.Include(i => i.Company).Where(p => p.Id.ToString() == _currentUserId).Single();

            try
            {
                foreach (SearchLotsResults item in model)
                {
                    Offer offer = new Offer();
                    offer.Investor = currentUser.Company;
                    offer.Lot = await _db.Lots
                        .Include(i => i.DZ).ThenInclude(t => t.Supplier)
                        .Include(i => i.DZ).ThenInclude(t => t.Debtor)
                        .Where(w => w.Id == item.LotId).SingleAsync();

                    offer.DZ = offer.Lot.DZ;

                    offer.DZPart = item.OfferDZPart;
                    offer.YearPercent = item.OfferYearPercent;
                    offer.Type = (OFFER_TYPE)item.OfferType;

                    offer.Viewed_S = false;
                    offer._recordCreated = DateTime.Now;

                    if (offer.Type == OFFER_TYPE.Equal)
                    {
                        offer.Status = OFFER_STATUS.Accepted;
                        offer.Lot.Status = LOT_STATUS.AcceptedByInvestor;
                        offer.DZ.Status = DZ_STATUS.Sold;

                        //раз обе стороны согласились с условиями, сразу создаем сделку
                        //этот же код есть в акцепте сделки поставщиком потом свести все в одно место
                        offer.DZ.Supplier.Deals_LastDate = DateTime.Now;
                        offer.DZ.Supplier.Deals_MaxSum = Math.Max(offer.DZ.Supplier.Deals_MaxSum, offer.Lot.Sum);
                        offer.DZ.Debtor.Deals_LastDate = DateTime.Now;
                        offer.DZ.Debtor.Deals_MaxSum = Math.Max(offer.DZ.Debtor.Deals_MaxSum, offer.Lot.Sum);

                        Deal deal = new Deal
                        {
                            DZPart = offer.DZPart,
                            YearPercent = offer.YearPercent,
                            Offer = offer,
                            Lot = offer.Lot,
                            DZ = offer.DZ,
                            Investor = currentUser.Company,
                            Supplier = offer.DZ.Supplier,
                            Debtor = offer.DZ.Debtor,
                            Sum = offer.Lot.Sum,
                            CreationDate = DateTime.Now
                        };
                        _db.Deals.Add(deal);
                    }
                    else
                    {
                        offer.Status = OFFER_STATUS.Accepting_by_supplier;
                        offer.Lot.Status = LOT_STATUS.CounterOfferByInvestor;
                    }

                    _db.Offers.Add(offer);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Mapping error: " + ex.Message);
                return BadRequest(ModelState);
            }

            try
            {
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Server", "Saving error: " + ex.Message);
                return BadRequest(ModelState);
            }

            return Ok(model);
        }

        //[HttpPost]
        //[ActionName("AddOffers")]
        //public async Task<IActionResult> AddOffers([FromBody]IList<OfferViewModel> model)
        //{
        //    IList<Offer> offers = new List<Offer>();
        //    //ModelState["[0].Lot.DZ.DocumentName"].Errors.Clear();
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    Mapper.Initialize(cfg =>
        //    {
        //        cfg.CreateMap<CompanyViewModel, Company>();
        //        cfg.CreateMap<DZViewModel, DZ>();
        //        cfg.CreateMap<LotViewModel, Lot>();
        //        cfg.CreateMap<OfferViewModel, Offer>();
        //    });

        //    var currentUser = _db.Persons.Include(i => i.Company).Where(p => p.Id.ToString() == _currentUserId).Single();

        //    try
        //    {
        //        foreach (OfferViewModel offerVM in model)
        //        {
        //            Offer offer = Mapper.Map<OfferViewModel, Offer>(offerVM);
        //            offer.Investor = currentUser.Company;
        //            //offer.DZ = new DZ { Id = offerVM.Lot.DZ.Id };
        //            offer.DZ = Mapper.Map<DZViewModel, DZ>(offerVM.Lot.DZ);

        //            offer.DZ.Supplier = await _db.Companies.SingleAsync(i => i.Id == offerVM.Lot.DZ.Supplier.Id);  //не очень оптимальный код, потом переделать
        //            offer.DZ.Debtor = await _db.Companies.SingleAsync(i => i.Id == offerVM.Lot.DZ.Debtor.Id);

        //            offer.Viewed_S = false;
        //            offer._recordCreated = DateTime.Now;

        //            if (offer.Type == OFFER_TYPE.Equal)
        //            {
        //                offer.Status = OFFER_STATUS.Accepted;
        //                //этот же код есть в акцепте сделки поставщиком потом свести все в одно место
        //                offer.DZ.Supplier.Deals_LastDate = DateTime.Now;
        //                offer.DZ.Supplier.Deals_MaxSum = Math.Max(offer.DZ.Supplier.Deals_MaxSum, offer.Lot.Sum);
        //                offer.DZ.Debtor.Deals_LastDate = DateTime.Now;
        //                offer.DZ.Debtor.Deals_MaxSum = Math.Max(offer.DZ.Debtor.Deals_MaxSum, offer.Lot.Sum);

        //                Deal deal = new Deal
        //                {
        //                    DZPart = offer.DZPart,
        //                    YearPercent = offer.YearPercent,
        //                    Offer = offer,
        //                    Lot = offer.Lot,
        //                    DZ = offer.DZ,
        //                    Investor = currentUser.Company,
        //                    Supplier = offer.DZ.Supplier,
        //                    Debtor = offer.DZ.Debtor,
        //                    Sum = offer.Lot.Sum,
        //                    CreationDate = DateTime.Now
        //                };
        //                _db.Deals.Add(deal);
        //                _db.Entry(deal.Lot).State = EntityState.Unchanged;
        //                _db.Entry(deal.DZ).State = EntityState.Unchanged;
        //                _db.Entry(deal.Investor).State = EntityState.Unchanged;
        //                //_db.Entry(deal.Supplier).State = EntityState.Unchanged;
        //                //_db.Entry(deal.Debtor).State = EntityState.Unchanged;
        //            }
        //            else
        //            {
        //                offer.Status = OFFER_STATUS.Accepting_by_supplier;
        //            }

        //            _db.Offers.Add(offer);
        //            _db.Entry(offer.DZ).State = EntityState.Unchanged;
        //            _db.Entry(offer.Investor).State = EntityState.Unchanged;
        //            _db.Entry(offer.Lot).State = EntityState.Unchanged;
        //            //offers.Add(offer);

        //            Lot lot = await _db.Lots
        //                .Include(i => i.DZ)
        //                .SingleAsync(i => i.Id == offer.Lot.Id);

        //            if (offer.Status == OFFER_STATUS.Accepted)
        //                lot.Status = LOT_STATUS.AcceptedByInvestor;
        //            if (offer.Status == OFFER_STATUS.Accepting_by_supplier)
        //                lot.Status = LOT_STATUS.CounterOfferByInvestor;
        //            lot.DZ.Status = DZ_STATUS.Sold;
        //            await _db.SaveChangesAsync();
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        ModelState.AddModelError("Server", "Mapping error: " + ex.Message);
        //        return BadRequest(ModelState);
        //    }

        //    try
        //    {
        //    }
        //    catch (Exception ex)
        //    {
        //        ModelState.AddModelError("Server", "Saving error: " + ex.Message);
        //        return BadRequest(ModelState);
        //    }

        //    return Ok(model);
        //}

        [HttpGet]
        [ActionName("GetOffersForInvestor")]
        public IActionResult GetOffersForInvestor(string guid)    //c83b8385-a9a0-4143-90c5-fc3c33ad736d
        {
            Guid g = Guid.Parse(guid);

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Company, CompanyViewModel>();
                cfg.CreateMap<DZ, DZViewModel>();
                cfg.CreateMap<Lot, LotViewModel>();
                cfg.CreateMap<Offer, OfferViewModel>();
            });

            IList<OfferViewModel> offersVM = _db.Offers
                .Include(i => i.DZ)
                .Include(i => i.DZ).ThenInclude(i => i.Debtor)
                .Include(i => i.DZ).ThenInclude(i => i.Supplier)
                .Include(i => i.Investor)
                .Include(i => i.Lot)
                .Where(i => i.Investor.Guid == g)
                .OrderByDescending(o => o._recordCreated)
                .Select(i => new OfferViewModel
                {
                    Id = i.Id,
                    DZPart = i.DZPart,
                    YearPercent = i.YearPercent,
                    Lot = Mapper.Map<Lot, LotViewModel>(i.Lot),
                    Investor = Mapper.Map<Company, CompanyViewModel>(i.Investor),
                    Type = (int)i.Type,
                    Status = (int)i.Status,
                    DZ = new DZViewModel
                    {
                        Id = (int)i.DZ.Id,
                        Days = (int)i.DZ.Days,
                        Sum = (decimal)i.DZ.Sum,        //зачем приведение.. но без него почему то ошибка. разобраться позже
                        Status = (int)i.DZ.Status,
                        VerificationType = (int)i.DZ.VerificationType,
                        Supplier = Mapper.Map<Company, CompanyViewModel>(i.DZ.Supplier),
                        Debtor = Mapper.Map<Company, CompanyViewModel>(i.DZ.Debtor),
                        DocumentsURLs = i.DZ.sDocumentsURLs.Split('|')
                    }
                })
                .ToList();

            return Ok(offersVM);
        }

        [HttpGet]
        [ActionName("GetOffersForSupplier")]
        public IActionResult GetOffersForSupplier(string guid)    //точная копия предыдущего метода, потом порефакторить
        {
            Guid g = Guid.Parse(guid);

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Company, CompanyViewModel>();
                cfg.CreateMap<DZ, DZViewModel>();
                cfg.CreateMap<Lot, LotViewModel>();
                cfg.CreateMap<Offer, OfferViewModel>();
            });

            IList<OfferViewModel> offersVM = _db.Offers
                .Include(i => i.Investor)
                .Include(i => i.DZ)
                .Include(i => i.DZ).ThenInclude(i => i.Debtor)
                .Include(i => i.DZ).ThenInclude(i => i.Supplier)
                .Include(i => i.Lot)
                .Where(i => i.DZ.Supplier.Guid == g)
                .OrderByDescending(o => o._recordCreated)
                .Select(i => new OfferViewModel
                {
                    Id = i.Id,
                    DZPart = i.DZPart,
                    YearPercent = i.YearPercent,
                    Lot = Mapper.Map<Lot, LotViewModel>(i.Lot),
                    Type = (int)i.Type,
                    Status = (int)i.Status,
                    Investor = Mapper.Map<Company, CompanyViewModel>(i.Investor),
                    DZ = new DZViewModel
                    {
                        Id = (int)i.DZ.Id,
                        Days = (int)i.DZ.Days,
                        Sum = (decimal)i.DZ.Sum,        //зачем приведение.. но без него почему то ошибка. разобраться позже
                        Status = (int)i.DZ.Status,
                        VerificationType = (int)i.DZ.VerificationType,
                        Supplier = Mapper.Map<Company, CompanyViewModel>(i.DZ.Supplier),
                        Debtor = Mapper.Map<Company, CompanyViewModel>(i.DZ.Debtor),
                        DocumentsURLs = i.DZ.sDocumentsURLs.Split('|')
                    }
                })
                .ToList();

            return Ok(offersVM);
        }

        [HttpGet]
        [ActionName("GetDealsForInvestor")]
        public IActionResult GetDealsForInvestor(string guid)
        {
            Guid g = Guid.Parse(guid);

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Company, CompanyViewModel>();
                cfg.CreateMap<DZ, DZViewModel>();
                cfg.CreateMap<Lot, LotViewModel>();
                cfg.CreateMap<Offer, OfferViewModel>();
                cfg.CreateMap<Deal, DealViewModel>();
            });

            IList<DealViewModel> dealsVM = _db.Deals
                .Include(i => i.DZ)
                .Include(i => i.Debtor)
                .Include(i => i.Supplier)
                .Include(i => i.Investor)
                .Include(i => i.Lot)
                .Where(i => i.Investor.Guid == g)
                .OrderByDescending(o => o.CreationDate)
                .Select(i => Mapper.Map<Deal, DealViewModel>(i))
                .ToList();

            return Ok(dealsVM);
        }

        [HttpGet]
        [ActionName("GetDealsForSupplier")]
        public IActionResult GetDealsForSupplier(string guid)
        {
            Guid g = Guid.Parse(guid);

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Company, CompanyViewModel>();
                cfg.CreateMap<DZ, DZViewModel>();
                cfg.CreateMap<Lot, LotViewModel>();
                cfg.CreateMap<Offer, OfferViewModel>();
                cfg.CreateMap<Deal, DealViewModel>();
            });

            IList<DealViewModel> dealsVM = _db.Deals
                .Include(i => i.DZ)
                .Include(i => i.Debtor)
                .Include(i => i.Supplier)
                .Include(i => i.Investor)
                .Include(i => i.Lot)
                .Where(i => i.Supplier.Guid == g)
                .OrderByDescending(o => o.CreationDate)
                .Select(i => Mapper.Map<Deal, DealViewModel>(i))
                .ToList();

            return Ok(dealsVM);
        }

        private void _transfer_file(string fileName, string pathSrc, string pathDst)
        {
            if (fileName != null && System.IO.File.Exists(Path.Combine(pathSrc, fileName)))
            {
                System.IO.File.Copy(Path.Combine(pathSrc, fileName), Path.Combine(pathDst, fileName));
                System.IO.File.Delete(Path.Combine(pathSrc, fileName));
            }
        }

        private Func<JArray, string, string, HttpResponseMessage> _File_Relocation = (o, pathSrc, pathDst) =>
        {
            HttpResponseMessage response = null;

            try
            {
                foreach (string fileName in o)
                {
                    if (fileName != null && System.IO.File.Exists(Path.Combine(pathSrc, fileName)))
                    {
                        System.IO.File.Copy(Path.Combine(pathSrc, fileName), Path.Combine(pathDst, fileName));
                        System.IO.File.Delete(Path.Combine(pathSrc, fileName));
                    }
                }
            }
            catch (Exception ex)
            {
                response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                response.Content = new StringContent(ex.Message);
            }

            response = new HttpResponseMessage(HttpStatusCode.OK);

            return response;
        };
    }
}