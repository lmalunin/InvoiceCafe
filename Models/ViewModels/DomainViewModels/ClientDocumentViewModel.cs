using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.ViewModels.DomainViewModels
{
    public class ClientDocumentViewModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string PathKey { get; set; }
        public string Description { get; set; }
        public int FileType { get; set; }
    }
}
