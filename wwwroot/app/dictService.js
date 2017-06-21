"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var DictionaryService = (function () {
    function DictionaryService() {
        this.TARIF_SELLER = Array(new dictItem(1, 'ТПП 1.0'), new dictItem(2, 'ТПП 2.0'), new dictItem(3, 'ТПП 3.0'));
        this.CONTRACT_TYPE = Array(new dictItem(1, 'Поставки'), new dictItem(2, 'Оказания услуг'), new dictItem(3, 'Выполнения работ'), new dictItem(4, 'Иное'));
        this.CONTRACT_DELIVERY_TYPE = Array(new dictItem(1, 'Самовывоз'), new dictItem(2, 'Доставка'), new dictItem(3, 'Иное'));
        this.DZ_STATUS = Array(new dictItem(0, 'Создана'), new dictItem(1, 'Ожидание верификации'), new dictItem(3, 'Отклонено дебитором'), new dictItem(4, 'Отклонено платформой'), new dictItem(5, 'Верифицировано дебитором'), new dictItem(6, 'Верифицировано платформой'), new dictItem(15, 'На торгах'), new dictItem(20, 'Продана'));
        this.OFFER_STATUS = Array(new dictItem(0, 'Создан'), new dictItem(1, 'Ожидание верификации'), new dictItem(10, 'Принят'), new dictItem(20, 'Отклонен'));
        this.LOT_STATUS = Array(new dictItem(0, 'Создан'), new dictItem(1, 'На торгах'), new dictItem(3, 'Встречный оффер инвестора'), new dictItem(5, 'Принят инвестором'), new dictItem(7, 'Принят поставщиком'));
        this.AGENT_TYPE = Array(new dictItem(1, 'Поставщик'), new dictItem(2, 'Дебитор'), new dictItem(3, 'Инвестор'));
        this.SIGN_FORM_TYPE = Array(new dictItem(0, 'Создана'), new dictItem(1, 'На согласовании'), new dictItem(5, 'Документы подтверждены'), new dictItem(10, 'Документы отклонены'));
        this.LEGAL_FORM = Array(new dictItem(1, 'ИП'), new dictItem(2, 'ПАО (ОАО)'), new dictItem(3, 'НАО (ЗАО)'), new dictItem(4, 'ООО'));
        this.SignFormCompanyDocuments = new Array();
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
        this.SignFormManagerDocuments = new Array();
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
    DictionaryService.prototype.get_DZ_STATUS = function (Id) {
        if (Id == undefined)
            return '';
        else
            return (this.DZ_STATUS.find(function (obj) { return obj.Id == Id; }).Value);
    };
    DictionaryService.prototype.get_AGENT_TYPE = function (Id) {
        if (Id == undefined)
            return '';
        else
            return (this.AGENT_TYPE.find(function (obj) { return obj.Id == Id; }).Value);
    };
    DictionaryService.prototype.get_LEGAL_FORM = function (Id) {
        if (Id == undefined)
            return '';
        else
            return (this.LEGAL_FORM.find(function (obj) { return obj.Id == Id; }).Value);
    };
    DictionaryService.prototype.get_CONTRACT_TYPE = function (Id) {
        if (Id == undefined)
            return '';
        else
            return (this.CONTRACT_TYPE.find(function (obj) { return obj.Id == Id; }).Value);
    };
    DictionaryService.prototype.get_CONTRACT_DELIVERY_TYPE = function (Id) {
        if (Id == undefined)
            return '';
        else
            return (this.CONTRACT_DELIVERY_TYPE.find(function (obj) { return obj.Id == Id; }).Value);
    };
    DictionaryService.prototype.get_OFFER_STATUS = function (Id) {
        if (Id == undefined)
            return '';
        else
            return (this.OFFER_STATUS.find(function (obj) { return obj.Id == Id; }).Value);
    };
    DictionaryService.prototype.get_LOT_STATUS = function (Id) {
        if (Id == undefined)
            return '';
        else
            return (this.LOT_STATUS.find(function (obj) { return obj.Id == Id; }).Value);
    };
    DictionaryService.prototype.get_SIGN_FORM_TYPE = function (Id) {
        if (Id == undefined) {
            console.log('Error in get_SIGN_FORM_TYPE');
            return '';
        }
        var dictItem = this.SIGN_FORM_TYPE.find(function (obj) { return obj.Id == Id; });
        if (dictItem == undefined) {
            console.log('Error in get_SIGN_FORM_TYPE');
            return '';
        }
        return dictItem.Value;
    };
    DictionaryService.prototype.get_HOME_PATH = function (agentType) {
        var path = "not found";
        switch (agentType) {
            case 1:
                path = "SupplierHome";
                break;
            case 2:
                path = "DebtorHome";
                break;
            case 3:
                path = "InvestorHome";
                break;
            default: console.log('Error in get_HOME_PATH: ', agentType);
        }
        return path;
    };
    DictionaryService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DictionaryService);
    return DictionaryService;
}());
exports.DictionaryService = DictionaryService;
var dictItem = (function () {
    function dictItem(Id, Value) {
        this.Id = Id;
        this.Value = Value;
    }
    return dictItem;
}());
exports.dictItem = dictItem;
var dictDocument = (function () {
    function dictDocument(DocTitle, DocFieldName, ShowInInputList, MaxFileSizeMB) {
        this.DocTitle = DocTitle;
        this.DocFieldName = DocFieldName;
        this.ShowInInputList = ShowInInputList;
        this.MaxFileSize = MaxFileSizeMB * 1000000;
    }
    return dictDocument;
}());
exports.dictDocument = dictDocument;
