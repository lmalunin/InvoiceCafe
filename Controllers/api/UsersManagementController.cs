using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Http;
using InvoiceCafe.Data;
using InvoiceCafe.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InvoiceCafe.Models.Domain;
using InvoiceCafe.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using InvoiceCafe.Models.ViewModels.DomainViewModels;
using Microsoft.Extensions.Configuration;
using NuGet.Protocol.Core.v3;
using Newtonsoft.Json.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Localization;
using System.Net.Http.Headers;
using System.Net.Mime;
using Microsoft.AspNetCore.StaticFiles;


namespace InvoiceCafe.Controllers.api
{
    [Microsoft.AspNetCore.Mvc.Route("api/[controller]/[action]")]
    public class UsersManagementController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _config;
        private readonly Guid _currentMainUser_Id;
        private readonly ApplicationDbContext _db;
        private readonly IStringLocalizer<UsersManagementController> _localizer;
        private Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        private static string _EmailRegex { get; set; }
        private static string _PassRegex { get; set; }

        public UsersManagementController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ApplicationDbContext dbContext,
            IEmailSender emailSender,
            ISmsSender smsSender,
            ILoggerFactory loggerFactory,
            IHttpContextAccessor httpContextAccessor,
            Microsoft.Extensions.Configuration.IConfiguration config,
            IStringLocalizer<UsersManagementController> localizer,
            Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment)
        {
            _userManager = userManager;
            _signInManager = signInManager;

            _emailSender = emailSender;
            _smsSender = smsSender;
            _logger = loggerFactory.CreateLogger<UsersManagementController>();

            _config = config;

            _db = dbContext;
            _currentMainUser_Id = Guid.Parse(userManager.GetUserId(httpContextAccessor.HttpContext.User));

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<PersonViewModel, Person>();
                cfg.CreateMap<Person, PersonViewModel>();
                cfg.CreateMap<CompanyViewModel, Company>().ForMember(d => d.INN, s => s.Condition(src => !string.IsNullOrEmpty(src.INN)));
                //.ForMember(d => d.LegalForm, s => s.Condition(src => !string.IsNullOrEmpty(src.LegalForm)));  закомментировано СКС 17.12.2016 - LegalForm теперь int
                cfg.CreateMap<Company, CompanyViewModel>();
            });

            _localizer = localizer;

            _hostingEnvironment = hostingEnvironment;

            _EmailRegex = @"^(?("")("".+?""@)|(([0-9a-zA-Z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-zA-Z])@))(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,6}))$";
            _PassRegex = @"(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,25})$";

        }

        [Microsoft.AspNetCore.Mvc.HttpGet]
        public async Task<IActionResult> GetAllPersonsForCompany(Guid companyId)
        {
            var persons = new List<Person>();
            try
            {
                persons = await _db.Persons.Where(p => p.Company.Id == companyId).ToListAsync();
            }
            catch (Exception ex)
            {
#if DEBUG
                _logger.LogError(ex.Message);
                ModelState.AddModelError("ServerError", ex.Message);
                return BadRequest(ModelState);
#else
                _logger.LogError(ex.Message);
                return OK(new List<Person>());
#endif
            }

            return Ok(persons);
        }

        [Microsoft.AspNetCore.Mvc.HttpPost]
        public async Task<IActionResult> AddPerson([Microsoft.AspNetCore.Mvc.FromBody]PersonViewModel model)
        {
            var modelIsValid = false;
            if (ModelState.IsValid)
            {
                modelIsValid = await Task.Factory.StartNew(() => _AddPersonViewModelValidation(model, ModelState, _localizer));
            }

            if (!modelIsValid)
            {
                return BadRequest(ModelState);
            }

            var newPerson = Mapper.Map<PersonViewModel, Person>(model);
            newPerson.Company = await _db.Companies.FirstAsync(c => c.Id == model.Company.Id);
            newPerson._recordCreated = DateTime.UtcNow;
            ApplicationUser appUser = new ApplicationUser
            {
                UserName = model.Login,
                Email = model.Login,
                PhoneNumber = model.MobilePhone,
                Person = newPerson,
            };

            IdentityResult _result = await _userManager.CreateAsync(appUser, model.Password);

            if (!_result.Succeeded)
            {
                ModelState.AddModelError("ServerError", _result.Errors.FirstOrDefault().Description);
                return BadRequest(ModelState);
            }

            try
            {
                var tp = _db.Persons.Include(c => c.Company)
                    .FirstOrDefaultAsync(p => p.Id == _currentMainUser_Id)
                    .ContinueWith(p =>
                    {
                        p.Result.Company.Persons.Add(newPerson);

                        switch (p.Result.Company.AgentType)
                        {
                            case AGENT_TYPES.SUPPLIER:
                                {
                                    _userManager.AddToRoleAsync(appUser, "SUPPLIER");
                                    break;
                                }
                            case AGENT_TYPES.DEBTOR:
                                {
                                    _userManager.AddToRoleAsync(appUser, "DEBTOR");
                                    break;
                                }
                            case AGENT_TYPES.INVESTOR:
                                {
                                    _userManager.AddToRoleAsync(appUser, "INVESTOR");
                                    break;
                                }
                        };

                    }, TaskContinuationOptions.OnlyOnRanToCompletion)
                    .ContinueWith(p =>
                    {
#if DEBUG
                        throw new Exception(p.Exception.Message);
#else
                        _logger.LogError(p.Exception.Message);
                        throw new HttpResponseException(HttpStatusCode.InternalServerError);
#endif
                    }, TaskContinuationOptions.OnlyOnFaulted);

                await _db.SaveChangesAsync();

                var newUser = await _db.Persons.Include(c => c.Company).FirstOrDefaultAsync(p => p.Id == appUser.Id);

                string pathSrc = Path.Combine(_config.GetValue<string>("App:TempFileCatalog"), _currentMainUser_Id.ToString());
                string pathDst = Path.Combine(_config.GetValue<string>("App:FileStorageCatalog"), newUser.Company.Id.ToString(), appUser.Id.ToString());

                if (!Directory.Exists(pathDst))
                {
                    Directory.CreateDirectory(pathDst);
                }

                var IdentityDocumentName = JArray.Parse(model.IdentityDocumentsNames);
                var IdentityDocumentName_Response = _File_Relocation(IdentityDocumentName, pathSrc, pathDst);

                var FullPowersDocumentsNames = JArray.Parse(model.FullPowersDocumentsNames);
                var FullPowersDocumentsNames_Response = _File_Relocation(FullPowersDocumentsNames, pathSrc, pathDst);


                return Ok(model);
            }
            catch (Exception ex)
            {
#if DEBUG
                ModelState.AddModelError("AddPerson", ex.Message);
                return BadRequest(ModelState);
#else
                _logger.LogError(ex.Message);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
#endif
            }
        }

        [Microsoft.AspNetCore.Mvc.HttpPost]
        public async Task<IActionResult> UpdatePerson([Microsoft.AspNetCore.Mvc.FromBody] PersonViewModel model)
        {
            
            var modelIsValid = await Task.Factory.StartNew(() => _UpdatePersonViewModelValidation(model, ModelState, _localizer));

            if (!modelIsValid) { return BadRequest(ModelState); }

            PersonViewModel updatedPersonViewModel = null;
            Person person = null;

            try
            {
                person = await _db.Persons.Include(p => p.ApplicationUser).Include(c => c.Company).FirstOrDefaultAsync(p => p.Id == model.Id);
                Mapper.Map(model, person);

                if (!string.IsNullOrEmpty(model.Login))
                {
                    person.ApplicationUser.UserName = model.Login;
                    person.ApplicationUser.Email = model.Login;
                }

                person.ApplicationUser.Person = person;

                if (!string.IsNullOrEmpty(model.Password))
                {
                    await _userManager.RemovePasswordAsync(person.ApplicationUser);
                    await _userManager.AddPasswordAsync(person.ApplicationUser, model.Password);
                }

                var result = await _userManager.UpdateAsync(person.ApplicationUser);

                if (!result.Succeeded) { ModelState.AddModelError("Update", result.Errors.ToString()); }

                if (result.Succeeded && ModelState.ErrorCount > 0) { return BadRequest(ModelState); }

                _db.Persons.Update(person);
                await _db.SaveChangesAsync();

                updatedPersonViewModel = Mapper.Map<Person, PersonViewModel>(person);
                updatedPersonViewModel.Login = model.Login;

                string pathSrc = Path.Combine(_config.GetValue<string>("App:TempFileCatalog"), _currentMainUser_Id.ToString());
                string pathDst = Path.Combine(_config.GetValue<string>("App:FileStorageCatalog"), person.Company.Id.ToString(), person.Id.ToString());

                if (!Directory.Exists(pathDst))
                {
                    Directory.CreateDirectory(pathDst);
                }

                if (!string.IsNullOrEmpty(model.FullPowersDocumentsNames))
                {
                    var FullPowersDocumentsNames = JArray.Parse(model.FullPowersDocumentsNames);
                    var FullPowersDocumentsNames_Response = _File_Relocation(FullPowersDocumentsNames, pathSrc, pathDst);
                }

                if (!string.IsNullOrEmpty(model.IdentityDocumentsNames))
                {
                    var IdentityDocumentName = JArray.Parse(model.IdentityDocumentsNames);
                    var IdentityDocumentName_Response = _File_Relocation(IdentityDocumentName, pathSrc, pathDst);
                }

                return Ok(updatedPersonViewModel);
            }
            catch (Exception ex)
            {
#if DEBUG
                string output;
                _logger.LogError(ex.Message.LogFormat(out output, ControllerContext));
                ModelState.AddModelError("UpdatePerson", ex.Message);
                return BadRequest(output);
#else
                string output;
                _logger.LogError(ex.Message.LogFormat(out output, ControllerContext));
                return Json(output);
#endif
            }
        }

        [Microsoft.AspNetCore.Mvc.HttpPost]
        public async Task<IActionResult> DeletePerson(Guid id)
        {
            await Task.Factory.StartNew(() => { });

            return Ok();
        }

        [Microsoft.AspNetCore.Mvc.HttpGet]
        public async Task<IActionResult> GetPersonById(Guid id)
        {
            PersonViewModel personViewModel = null;

            try
            {
                var person = await _db.Persons.Include(p => p.ApplicationUser).Include(p => p.Company).FirstOrDefaultAsync(u => u.Id == id);
                personViewModel = Mapper.Map<Person, PersonViewModel>(person);
                if (personViewModel.Login != null)
                { personViewModel.Login = person.ApplicationUser.UserName; }

                var fullPowersDocumentsNames = JArray.Parse(person.FullPowersDocumentsNames);
                var identityDocumentName = JArray.Parse(person.IdentityDocumentsNames);

                personViewModel.GetDocsBaseUrl = _config.GetValue<string>("App:GetDocsForUserBaseUrl");
                personViewModel.DeleteDocsBaseUrl = _config.GetValue<string>("App:DeleteUserDocsBaseUrl");
            }
            catch (Exception ex)
            {
#if DEBUG
                ModelState.AddModelError("GetPersonById", ex.Message);
                return BadRequest(ModelState);
#else
                _logger.LogError(ex.Message);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
#endif
            }

            return Ok(personViewModel);
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

        private Func<PersonViewModel, ModelStateDictionary, IStringLocalizer<UsersManagementController>, bool> _AddPersonViewModelValidation = (model, modelState, _localizer) =>
        {
            if (!string.IsNullOrEmpty(model.Login))
            {
                modelState.AddModelError("Login", _localizer["Введите логин. Логин должен быть вашим EMail"]);
            }

            if (!Regex.IsMatch(model.Login, _EmailRegex))
            {
                modelState.AddModelError("Login", _localizer["Введите логин. Логин должен быть вашим EMail"]);
            }

            if (!string.IsNullOrEmpty(model.Password) || !string.IsNullOrEmpty(model.NewPassword))
            {
                if (!Regex.IsMatch(model.Password, _PassRegex))
                {
                    modelState.AddModelError("Password", _localizer["Пароль должен быть не менее 6 и не более 25 символов и иметь минимум 1 цифру и 1 букву и не содержать спец. символов"]);
                }
            }

            if (model.Company.AgentType == (int)AGENT_TYPES.SUPPLIER)
            {
                if (string.IsNullOrEmpty(model.SourceOfAuthority))
                {
                    modelState.AddModelError("SourceOfAuthority", _localizer["Поле \"Источник полномочий\" должно быть заполнено"]);
                }

                if (string.IsNullOrEmpty(model.PlaceOfBirth))
                {
                    modelState.AddModelError("PlaceOfBirth", _localizer["Поле \"Место рождения\" должно быть заполнено"]);
                }

                if (model.PossibilityToExposeBid)
                {
                    if (!model.PossibilityToExposeBidWithoutRestrictions)
                    {
                        if (model.LimitOfSumOfEveryBid < 0)
                        {
                            modelState.AddModelError("LimitOfSumOfEveryBid", _localizer["Ограничение по сумме на каждую заявку должно быть больше 0"]);
                        }

                        if (model.LimitOfCommonSumOfNotCalculatedBids < 0)
                        {
                            modelState.AddModelError("LimitOfCommonSumOfNotCalculatedBids", _localizer["Ограничение по общей сумме нерасчитанных заявок должно быть больше 0"]);
                        }
                    }
                }

                if (model.CounterOfferAcceptPossibility && !model.CounterOfferAcceptPossibilityWithoutRestrictions)
                {
                    if (model.LimitOfDeviationRateFromInitialBidInPercentage < 0)
                    {
                        modelState.AddModelError("LimitOfDeviationRateFromInitialBidInPercentage", _localizer["Ограничение по отклонению % ставки от первоначальной заявки должно быть больше 0"]);
                    }

                    if (model.LimitOfDeviationByDiscountFromStartBid < 0)
                    {
                        modelState.AddModelError("LimitOfDeviationByDiscountFromStartBid", _localizer["Ограничение по отклонению по дисконту от первоначальной заявки должно быть больше 0"]);
                    }
                }
            }

            if (model.Company.AgentType == (int)AGENT_TYPES.DEBTOR)
            {
                if (string.IsNullOrEmpty(model.IdentityDocumentsNames))
                {
                    modelState.AddModelError("IdentityDocumentsNames", _localizer["Необходимо добавить документ, удостоверяющий личность"]);
                }
            }

            if (model.Company.AgentType == (int)AGENT_TYPES.INVESTOR)
            {
                if (!model.UserRestrictions)
                {
                    if (model.LimitOfOneBid < 0)
                    {
                        modelState.AddModelError("LimitOfOneBid", _localizer["Ограничение лимиту по одной заявке должно быть больше 0"]);
                    }

                    if (model.TotalLimitForAllUnsettledBidsAndCounterOffer < 0)
                    {
                        modelState.AddModelError("TotalLimitForAllUnsettledBidsAndCounterOffer", _localizer["Общий лимит по всем нерассчитанным заявкам и встречным офертам должен быть больше 0"]);
                    }

                    if (model.LimitUsettledDebtOnOneSupplierTakingIntoAccountTheCreditQuality < 0)
                    {
                        modelState.AddModelError("LimitUsettledDebtOnOneSupplierTakingIntoAccountTheCreditQuality", _localizer["Лимит нерассчитанной задолженности на одного Поставщика с учетом кредитного качества должен быть больше 0"]);
                    }

                    if (string.IsNullOrEmpty(model.IdentityDocumentsNames))
                    {
                        modelState.AddModelError("IdentityDocumentsNames", _localizer["Необходимо добавить документ удостоверяющий личность"]);
                    }
                }
            }

            if (modelState.ErrorCount > 0)
            {
                return false;
            }

            return true;
        };

        private Func<PersonViewModel, ModelStateDictionary, IStringLocalizer<UsersManagementController>, bool> _UpdatePersonViewModelValidation = (model, modelState, _localizer) =>
        {
            if (!string.IsNullOrEmpty(model.Login))
            {
                if (!Regex.IsMatch(model.Login, _EmailRegex))
                {
                    modelState.AddModelError("Login", _localizer["Введите логин. Логин должен быть вашим EMail"]);
                }
            }

            if (!string.IsNullOrEmpty(model.Password))
            {
                if (!Regex.IsMatch(model.Password, _PassRegex))
                {
                    modelState.AddModelError("Password", _localizer["Пароль должен быть не менее 6 и не более 25 символов и иметь минимум 1 цифру и 1 букву и не содержать спец. символов"]);
                }
            }

            if (model.Company.AgentType == (int)AGENT_TYPES.SUPPLIER)
            {
                if (string.IsNullOrEmpty(model.SourceOfAuthority))
                {
                    modelState.AddModelError("SourceOfAuthority", _localizer["Поле \"Источник полномочий\" должно быть заполнено"]);
                }

                if (string.IsNullOrEmpty(model.PlaceOfBirth))
                {
                    modelState.AddModelError("PlaceOfBirth", _localizer["Поле \"Место рождения\" должно быть заполнено"]);
                }

                if (model.PossibilityToExposeBid && !model.PossibilityToExposeBidWithoutRestrictions)
                {
                    if (model.LimitOfSumOfEveryBid < 0)
                    {
                        modelState.AddModelError("LimitOfSumOfEveryBid", _localizer["Ограничение по сумме на каждую заявку должно быть больше 0"]);
                    }

                    if (model.LimitOfCommonSumOfNotCalculatedBids < 0)
                    {
                        modelState.AddModelError("LimitOfCommonSumOfNotCalculatedBids", _localizer["Ограничение по общей сумме нерасчитанных заявок должно быть больше 0"]);
                    }
                }

                if (model.CounterOfferAcceptPossibility && !model.CounterOfferAcceptPossibilityWithoutRestrictions)
                {
                    if (model.LimitOfDeviationRateFromInitialBidInPercentage < 0)
                    {
                        modelState.AddModelError("LimitOfDeviationRateFromInitialBidInPercentage", _localizer["Ограничение по отклонению % ставки от первоначальной заявки должно быть больше 0"]);
                    }

                    if (model.LimitOfDeviationByDiscountFromStartBid < 0)
                    {
                        modelState.AddModelError("LimitOfDeviationByDiscountFromStartBid", _localizer["Ограничение по отклонению по дисконту от первоначальной заявки должно быть больше 0"]);
                    }
                }
            }

            if (model.Company.AgentType == (int)AGENT_TYPES.DEBTOR)
            {
                if (string.IsNullOrEmpty(model.IdentityDocumentsNames))
                {
                    modelState.AddModelError("IdentityDocumentsNames", _localizer["Необходимо добавить документ, удостоверяющий личность"]);
                }
            }

            if (model.Company.AgentType == (int)AGENT_TYPES.INVESTOR)
            {
                if (!model.UserRestrictions)
                {
                    if (model.LimitOfOneBid < 0)
                    {
                        modelState.AddModelError("LimitOfOneBid", _localizer["Ограничение лимиту по одной заявке должно быть больше 0"]);
                    }

                    if (model.TotalLimitForAllUnsettledBidsAndCounterOffer < 0)
                    {
                        modelState.AddModelError("TotalLimitForAllUnsettledBidsAndCounterOffer", _localizer["Общий лимит по всем нерассчитанным заявкам и встречным офертам должен быть больше 0"]);
                    }

                    if (model.LimitUsettledDebtOnOneSupplierTakingIntoAccountTheCreditQuality < 0)
                    {
                        modelState.AddModelError("LimitUsettledDebtOnOneSupplierTakingIntoAccountTheCreditQuality", _localizer["Лимит нерассчитанной задолженности на одного Поставщика с учетом кредитного качества должен быть больше 0"]);
                    }

                    if (string.IsNullOrEmpty(model.IdentityDocumentsNames))
                    {
                        modelState.AddModelError("IdentityDocumentsNames", _localizer["Необходимо добавить документ удостоверяющий личность"]);
                    }
                }
            }

            if (modelState.ErrorCount > 0)
            {
                return false;
            }

            return true;
        };
    }
}