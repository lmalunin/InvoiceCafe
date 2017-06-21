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
using System.IO;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using InvoiceCafe.Models.EDSStorage;
using InvoiceCafe.Models.ViewModels.DomainViewModels;
using InvoiceCafe.Models.Engines;
//using System.Web.Http;

namespace InvoiceCafe.Controllers.api
{
    [Microsoft.AspNetCore.Authorization.Authorize]
    //[Produces("application/json")]
    [Microsoft.AspNetCore.Mvc.Route("api/[controller]/[action]")]
    public class ServiceController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _config;
        private readonly string _currentUser, _currentUserId;

        public ServiceController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext dbContext,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration config)
        {
            _userManager = userManager;
            _db = dbContext;
            _config = config;

            _currentUser = httpContextAccessor.HttpContext.User.Identity.Name;
            _currentUserId = userManager.GetUserId(httpContextAccessor.HttpContext.User);
        }

        [Microsoft.AspNetCore.Mvc.HttpPost]
        [Microsoft.AspNetCore.Mvc.ActionName("UploadFile")]
        public async Task<IActionResult> UploadFile()
        {
            List<string> fileNames = new List<string>();
            try
            {
                var files = Request.Form.Files;
                //var docId = Request.Form["documentId"];
                var uploads = Path.Combine(_config.GetValue<string>("App:TempFileCatalog"), _currentUserId);

                if (!System.IO.Directory.Exists(uploads))
                {
                    System.IO.Directory.CreateDirectory(uploads);
                }

                string serverFileName;
                foreach (var file in files)
                {
                    if (file.Length > 0)
                    {
                        //serverFileName = Request.Form["ServerFileName"];
                        //serverFileName = serverFileName.Replace(';', '-').Replace('|', '-').Replace('.', '_').Replace(' ','_');
                        //serverFileName = serverFileName.Replace(';', '-').Replace('|', '-').Replace('.', '_').Replace(' ', '_');
                        //using (var fileStream = new FileStream(Path.Combine(uploads, serverFileName), FileMode.Create))

                        serverFileName = Path.GetFileNameWithoutExtension(file.FileName);
                        serverFileName = DateTime.Now.Ticks.ToString() + "_" + serverFileName.Replace(';', '-').Replace('|', '-').Replace('.', '_').Replace(' ', '_') + Path.GetExtension(file.FileName);
                        using (var fileStream = new FileStream(Path.Combine(uploads, serverFileName), FileMode.Create))
                        {
                            await file.CopyToAsync(fileStream);
                        }
                        fileNames.Add(serverFileName);
                    }
                }
                return Ok(fileNames[0]);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Microsoft.AspNetCore.Mvc.HttpGet]
        [Microsoft.AspNetCore.Mvc.ActionName("GetNumOfNewOffers")]
        public IActionResult GetNumOfNewOffers(string guid)
        {
            Guid g = Guid.Parse(guid);
            int c = _db.Offers.Include(i => i.DZ).ThenInclude(i => i.Supplier).Where(i => i.DZ.Supplier.Guid == g && i.Viewed_S == false).Count();
            return Ok(c);
        }

        [Microsoft.AspNetCore.Mvc.HttpGet]
        [Microsoft.AspNetCore.Mvc.ActionName("_create_lots")]
        public IActionResult _create_lots(int id)
        {
            //генерация случайных лотов для ДЗ

            var dz = _db.DZ.Include(i => i.Contract).Include(i => i.Lots).SingleOrDefault(i => i.Id == id);
            Random rnd = new Random();
            for (int i = 0; i <= 100; i++)
            {
                var lot = new Lot();
                lot.Contract = dz.Contract;
                _db.Entry(lot.Contract).State = EntityState.Unchanged;

                lot.DZ = dz;
                _db.Entry(lot.DZ).State = EntityState.Unchanged;
                lot.Sum = rnd.Next(10000, 1000000);
                lot.YearPercent = rnd.Next(10, 90);
                lot.DZPart = rnd.Next(10, 90);
                lot._recordCreated = DateTime.Now;
                if (dz.Lots == null)
                    dz.Lots = new List<Lot>();
                dz.Lots.Add(lot);
            }
            _db.SaveChanges();
            return Ok();
        }

        [Microsoft.AspNetCore.Mvc.HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("{id:guid}/{file}")]
        public async Task<IActionResult> FL(Guid id, string file)
        {
            PhysicalFileResult result;

            try
            {
                result = await Task.Factory.StartNew(() =>
                {
                    var person =
                        _db.Persons.Include(p => p.ApplicationUser)
                            .Include(p => p.Company)
                            .FirstOrDefault(u => u.Id == id);

                    var filePath = Path.Combine(_config.GetValue<string>("App:FileStorageCatalog"), person.Company.Id.ToString(), person.Id.ToString(), file);
                    string contentType;
                    if (!(new FileExtensionContentTypeProvider().TryGetContentType(filePath, out contentType))) { contentType = "application/octet-stream"; }
                    return PhysicalFile(filePath, contentType);
                });
                return result;

            }
            catch (Exception ex)
            {
#if DEBUG
                ModelState.AddModelError("FL", ex.Message);
                return BadRequest(ModelState);
#else
                //_logger.LogError(ex.Message);
                //throw new HttpResponseException(HttpStatusCode.InternalServerError);
#endif
                return BadRequest();
            }

        }

        [Microsoft.AspNetCore.Mvc.HttpGet]
        public async Task<IActionResult> FL(string key)
        {
            PhysicalFileResult result;

            try
            {
                result = await Task.Factory.StartNew(() =>
                {
                    var filePath = Path.Combine(_config.GetValue<string>("App:FileStorageCatalog"), key.Replace(';', '/'));
                    string contentType;
                    if (!(new FileExtensionContentTypeProvider().TryGetContentType(filePath, out contentType))) { contentType = "application/octet-stream"; }
                    return PhysicalFile(filePath, contentType);
                });
                return result;

            }
            catch (Exception ex)
            {
#if DEBUG
                ModelState.AddModelError("FL", ex.Message);
                return BadRequest(ModelState);
#else
                //_logger.LogError(ex.Message);
                //throw new HttpResponseException(HttpStatusCode.InternalServerError);
#endif
                return BadRequest();
            }

        }

        [Microsoft.AspNetCore.Mvc.HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("{id:guid}/{file}")]
        public async Task<IActionResult> FD(Guid id, string file)
        {
            string result;

            try
            {
                result = await Task.Factory.StartNew(() =>
                {
                    var person = _db.Persons.Include(p => p.ApplicationUser).Include(c => c.Company).FirstOrDefault(p => p.Id == id);

                    string path = Path.Combine(_config.GetValue<string>("App:FileStorageCatalog"), person.Company.Id.ToString(), person.Id.ToString());

                    System.IO.File.Delete(Path.Combine(path, file));

                    var FullPowersDocumentsNames = JArray.Parse(person.FullPowersDocumentsNames);

                    var list = FullPowersDocumentsNames.ToObject<List<string>>();

                    if (list.Contains(file))
                    {
                        list.Remove(file);

                        FullPowersDocumentsNames = new JArray();

                        foreach (var var in list)
                        {
                            FullPowersDocumentsNames.Add(var);
                        }

                        person.FullPowersDocumentsNames = FullPowersDocumentsNames.ToString();
                    }

                    var IdentityDocumentNames = JArray.Parse(person.IdentityDocumentsNames);

                    list = IdentityDocumentNames.ToObject<List<string>>();


                    if (list.Contains(file))
                    {
                        list.Remove(file);

                        IdentityDocumentNames = new JArray();

                        foreach (var var in list)
                        {
                            IdentityDocumentNames.Add(var);
                        }

                        person.IdentityDocumentsNames = IdentityDocumentNames.ToString();
                    }


                    _db.SaveChangesAsync();

                    return file;
                });

                return Ok(new { fileName = result });
            }
            catch (Exception ex)
            {
#if DEBUG
                ModelState.AddModelError("DeleteFile", ex.Message);
                return BadRequest(ModelState);
#else
                //_logger.LogError(ex.Message);
                //throw new HttpResponseException(HttpStatusCode.InternalServerError);
#endif
            }

        }

        [HttpPost]
        [ActionName("UploadDraftToEDSStorage")]
        public IActionResult UploadDraftToEDSStorage(string docId)
        {
            EDSDocument doc = _db.EDSDocuments.Where(w => w.Id == Guid.Parse(docId)).Single();
            if (doc == null)
            {
                return BadRequest("Не существует файла: " + docId);
            }

            var edsEngine = new EDSEngine(Guid.Parse(_currentUserId));

            //Шаг 1. Соединяемся с облаком с помощью логина и пароля пользователя. Описание метода: https://b2b.iitrust.ru/api/#!/authorization/post_account_login
            edsEngine.Connect();
            if (!edsEngine.LastMethodResult)
            {
                return BadRequest("Ошибка авторизации: " + edsEngine.LastMethodMessage);
            }

            //Шаг 2. Загружаем в облако документ в виде черновика. Описание метода: https://b2b.iitrust.ru/api/#!/drafts/post_upload_id
            EDSStorageDraft draft = edsEngine.UploadDocumentToStorage(doc);
            if (!edsEngine.LastMethodResult)
            {
                return BadRequest("Ошибка загрузки черновика: " + edsEngine.LastMethodMessage);
            }

            //Шаг 3. Указываем получателя для загруженного документа. Описание метода: https://b2b.iitrust.ru/api/#!/drafts/changeDraft
            edsEngine.SetCompanyForDraft(draft);
            if (!edsEngine.LastMethodResult)
            {
                return BadRequest("Ошибка указания получателя: " + edsEngine.LastMethodMessage);
            }

            //Шаг 4. Получаем хэш для последующего локального подписания. Описание метода: https://b2b.iitrust.ru/api/#!/drafts/post_drafts_sign
            EDSStorageToLocalSign toLocalSign = edsEngine.SignDragtInStorage(draft);
            edsEngine.Disconnect();
            if (!edsEngine.LastMethodResult)
            {
                return BadRequest("Ошибка фомирования хэша для черновика: " + edsEngine.LastMethodMessage);
            }

            doc.EDSStorage_fileId = draft.fileId;
            doc.EDSStorage_draftId = draft.draftId;
            doc.EDSStorage_workflowDetailsId = draft.workflowDetailsId;
            doc.EDSStorage_documentType = draft.documentType;
            doc.DocumentStatus = EDS_DOCUMENT_STATUS.UploadedToStorage;
            //doc обновился, сохраним
            try
            {
                _db.SaveChanges();
            }
            catch(Exception ex)
            {
                return BadRequest("Ошибка изменения в БД: " + ex.Message);
            }

            EDSLocalSignatureViewModel toLocalSignViewModel = new EDSLocalSignatureViewModel();
            toLocalSignViewModel.certificate = toLocalSign.certificate;
            toLocalSignViewModel.detached = true;
            toLocalSignViewModel.message = toLocalSign.fileHashes.Values.SingleOrDefault();
            toLocalSignViewModel.fileId = draft.fileId;
            toLocalSignViewModel.Id = draft.Id.ToString();

            //отправляем хэш клиенту для локальной подписи
            return Ok(toLocalSignViewModel);
        }

        [HttpPost]
        [ActionName("SignDraftInEDSStorage")]
        public IActionResult SignDraftInEDSStorage([FromBody]EDSLocalSignatureViewModel model)
        {
            EDSDocument doc = _db.EDSDocuments.Where(w => w.Id == Guid.Parse(model.Id)).Single();
            if (doc == null)
            {
                return BadRequest("Не существует файла: " + model.Id);
            }

            var edsEngine = new EDSEngine(Guid.Parse(_currentUserId));

            //Шаг 1. Соединяемся с облаком с помощью логина и пароля пользователя. Описание метода: https://b2b.iitrust.ru/api/#!/authorization/post_account_login
            edsEngine.Connect();
            if (!edsEngine.LastMethodResult)
            {
                return BadRequest("Ошибка авторизации: " + edsEngine.LastMethodMessage);
            }

            //Шаг 2. Подписываем черновик в облаке. Описание метода: https://b2b.iitrust.ru/api/#!/drafts/post_drafts_send
            edsEngine.SendDraft(model);
            edsEngine.Disconnect();
            if (!edsEngine.LastMethodResult)
            {
                return BadRequest("Ошибка подписания: " + edsEngine.LastMethodMessage);
            }

            doc.DocumentStatus = EDS_DOCUMENT_STATUS.SignedByUserAndPlatform;
            try
            {
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest("Ошибка изменения в БД: " + ex.Message);
            }
            return Ok(model);
        }

        [HttpGet]
        [ActionName("GetEdsDocuments")]
        public IActionResult GetEdsDocuments(string id, int documentType, int documentStatus)
        {
            //отдаем список документов, которые необходимо подписать ЭЦП
            //documentType - тип документа
            //id - универсальный id, в зависимости от типа документа идентифицирует сущность, к которой привязан документ

            //позже добавить код проверки разрешения на доступ к документам текущего пользователя

            EDS_DOCUMENT_TYPE type = (EDS_DOCUMENT_TYPE)documentType;
            EDS_DOCUMENT_STATUS status = (EDS_DOCUMENT_STATUS)documentStatus;

            if (type == EDS_DOCUMENT_TYPE.Questionnaire)
            {
                Guid companyId;
                if (!Guid.TryParse(id, out companyId))
                    return BadRequest("Incorrect id");

                IList<ClientDocumentViewModel> docs = _db.EDSDocuments
                    .Where(w => w.CompanyId == companyId && w.DocumentType == type && w.DocumentStatus == status)
                    .Select(i => new ClientDocumentViewModel { Id = i.Id.ToString(), PathKey = companyId.ToString() + ";registerforms;" + i.FileName, Title = i.Title, FileType = (int)i.DocumentType }).ToList();

                return Ok(docs);
            }

            return BadRequest("Unknown type");
        }

        [Microsoft.AspNetCore.Mvc.HttpGet]
        public async Task<IActionResult> EDS(string key)
        {
            EDSDocument doc = _db.EDSDocuments.Where(w => w.Id == Guid.Parse(key)).Single();
            if (doc == null)
            {
                return BadRequest("Не существует файла: " + key);
            }

            var edsEngine = new EDSEngine(Guid.Parse(_currentUserId));

            //Шаг 1. Соединяемся с облаком с помощью логина и пароля пользователя. Описание метода: https://b2b.iitrust.ru/api/#!/authorization/post_account_login
            edsEngine.Connect();
            if (!edsEngine.LastMethodResult)
            {
                return BadRequest("Ошибка авторизации: " + edsEngine.LastMethodMessage);
            }

            FileContentResult result;

            try
            {
                result = await Task.Factory.StartNew(() =>
                {
                    byte[] file = edsEngine.GetSignedFile(doc.EDSStorage_workflowDetailsId);
                    string contentType = "application/zip";
                    string fileName = doc.Id.ToString() + ".zip";
                    return File(file, contentType, fileName);
                });

                return result;


            }
            catch (Exception ex)
            {
#if DEBUG
                ModelState.AddModelError("EDS", ex.Message);
                return BadRequest(ModelState);
#else
                //_logger.LogError(ex.Message);
                //throw new HttpResponseException(HttpStatusCode.InternalServerError);
#endif
                return BadRequest();

            }
            finally
            {
                edsEngine.Disconnect();
            }

        }
    }
}