import { CompanyViewModel } from './CompanyViewModel';

    export class SignFormViewModel { 
        public Id: string;
        public Company: CompanyViewModel;
        public AnnualTurnover: number;
        public FieldOfActivity: string;
        public WebSite: string;
        public NumOfConractors: number;
        public TypeOfContractors: number;
        public ScanURL_ogrn: string;
        public ScanURL_ustav: string;
        public ScanURL_izmen: string;
        public ScanURL_inn: string;
        public ScanURL_egrul: string;
        public ScanURL_reshenie: string;
        public ScanURL_migrdocs: string;
        public ScanURL_vstup: string;
        public ScanURL_rukovod: string;
        public ScanURL_p_polnom: string;
        public ScanURL_p_lichn: string;
        public ScanURL_licen: string;
        public ScanURL_inoe: string;
        public ScanURL_vypiska: string;
        public DirectorFullName: string;
        public DirectorBDate: Date;
        public DirectorCitizenship: string;
        public DirectorPlaceOfBirth: string;
        public Tarif: number;
        public Status: number;
    }