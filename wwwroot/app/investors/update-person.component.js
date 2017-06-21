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
var dataService_1 = require('./../dataService');
var storageService_1 = require('./../storageService');
var helperService_1 = require('./../helperService');
var ng2_translate_1 = require('ng2-translate/ng2-translate');
var PersonViewModel_1 = require('../models/PersonViewModel');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var UrlObject = (function () {
    function UrlObject(_isVisible, _fileName, _getUrl, _deleteUrl) {
        this.isVisible = _isVisible;
        this.fileName = _fileName;
        this.getUrl = _getUrl;
        this.deleteUrl = _deleteUrl;
    }
    return UrlObject;
}());
var UpdatePersonComponent = (function () {
    function UpdatePersonComponent(_dataService, _route, _router, _storService, _helper, translate) {
        var _this = this;
        this._dataService = _dataService;
        this._route = _route;
        this._router = _router;
        this._storService = _storService;
        this._helper = _helper;
        this.translate = translate;
        this._person = new PersonViewModel_1.PersonViewModel();
        this.EDS_Ok = false;
        if (this.translate.currentLang == "en") {
            this._dp_local = this._helper.DATE_PICKER_i18n_en;
            this._upl_local = this._helper.UPLOAD_i18n_en;
        }
        if (this.translate.currentLang == "ru") {
            this._dp_local = this._helper.DATE_PICKER_i18n_ru;
            this._upl_local = this._helper.UPLOAD_i18n_ru;
        }
        this.showProgress = false;
        this._FullPowersDocumentsNames = new Array();
        this._IdentityDocumentsNames = new Array();
        this._FullPowersDocumentsNamesURLs = new Array();
        this._IdentityDocumentsNamesURLs = new Array();
        this._dataService.getPersonById(this._route.snapshot.params['id'])
            .subscribe(function (person) {
            _this._person = person;
            _this._person.DateOfBirth = moment(person.DateOfBirth).format('YYYY-MM-DD');
            _this._person.Company = _storService.getValue();
            _this._FullPowersDocumentsNames = JSON.parse(_this._person.FullPowersDocumentsNames);
            _this._IdentityDocumentsNames = JSON.parse(_this._person.IdentityDocumentsNames);
            for (var i in _this._FullPowersDocumentsNames) {
                _this._FullPowersDocumentsNamesURLs.push(new UrlObject(true, _this._FullPowersDocumentsNames[i], '/' + _this._person.GetDocsBaseUrl + '/' + _this._person.Id + "/" + _this._FullPowersDocumentsNames[i], '/' + _this._person.DeleteDocsBaseUrl + '/' + _this._person.Id + "/" + _this._FullPowersDocumentsNames[i]));
            }
            for (var i in _this._IdentityDocumentsNames) {
                _this._IdentityDocumentsNamesURLs.push(new UrlObject(true, _this._IdentityDocumentsNames[i], '/' + _this._person.GetDocsBaseUrl + '/' + _this._person.Id + "/" + _this._IdentityDocumentsNames[i], '/' + _this._person.DeleteDocsBaseUrl + '/' + _this._person.Id + "/" + _this._IdentityDocumentsNames[i]));
            }
            debugger;
        }, function (errorObject) { return _this.process_error(errorObject); });
    }
    //Functions
    UpdatePersonComponent.prototype.select_EDS = function (value) {
        this._person.EDS_type = value;
    };
    UpdatePersonComponent.prototype.select_possibility = function (value) {
        this._person.PossibilityType = value;
    };
    UpdatePersonComponent.prototype.delete_file = function (url) {
        var _this = this;
        this._dataService.delete_file(url)
            .subscribe(function (obj) {
            _this.person_document_deleted_ok(obj.fileName);
            if (_this._FullPowersDocumentsNames.includes(obj.fileName)) {
                _this._FullPowersDocumentsNames.splice(_this._FullPowersDocumentsNames.indexOf(obj.fileName), 1);
            }
            if (_this._IdentityDocumentsNames.includes(obj.fileName)) {
                _this._IdentityDocumentsNames.splice(_this._IdentityDocumentsNames.indexOf(obj.fileName), 1);
            }
            if (_this._FullPowersDocumentsNames && _this._FullPowersDocumentsNames != []) {
                _this._FullPowersDocumentsNamesURLs = _this._FullPowersDocumentsNamesURLs.filter(function (item) { return item.fileName != obj.fileName; });
            }
            if (_this._IdentityDocumentsNames && _this._IdentityDocumentsNames != []) {
                _this._IdentityDocumentsNamesURLs = _this._IdentityDocumentsNamesURLs.filter(function (item) { return item.fileName != obj.fileName; });
            }
        }, function (errorObject) { return _this.process_error(errorObject); });
    };
    UpdatePersonComponent.prototype.update_person = function () {
        var _this = this;
        this.showProgress = true;
        this._person.FullPowersDocumentsNames = JSON.stringify(this._FullPowersDocumentsNames);
        this._person.IdentityDocumentsNames = JSON.stringify(this._IdentityDocumentsNames);
        this.errorMessages = new Array();
        this._dataService.update_person(this._person)
            .subscribe(function (appForm) {
            _this.person_updated_ok(appForm);
            _this._person = appForm;
            _this._person.DateOfBirth = moment(appForm.DateOfBirth).format('YYYY-MM-DD');
            _this.toDownloadFPDN.nativeElement.files = [];
            _this.toDownloadIDN.nativeElement.files = [];
            _this._FullPowersDocumentsNamesURLs.forEach(function (doc) { return doc.isVisible = true; });
            _this._IdentityDocumentsNamesURLs.forEach(function (doc) { return doc.isVisible = true; });
        }, function (errorObject) { return _this.process_error(errorObject); });
    };
    //Callbacks
    UpdatePersonComponent.prototype.ngOnInit = function () { };
    UpdatePersonComponent.prototype.ngAfterViewInit = function () { };
    UpdatePersonComponent.prototype.before_file_upload = function (event) { };
    UpdatePersonComponent.prototype.after_file_upload_FPDN = function (event) {
        this._FullPowersDocumentsNames.push(event.detail.xhr.responseText);
        this._FullPowersDocumentsNames_Last = event.detail.xhr.responseText;
        this._FullPowersDocumentsNamesURLs.push(new UrlObject(false, event.detail.xhr.responseText, '/' + this._person.GetDocsBaseUrl + '/' + this._person.Id + "/" + event.detail.xhr.responseText, '/' + this._person.DeleteDocsBaseUrl + '/' + this._person.Id + "/" + event.detail.xhr.responseText));
    };
    UpdatePersonComponent.prototype.after_file_upload_IDN = function (event) {
        this._IdentityDocumentsNames.push(event.detail.xhr.responseText);
        this._IdentityDocumentsNames_Last = event.detail.xhr.responseText;
        this._IdentityDocumentsNamesURLs.push(new UrlObject(false, event.detail.xhr.responseText, '/' + this._person.GetDocsBaseUrl + '/' + this._person.Id + "/" + event.detail.xhr.responseText, '/' + this._person.DeleteDocsBaseUrl + '/' + this._person.Id + "/" + event.detail.xhr.responseText));
    };
    UpdatePersonComponent.prototype.upl_reject = function (event) { this._helper.showToast(document.getElementById('theToast'), event.detail.file.name + ' error: ' + event.detail.error); };
    UpdatePersonComponent.prototype.dialogEDS_Ok = function () {
        this.EDS_Ok = true;
        var dialog = document.getElementById('dialogEDS');
        if (dialog)
            dialog.close();
    };
    UpdatePersonComponent.prototype.dialogEDS_Show = function (_edsName, _edsThumb) {
        this.EDS_Name = _edsName;
        this.EDS_Thumb = _edsThumb;
        var dialog = document.getElementById('dialogEDS');
        if (dialog)
            dialog.open();
    };
    UpdatePersonComponent.prototype.person_document_deleted_ok = function (file) {
        this.showProgress = false;
        this._helper.showToast(document.getElementById('theToast'), 'Person\'s document ' + file + ' was deleted');
    };
    UpdatePersonComponent.prototype.person_updated_ok = function (appForm) {
        this.showProgress = false;
        this._helper.showToast(document.getElementById('theToast'), 'Person\'s data were updated');
    };
    UpdatePersonComponent.prototype.process_error = function (errorObject) {
        this.showProgress = false;
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    __decorate([
        core_1.ViewChild('toDownloadFPDN'), 
        __metadata('design:type', core_1.ElementRef)
    ], UpdatePersonComponent.prototype, "toDownloadFPDN", void 0);
    __decorate([
        core_1.ViewChild('toDownloadIDN'), 
        __metadata('design:type', core_1.ElementRef)
    ], UpdatePersonComponent.prototype, "toDownloadIDN", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], UpdatePersonComponent.prototype, "_dp_local", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], UpdatePersonComponent.prototype, "_upl_local", void 0);
    UpdatePersonComponent = __decorate([
        core_1.Component({
            selector: 'ic-update-supplier',
            templateUrl: '/templates/v0102/investors/update-person.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.ActivatedRoute, router_1.Router, storageService_1.StorageService, helperService_1.HelperService, ng2_translate_1.TranslateService])
    ], UpdatePersonComponent);
    return UpdatePersonComponent;
}());
exports.UpdatePersonComponent = UpdatePersonComponent;
