using System;
using System.Collections.Generic;

namespace InvoiceCafe.Models.EDSStorage
{
    public class EDSStorageDraft
    {
        //реквизиты документа в облачном хранилище
        public string workflowDetailsId { get; set; }
        public string draftId { get; set; }
        public string fileId { get; set; }
        public string documentType { get; set; }
        public string comment { get; set; }

        //Id документа в нашей БД
        public Guid Id { get; set; }
    }

    public class EDSStorageSignedDraft
    {
        public string certificate { get; set; }
        public Dictionary<string, string> fileHashes { get; set; }
    }

    public class EDSStorageToLocalSign
    {
        public string description { get; set; }
        public string documentName { get; set; }
        public string fileExtention { get; set; }
        public bool isAttached { get; set; }

        public string certificate { get; set; }
        public Dictionary<string, string> fileHashes { get; set; }
    }
}
