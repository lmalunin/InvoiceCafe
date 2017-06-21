import { DZViewModel } from './DZViewModel';
import { LotViewModel } from './LotViewModel';
import { CompanyViewModel } from './CompanyViewModel';
    export class OfferViewModel { 
        public Id: number;
        public ContractGuid: string;
        public DZ: DZViewModel;
        public Lot: LotViewModel;
        public Investor: CompanyViewModel;
        public DZPart: number;
        public YearPercent: number;
        public Type: number;
        public Status: number;
        public FullAccept: boolean;
        public _recordCreated: Date;
    }