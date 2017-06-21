import { DZViewModel } from './DZViewModel';
    export class LotViewModel { 
        public Id: number;
        public ContractGuid: string;
        public DZ: DZViewModel;
        public Sum: number;
        public DZPart: number;
        public YearPercent: number;
        public Status: number;
        public _recordCreated: Date;
        public IsChecked: boolean;
    }