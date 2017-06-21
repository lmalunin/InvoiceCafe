using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.Domain
{
    public class EDSDocument
    {
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public string ServerPath { get; set; }
        public Guid UserId { get; set; }
        public Guid CompanyId { get; set; }
        public string Title { get; set; }

        public EDS_DOCUMENT_TYPE DocumentType { get; set; }
        public EDS_DOCUMENT_STATUS DocumentStatus { get; set; }

        public Guid? ContractId { get; set; }
        public Guid? DZId { get; set; }
        public Guid? LotId { get; set; }
        public Guid? DealId { get; set; }

        public string EDSStorage_fileId { get; set; }
        public string EDSStorage_draftId { get; set; }
        public string EDSStorage_workflowDetailsId { get; set; }
        public string EDSStorage_documentType { get; set; }

        public string EDSStorage_URL { get; set; }

        public EDSDocument()
        {
            Id = Guid.NewGuid();
            DocumentStatus = EDS_DOCUMENT_STATUS.Draft;
        }
    }
}
