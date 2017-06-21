using InvoiceCafe.Data;
using InvoiceCafe.Models.Domain;
using InvoiceCafe.Models.EDSStorage;
using InvoiceCafe.Models.ViewModels.DomainViewModels;
using Microsoft.AspNetCore.StaticFiles;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;

namespace InvoiceCafe.Models.Engines
{
    public class EDSEngine
    {
        public bool IsAuth { get; set; }
        public bool LastMethodResult { get; set; }
        public string LastMethodMessage { get; set; }

        private readonly string _baseURI = "https://b2b.iitrust.ru/edi/";
        //private readonly string _login = "7704866335_Sopov";
        //private readonly string _password = "q654321";
        private readonly string _login = "3588916835_Vasilyev";
        private readonly string _password = "123456";

        CookieContainer _cookies;
        HttpClientHandler _handler;
        HttpClient _client;

        private readonly Guid _currentUserId;

        public EDSEngine(Guid userId)
        {
            _currentUserId = userId;
        }

        public void Connect()
        {
            LastMethodResult = false;
            LastMethodMessage = "";

            _cookies = new CookieContainer();
            _handler = new HttpClientHandler();
            _handler.CookieContainer = _cookies;

            _client = new HttpClient(_handler);
            _client.BaseAddress = new Uri(_baseURI);
            // авторизация

            var parameters = new Dictionary<string, string> { { "login", _login }, { "password", _password } };
            var encodedContent = new FormUrlEncodedContent(parameters);

            try
            {
                _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage wcfResponse = _client.PostAsync("account/login", encodedContent).Result;
                // авторизовались
                IsAuth = true;
            }
            catch (Exception ex)
            {
                LastMethodResult = false;
                LastMethodMessage = ex.Message;
            }
            LastMethodResult = true;
        }

        public void TestInfo()
        {
            HttpResponseMessage wcfResponse = _client.GetAsync("account").Result;
            var content = wcfResponse.Content.ReadAsStringAsync().Result;
            var model = JsonConvert.DeserializeObject(content);
        }

        public EDSStorageDraft UploadDocumentToStorage(EDSDocument doc)
        {
            LastMethodResult = false;
            LastMethodMessage = "";

            ByteArrayContent fileContent;
            byte[] fileBytes;
            string contentType;

            try
            {
                fileBytes = File.ReadAllBytes(doc.ServerPath);
            }
            catch (Exception ex)
            {
                LastMethodResult = false;
                LastMethodMessage = "Ошибка чтения файла " + doc.ServerPath + ": " + ex.Message;
                return null;
            }

            FileInfo fileInfo = new FileInfo(doc.ServerPath);

            if (!(new FileExtensionContentTypeProvider().TryGetContentType(fileInfo.Name, out contentType))) { contentType = "application/octet-stream"; }

            SHA256Managed hashstring = new SHA256Managed();
            byte[] hash = hashstring.ComputeHash(fileBytes);

            fileContent = new ByteArrayContent(fileBytes);
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);

            //string meta = @"{""fileName"":""anketa.pdf"",""size"":76550,""sha256hash"":""1fa07e601728f9aeb25de7c9e9e80ea7b08654450924dd80b7aa309c6ce1a50d"",""mediaType"":""application/pdf""}";
            string meta = JsonConvert.SerializeObject(new
            {
                fileName = fileInfo.Name,
                size = fileInfo.Length,
                sha256hash = BitConverter.ToString(hash).Replace("-", string.Empty),
                mediaType = contentType
            });

            var requestContent = new MultipartFormDataContent();

            requestContent.Add(new StringContent(fileInfo.Name, Encoding.UTF8), "name");
            requestContent.Add(new StringContent("0", Encoding.UTF8), "chunk");
            requestContent.Add(new StringContent("1", Encoding.UTF8), "chunks");
            requestContent.Add(new StringContent(meta, Encoding.UTF8), "meta");
            requestContent.Add(fileContent, "file", fileInfo.Name);

            HttpResponseMessage wcfResponse = _client.PostAsync("upload/" + doc.Id, requestContent).Result;

            if (!wcfResponse.IsSuccessStatusCode)
            {
                LastMethodResult = false;
                LastMethodMessage = "Ошибка сервиса загрузки: " + wcfResponse.ReasonPhrase;
                return null;
            }

            var content = wcfResponse.Content.ReadAsStringAsync().Result;
            EDSStorageDraft model = JsonConvert.DeserializeObject<EDSStorageDraft>(content);

            model.Id = doc.Id;

            LastMethodResult = true;
            return model;
        }

        public void SetCompanyForDraft(EDSStorageDraft draft)
        {
            LastMethodResult = false;
            LastMethodMessage = "";

            //string postBody = "{\"document\":{\"name\":\"anketa.pdf\",\"workflowType\":\"B2B_UNFORMALIZED\",\"recipientsIds\":[\"3bdd0494 - 078d - 4b2b - 81a9 - b6de0aac29f3\"]}}";

            string postBody = JsonConvert.SerializeObject(new
            {
                document = new
                {
                    name = "anketa.pdf",
                    workflowType = "B2B_UNFORMALIZED",
                    recipientsIds = new[] { "787c9b5d-c3c2-440a-9e35-f1b4a8c7b328" }
                }
            });

            _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            HttpResponseMessage wcfResponse = _client.PostAsync("drafts/" + draft.draftId, new StringContent(postBody, Encoding.UTF8, "application/json")).Result;

            if (!wcfResponse.IsSuccessStatusCode)
            {
                LastMethodResult = false;
                LastMethodMessage = wcfResponse.ReasonPhrase;
                return;
            }

            var content = wcfResponse.Content.ReadAsStringAsync().Result;
            dynamic model = JsonConvert.DeserializeObject<EDSStorageDraft>(content);

            LastMethodResult = true;
        }

        public EDSStorageToLocalSign SignDragtInStorage(EDSStorageDraft draft)
        {
            LastMethodResult = false;
            LastMethodMessage = "";

            var parameters = new Dictionary<string, string> { { "draftId", draft.draftId } };
            var encodedContent = new FormUrlEncodedContent(parameters);

            _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            HttpResponseMessage wcfResponse = _client.PostAsync("drafts/sign", encodedContent).Result;

            if (!wcfResponse.IsSuccessStatusCode)
            {
                LastMethodResult = false;
                LastMethodMessage = wcfResponse.ReasonPhrase;
                return null;
            }

            var content = wcfResponse.Content.ReadAsStringAsync().Result;
            EDSStorageToLocalSign model = JsonConvert.DeserializeObject<EDSStorageToLocalSign>(content);

            LastMethodResult = true;
            return model;
        }

        public void SendDraft(EDSLocalSignatureViewModel model)
        {
            LastMethodResult = false;
            LastMethodMessage = "";

            string postBody = JsonConvert.SerializeObject(new
            {
                files = new[] { new { id = model.fileId, signature = model.signature } }
            });

            _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            HttpResponseMessage wcfResponse = _client.PostAsync("drafts/send", new StringContent(postBody, Encoding.UTF8, "application/json")).Result;            

            if (!wcfResponse.IsSuccessStatusCode)
            {
                LastMethodResult = false;
                LastMethodMessage = wcfResponse.ReasonPhrase;
                return;
            }

            LastMethodResult = true;
        }

        public byte[] GetSignedFile(string workflowDetailsId)
        {
            Guid Id;

            LastMethodResult = false;
            LastMethodMessage = "";

            if (!Guid.TryParse(workflowDetailsId, out Id))
            {
                LastMethodResult = false;
                LastMethodMessage = "Incorrect workflowDetailsId";
                return null;
            }

            _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/zip"));
            HttpResponseMessage wcfResponse = _client.GetAsync("documents/" + Id.ToString() + "/export?exportType=primary").Result;

            if (!wcfResponse.IsSuccessStatusCode)
            {
                LastMethodResult = false;
                LastMethodMessage = wcfResponse.ReasonPhrase;
                return null;
            }

            byte[] file = wcfResponse.Content.ReadAsByteArrayAsync().Result;
            LastMethodResult = true;
            return file;
        }

        public void Disconnect()
        {
            _client.Dispose();
        }

        ~EDSEngine()
        {
            Disconnect();
        }
    }
}
