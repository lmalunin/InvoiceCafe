using HiQPdf;
using InvoiceCafe.Data;
using InvoiceCafe.Models.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.Engines
{
    public class DocumentsEngine
    {
        private string _baseUrl;
        private string _localStoragePath;

        public string errorMessage { get; set; }

        public DocumentsEngine(string baseUrl, string localStoragePath)
        {
            _baseUrl = baseUrl + "/PrintForms/";
            _localStoragePath = localStoragePath;
        }

        public bool CreateDocument(EDSDocument doc)
        {
            byte[] pdfBuffer = null;

            HtmlToPdf htmlToPdfConverter = new HtmlToPdf();
            htmlToPdfConverter.Document.Margins = new PdfMargins(5);
            if (doc.DocumentType == EDS_DOCUMENT_TYPE.Questionnaire)
            {
                try
                {
                    pdfBuffer = htmlToPdfConverter.ConvertUrlToMemory(_baseUrl + "Anketa");
                }
                catch(Exception ex)
                {
                    errorMessage = ex.Message;
                    return false;
                }
                string pathDst = Path.Combine(_localStoragePath, doc.CompanyId.ToString(), "registerforms");

                if (!System.IO.Directory.Exists(pathDst))
                {
                    System.IO.Directory.CreateDirectory(pathDst);
                }
                doc.FileName = doc.Id.ToString() + "_anketa.pdf";
                doc.ServerPath = Path.Combine(pathDst, doc.FileName).ToString();
                System.IO.File.WriteAllBytes(doc.ServerPath, pdfBuffer);

                return true;
            }

            return false;
        }
    }
}
