import { DZViewModel } from './DZViewModel';
import { LotViewModel } from './LotViewModel';
import { OfferViewModel } from './OfferViewModel';
import { CompanyViewModel } from './CompanyViewModel';
    export class DealViewModel { 
        public Id: number;
        public Supplier: CompanyViewModel;
        public Debtor: CompanyViewModel;
        public Investor: CompanyViewModel;
        public ContractGuid: string;
        public DZ: DZViewModel;
        public Lot: LotViewModel;
        public Offer: OfferViewModel;
        public Sum: number;
        public DZPart: number;
        public YearPercent: number;
        public CreationDate: Date;
    }