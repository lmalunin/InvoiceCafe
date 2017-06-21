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
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
require('./rxjs-operators');
var DataService = (function () {
    function DataService(http) {
        this.http = http;
        this.apiUrl = 'api/Test'; // URL to web API
        this.apiBase = 'api/'; // URL to web API
    }
    DataService.prototype.getAppForms = function () {
        return this.http.get(this.apiUrl)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getDebtorsForSupplier = function (id) {
        return this.http.get('/api/companies/getdebtorsforsupplier?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getSignforms = function () {
        return this.http.get('/api/admin/getsignforms')
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getContractsForSupplier = function (id) {
        return this.http.get('/api/contracts/getcontractsforsupplier?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getLotsForSupplier = function (guid) {
        return this.http.get('/api/contracts/getlotsforsupplier?guid=' + guid)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getFreeLots = function (guid) {
        return this.http.get('/api/contracts/getfreelots?guid=' + guid)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getFiltersForInvestor = function (id) {
        return this.http.get('/api/companies/getfiltersforinvestor?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getFilter = function (id) {
        return this.http.get('/api/companies/getfilter?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getLotsByFilter = function (filters) {
        var body = JSON.stringify(filters);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        //console.log(body);
        return this.http.post('/api/contracts/searchlots', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getDZForDebtor = function (guid) {
        return this.http.get('/api/companies/getdzfordebtor?guid=' + guid)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getDZForAdmin = function () {
        return this.http.get('/api/admin/getdzforadmin')
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getContractDetails = function (guid) {
        return this.http.get('/api/contracts/getcontractdetails?guid=' + guid)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getLotDetails = function (id) {
        return this.http.get('/api/contracts/getlotdetails?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getDZDetails = function (id) {
        return this.http.get('/api/contracts/getdzdetails?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getSignFormDetails = function (id) {
        return this.http.get('/api/admin/getsignformdetails?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getCompanyDetails = function (id) {
        return this.http.get('/api/companies/getcompanydetails?guid=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getOfferDetails = function (id) {
        return this.http.get('/api/contracts/getofferdetails?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getCompanyByINN = function (id) {
        return this.http.get('/api/companies/getcompanybyinn?inn=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getOffersForInvestor = function (id) {
        return this.http.get('/api/contracts/getoffersforinvestor?guid=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getOffersForSupplier = function (id) {
        return this.http.get('/api/contracts/getoffersforsupplier?guid=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getDealsForInvestor = function (id) {
        return this.http.get('/api/contracts/getdealsforinvestor?guid=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getDealsForSupplier = function (id) {
        return this.http.get('/api/contracts/getdealsforsupplier?guid=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getAllUsersForCompany = function (id) {
        return this.http.get('/api/UsersManagement/GetAllPersonsForCompany?companyId=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getPersonById = function (id) {
        return this.http.get('/api/UsersManagement/GetPersonById?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getEDSDocuments = function (id, type, status) {
        return this.http.get('/api/Service/GetEDSDocuments?id=' + id + '&documentType=' + type + '&documentStatus=' + status)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getSubscriberForDebtor = function (id) {
        return this.http.get('/api/companies/GetSubscriberForDebtor?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.register_new_user = function (appForm) {
        var body = JSON.stringify(appForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/account/register', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.addOrUpdateFilter = function (data) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/companies/addorupdatefilter', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.add_debtor = function (appForm) {
        var body = JSON.stringify(appForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/companies/AddNewDebtorBySupplier', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.add_person = function (appForm) {
        var body = JSON.stringify(appForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/UsersManagement/AddPerson', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.attach_debtor = function (dGuid, sGuid) {
        return this.http.get('/api/companies/AttachDebtorToSupplier?dGuid=' + dGuid + "&sGuid=" + sGuid)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.add_contract = function (appForm) {
        var body = JSON.stringify(appForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/contracts/add', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.update_contract = function (c, d) {
        var body = JSON.stringify([JSON.stringify(c), JSON.stringify(d)]);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        console.log(d);
        return this.http.post('/api/contracts/update', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.add_signform = function (appForm) {
        var body = JSON.stringify(appForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/account/addsignform', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.accept_signform = function (appForm) {
        var body = JSON.stringify(appForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/admin/acceptsignform', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.accept_eds = function () {
        var body = '';
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/admin/accepteds', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.accept_rules = function () {
        var body = '';
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/admin/acceptrules', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.add_dz = function (appForm) {
        var body = JSON.stringify(appForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/contracts/adddz', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.accept_dz = function (appForm) {
        var body = JSON.stringify(appForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/companies/acceptdz', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.accept_dz_byadmin = function (appForm) {
        var body = JSON.stringify(appForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/admin/acceptdz', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.add_lot = function (appForm) {
        var body = JSON.stringify(appForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/contracts/addlot', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    //новая версия
    DataService.prototype.addOffers = function (appForm) {
        var body = JSON.stringify(appForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/contracts/addoffers', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.add_offers = function (appForm) {
        var body = JSON.stringify(appForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/contracts/addoffers', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.processOffer = function (offer) {
        var body = JSON.stringify(offer);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post("/api/contracts/processoffer", body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.processLogin = function (loginForm) {
        var body = JSON.stringify(loginForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post("/api/account/login", body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.processLogout = function (loginForm) {
        var body = JSON.stringify(loginForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post("/api/account/logout", body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.update_person = function (appForm) {
        var body = JSON.stringify(appForm);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/UsersManagement/UpdatePerson', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.delete_file = function (url) {
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.extractData = function (res) {
        var body = res.json();
        return body || {};
    };
    DataService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        console.log("Error in DictService: ", error);
        //let errMsg = (error.message) ? error.message :
        //    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        //console.error(errMsg); // log to console instead
        return Observable_1.Observable.throw(JSON.parse(error._body));
    };
    DataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], DataService);
    return DataService;
}());
exports.DataService = DataService;
