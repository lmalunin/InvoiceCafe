import { UUID } from 'angular2-uuid';
import { PersonViewModel } from './PersonViewModel';
import { SearchLotsViewModel } from './SearchLotsViewModel';

    export class CompanyViewModel { 
        public Id: UUID;
        public Guid: string;
        public AgentType: number;
        public LegalForm: number;
        public CompanyName: string;
        public CompanyEmail: string;
        public CompanyPhone: string;
        public IsRezident: boolean;
        public IsESignature: boolean;
        public INN: string;
        public OGRNIP: string;
        public OGRN: string;
        public RegisterSteps: number;
        public Status: number;
        public Filters: SearchLotsViewModel[];
        public AddOrUpdate: number;
    }