import { CompanyViewModel } from './CompanyViewModel';
import { ContractViewModel } from './ContractViewModel';
import { LotViewModel } from './LotViewModel';
    export class DZViewModel { 
        public Id: number;
        public Sum: number;
        public Days: number;
        public DateFrom: Date;
        public DateTo: Date;
        public Debtor: CompanyViewModel;
        public Supplier: CompanyViewModel;
        public Status: number;
        public ContractGuid: string;
        public DocumentName: string;
        public sDocumentsURLs: string;
        public DocumentsURLs: string[];
        public Lots: LotViewModel[];
        public VerificationType: number;
        public _recordCreated: Date;
    }