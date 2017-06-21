import {Injectable} from '@angular/core';

@Injectable()
export class DictionaryService {
    public SignFormCompanyDocuments: Array<dictDocument>;
    public SignFormManagerDocuments: Array<dictDocument>;

    constructor() {
        this.SignFormCompanyDocuments = new Array<dictDocument>();
        this.SignFormCompanyDocuments.push(new dictDocument('Свидетельство ОГРН', 'ScanURL_ogrn', true, 10));
        this.SignFormCompanyDocuments.push(new dictDocument('Учредительные документы (Устав, положения)', 'ScanURL_ustav', true, 100));
        this.SignFormCompanyDocuments.push(new dictDocument('Изменения/дополнения в учредительные документы', 'ScanURL_izmen', true, 100));
        this.SignFormCompanyDocuments.push(new dictDocument('Свидетельство ИНН', 'ScanURL_inn', true, 10));
        this.SignFormCompanyDocuments.push(new dictDocument('Выписка из ЕГРЮЛ', 'ScanURL_egrul', true, 10));
        this.SignFormCompanyDocuments.push(new dictDocument('Приказ о вступлении в должность единоличного органа', 'ScanURL_vstup', true, 50));
        this.SignFormCompanyDocuments.push(new dictDocument('Решение участника/протокол общего собрания акционеров/участников об избрании единоличного органа + о продлении полномочий указанного лица', 'ScanURL_reshenie', true, 50));

        this.SignFormCompanyDocuments.push(new dictDocument('Лицензия, в случае если деятельность Пользователя является лицензируемой', 'ScanURL_licen', true, 10));
        this.SignFormCompanyDocuments.push(new dictDocument('Выписка из реестра акционеров, выписки по счетам депо номинальных держателей', 'ScanURL_vypiska', false, 100));
        this.SignFormCompanyDocuments.push(new dictDocument('Прочие документы', 'ScanURL_inoe', true, 10));

        this.SignFormManagerDocuments = new Array<dictDocument>();
        this.SignFormManagerDocuments.push(new dictDocument('Документ, удостоверяющий личность руководителя', 'ScanURL_rukovod', true, 20));
        this.SignFormManagerDocuments.push(new dictDocument('Документ, подтверждающий полномочия представителя Пользователя', 'ScanURL_p_polnom', true, 20));
        this.SignFormManagerDocuments.push(new dictDocument('Документ, удостоверяющий личность представителя Пользователя', 'ScanURL_p_lichn', true, 20));
        this.SignFormManagerDocuments.push(new dictDocument('Миграционные документы по трудоустройству', 'ScanURL_migrdocs', false, 20));

        //this.SignFormDocuments.push(new dictDocument('State register unique number ', 'ScanURL_ogrn', true, 10));
        //this.SignFormDocuments.push(new dictDocument('Corporate documents (Articles, Memorandum of Incorporation, etc) ', 'ScanURL_ustav', true, 100));
        //this.SignFormDocuments.push(new dictDocument('Any amendments to the corporate documents', 'ScanURL_izmen', true, 100));
        //this.SignFormDocuments.push(new dictDocument('Copy of state tax number certificate', 'ScanURL_inn', true, 10));
        //this.SignFormDocuments.push(new dictDocument('Extract from the state companies register', 'ScanURL_egrul', true, 10));
        //this.SignFormDocuments.push(new dictDocument('Shareholders Meeting Minutes appointing the companys Board of Directors and CEO', 'ScanURL_reshenie', true, 50));
        //this.SignFormDocuments.push(new dictDocument('Миграционные документы по трудоустройству', 'ScanURL_migrdocs', false, 20));
        //this.SignFormDocuments.push(new dictDocument('Extract from the directors register', 'ScanURL_vstup', true, 50));
        //this.SignFormDocuments.push(new dictDocument('CEOs and other authorised company officers IDs and proof of address', 'ScanURL_rukovod', true, 20));
        //this.SignFormDocuments.push(new dictDocument('Proof of credentials of the platform account user', 'ScanURL_p_polnom', true, 20));
        //this.SignFormDocuments.push(new dictDocument('ID and proof of address of the platform user', 'ScanURL_p_lichn', true, 20));
        //this.SignFormDocuments.push(new dictDocument('A copy of the companys license (if the activity is licensed)', 'ScanURL_licen', true, 10));
        //this.SignFormDocuments.push(new dictDocument('Other documents', 'ScanURL_inoe', true, 10));
        //this.SignFormDocuments.push(new dictDocument('Extract from the shareholder register', 'ScanURL_vypiska', false, 100));
    }

    public TARIF_SELLER = Array<dictItem>(
        new dictItem(1, 'ТПП 1.0'),
        new dictItem(2, 'ТПП 2.0'),
        new dictItem(3, 'ТПП 3.0')
    );

    public CONTRACT_TYPE = Array<dictItem>(
        new dictItem(1, 'Поставки'),
        new dictItem(2, 'Оказания услуг'),
        new dictItem(3, 'Выполнения работ'),
        new dictItem(4, 'Иное')
    );

    public CONTRACT_DELIVERY_TYPE = Array<dictItem>(
        new dictItem(1, 'Самовывоз'),
        new dictItem(2, 'Доставка'),
        new dictItem(3, 'Иное')
    );

    public DZ_STATUS = Array<dictItem>(
        new dictItem(0, 'Создана'),
        new dictItem(1, 'Ожидание верификации'),
        new dictItem(3, 'Отклонено дебитором'),
        new dictItem(4, 'Отклонено платформой'),
        new dictItem(5, 'Верифицировано дебитором'),
        new dictItem(6, 'Верифицировано платформой'),
        new dictItem(15, 'На торгах'),
        new dictItem(20, 'Продана')
    );

    public OFFER_STATUS = Array<dictItem>(
        new dictItem(0, 'Создан'),
        new dictItem(1, 'Ожидание верификации'),
        new dictItem(10, 'Принят'),
        new dictItem(20, 'Отклонен')
    );

    public LOT_STATUS = Array<dictItem>(
        new dictItem(0, 'Создан'),
        new dictItem(1, 'На торгах'),
        new dictItem(3, 'Встречный оффер инвестора'),
        new dictItem(5, 'Принят инвестором'),
        new dictItem(7, 'Принят поставщиком')
    );

    public AGENT_TYPE = Array<dictItem>(
        new dictItem(1, 'Поставщик'),
        new dictItem(2, 'Дебитор'),
        new dictItem(3, 'Инвестор')
    );

    public SIGN_FORM_TYPE = Array<dictItem>(
        new dictItem(0, 'Создана'),
        new dictItem(1, 'На согласовании'),
        new dictItem(5, 'Документы подтверждены'),
        new dictItem(10, 'Документы отклонены')
    );

    public LEGAL_FORM = Array<dictItem>(
        new dictItem(1, 'ИП'),
        new dictItem(2, 'ПАО (ОАО)'),
        new dictItem(3, 'НАО (ЗАО)'),
        new dictItem(4, 'ООО')
    );

    /*
    public CONTRACT_TYPES_EN = Array<dictItem>(
        new dictItem(1, 'Supplies'),
        new dictItem(2, 'Services'),
        new dictItem(3, 'Contract comletion status'),
        new dictItem(4, 'Other')
    );

    public CONTRACT_DELIVERY_TYPES_EN = Array<dictItem>(
        new dictItem(1, 'Ex works'),
        new dictItem(2, 'Delivery'),
        new dictItem(3, 'Other')
    );

    public DZ_STATUSES_EN = Array<dictItem>(
        new dictItem(0, 'Init'),
        new dictItem(1, 'Waiting for accept'),
        new dictItem(5, 'Accepted by debtor'),
        new dictItem(6, 'Accepted by platform'),
        new dictItem(10, 'Declined by bebtor'),
        new dictItem(15, 'At auction'),
        new dictItem(20, 'Sold')
    );

    public AGENT_TYPES_EN = Array<dictItem>(
        new dictItem(1, 'Seller'),
        new dictItem(2, 'Debtor'),
        new dictItem(3, 'Investor')
    );
    */
    get_DZ_STATUS(Id: number): string {
        if (Id == undefined)
            return '';
        else
            return (this.DZ_STATUS.find(obj => obj.Id == Id).Value);
    }

    get_AGENT_TYPE(Id: number): string {
        if (Id == undefined)
            return '';
        else
            return (this.AGENT_TYPE.find(obj => obj.Id == Id).Value);
    }

    get_LEGAL_FORM(Id: number): string {
        if (Id == undefined)
            return '';
        else
            return (this.LEGAL_FORM.find(obj => obj.Id == Id).Value);
    }

    get_CONTRACT_TYPE(Id: number): string {
        if (Id == undefined)
            return '';
        else
            return (this.CONTRACT_TYPE.find(obj => obj.Id == Id).Value);
    }

    get_CONTRACT_DELIVERY_TYPE(Id: number): string {
        if (Id == undefined)
            return '';
        else
            return (this.CONTRACT_DELIVERY_TYPE.find(obj => obj.Id == Id).Value);
    }

    get_OFFER_STATUS(Id: number): string {
        if (Id == undefined)
            return '';
        else
            return (this.OFFER_STATUS.find(obj => obj.Id == Id).Value);
    }

    get_LOT_STATUS(Id: number): string {
        if (Id == undefined)
            return '';
        else
            return (this.LOT_STATUS.find(obj => obj.Id == Id).Value);
    }

    get_SIGN_FORM_TYPE(Id: number): string {
        if (Id == undefined)
        {
            console.log('Error in get_SIGN_FORM_TYPE');
            return '';
        }
        let dictItem = this.SIGN_FORM_TYPE.find(obj => obj.Id == Id);
        if (dictItem == undefined)
        {
            console.log('Error in get_SIGN_FORM_TYPE');
            return '';
        }
        return dictItem.Value;
    }

    get_HOME_PATH(agentType: number): string {
        let path = "not found";
        switch (agentType) {
            case 1: path = "SupplierHome"; break;
            case 2: path = "DebtorHome"; break;
            case 3: path = "InvestorHome"; break;

            default: console.log('Error in get_HOME_PATH: ', agentType);
        }

        return path;
    }
}

export class dictItem {
    public Id: number;
    public Value: string;

    constructor(Id: number, Value: string) {
        this.Id = Id;
        this.Value = Value;
    }
}

export class dictDocument {
    public DocTitle: string;
    public DocFieldName: string;
    public ShowInInputList: boolean;
    public MaxFileSize: number;

    constructor(DocTitle: string, DocFieldName: string, ShowInInputList: boolean, MaxFileSizeMB: number) {
        this.DocTitle = DocTitle;
        this.DocFieldName = DocFieldName;
        this.ShowInInputList = ShowInInputList;
        this.MaxFileSize = MaxFileSizeMB * 1000000;
    }
}
