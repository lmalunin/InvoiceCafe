import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { RegisterFormViewModel } from './models/RegisterFormViewModel';
import { LoginViewModel } from './models/LoginViewModel';
import { CompanyViewModel } from './models/CompanyViewModel';
import { ContractViewModel } from './models/ContractViewModel';
import { DZViewModel } from './models/DZViewModel';
import { LotViewModel } from './models/LotViewModel';
import { OfferViewModel } from './models/OfferViewModel';
import { DealViewModel } from './models/DealViewModel';
import { SignFormViewModel } from './models/SignFormViewModel';

import { SearchLotsViewModel } from './models/SearchLotsViewModel';
import { SearchLotsResults } from './models/SearchLotsResults';

import { PersonViewModel } from './models/PersonViewModel';
import { ClientDocumentViewModel } from './models/ClientDocumentViewModel';

import { Observable }     from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';

import './rxjs-operators';

@Injectable()
export class DataService {
    constructor(private http: Http) { }
    private apiUrl = 'api/Test';  // URL to web API
    private apiBase = 'api/';  // URL to web API

    getAppForms(): Observable<RegisterFormViewModel[]> {
        return this.http.get(this.apiUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDebtorsForSupplier(id: UUID): Observable<CompanyViewModel[]> {
        return this.http.get('/api/companies/getdebtorsforsupplier?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getSignforms(): Observable<SignFormViewModel[]> {
        return this.http.get('/api/admin/getsignforms')
            .map(this.extractData)
            .catch(this.handleError);
    }

    getContractsForSupplier(id: UUID): Observable<ContractViewModel[]> {
        return this.http.get('/api/contracts/getcontractsforsupplier?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getLotsForSupplier(guid: string): Observable<LotViewModel[]> {
        return this.http.get('/api/contracts/getlotsforsupplier?guid=' + guid)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getFreeLots(guid: string): Observable<LotViewModel[]> {
        return this.http.get('/api/contracts/getfreelots?guid=' + guid)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getFiltersForInvestor(id: UUID): Observable<SearchLotsViewModel[]> {
        return this.http.get('/api/companies/getfiltersforinvestor?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getFilter(id: number): Observable<SearchLotsViewModel> {
        return this.http.get('/api/companies/getfilter?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getLotsByFilter(filters: SearchLotsViewModel): Observable<SearchLotsResults[]> {
        let body = JSON.stringify(filters);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        //console.log(body);
        return this.http.post('/api/contracts/searchlots', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDZForDebtor(guid: string): Observable<DZViewModel[]> {
        return this.http.get('/api/companies/getdzfordebtor?guid=' + guid)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDZForAdmin(): Observable<DZViewModel[]> {
        return this.http.get('/api/admin/getdzforadmin')
            .map(this.extractData)
            .catch(this.handleError);
    }

    getContractDetails(guid: string): Observable<ContractViewModel> {
        return this.http.get('/api/contracts/getcontractdetails?guid=' + guid)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getLotDetails(id: number): Observable<LotViewModel> {
        return this.http.get('/api/contracts/getlotdetails?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDZDetails(id: number): Observable<DZViewModel> {
        return this.http.get('/api/contracts/getdzdetails?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getSignFormDetails(id: number): Observable<SignFormViewModel> {
        return this.http.get('/api/admin/getsignformdetails?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCompanyDetails(id: number): Observable<CompanyViewModel> {
        return this.http.get('/api/companies/getcompanydetails?guid=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getOfferDetails(id: number): Observable<OfferViewModel> {
        return this.http.get('/api/contracts/getofferdetails?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCompanyByINN(id: string): Observable<CompanyViewModel> {
        return this.http.get('/api/companies/getcompanybyinn?inn=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getOffersForInvestor(id: string): Observable<OfferViewModel[]> {
        return this.http.get('/api/contracts/getoffersforinvestor?guid=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getOffersForSupplier(id: string): Observable<OfferViewModel[]> {
        return this.http.get('/api/contracts/getoffersforsupplier?guid=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDealsForInvestor(id: string): Observable<DealViewModel[]> {
        return this.http.get('/api/contracts/getdealsforinvestor?guid=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDealsForSupplier(id: string): Observable<DealViewModel[]> {
        return this.http.get('/api/contracts/getdealsforsupplier?guid=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAllUsersForCompany(id: UUID): Observable<PersonViewModel[]> {
        return this.http.get('/api/UsersManagement/GetAllPersonsForCompany?companyId=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getPersonById(id: UUID): Observable<PersonViewModel> {
        return this.http.get('/api/UsersManagement/GetPersonById?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEDSDocuments(id: UUID, type: number, status: number): Observable<ClientDocumentViewModel[]> {
        return this.http.get('/api/Service/GetEDSDocuments?id=' + id + '&documentType=' + type + '&documentStatus=' + status)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getSubscriberForDebtor(id: UUID): Observable<PersonViewModel> {
        return this.http.get('/api/companies/GetSubscriberForDebtor?id=' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    register_new_user(appForm: RegisterFormViewModel): Observable<RegisterFormViewModel> {
        let body = JSON.stringify(appForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/account/register', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    addOrUpdateFilter(data: SearchLotsViewModel): Observable<any> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/companies/addorupdatefilter', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    add_debtor(appForm: CompanyViewModel): Observable<CompanyViewModel> {
        let body = JSON.stringify(appForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/companies/AddNewDebtorBySupplier', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    add_person(appForm: PersonViewModel): Observable<PersonViewModel> {
        let body = JSON.stringify(appForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/UsersManagement/AddPerson', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    attach_debtor(dGuid: string, sGuid: string): Observable<CompanyViewModel> {
        return this.http.get('/api/companies/AttachDebtorToSupplier?dGuid=' + dGuid + "&sGuid=" + sGuid)
            .map(this.extractData)
            .catch(this.handleError);
    }

    add_contract(appForm: ContractViewModel): Observable<ContractViewModel> {
        let body = JSON.stringify(appForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/contracts/add', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    update_contract(c: ContractViewModel, d: CompanyViewModel): Observable<ContractViewModel> {
        let body = JSON.stringify([JSON.stringify(c), JSON.stringify(d)]);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        console.log(d);
        return this.http.post('/api/contracts/update', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    add_signform(appForm: SignFormViewModel): Observable<SignFormViewModel> {
        let body = JSON.stringify(appForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/account/addsignform', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    accept_signform(appForm: SignFormViewModel): Observable<SignFormViewModel> {
        let body = JSON.stringify(appForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/admin/acceptsignform', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    accept_eds(): Observable<string> {
        let body = '';
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/admin/accepteds', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    accept_rules(): Observable<string> {
        let body = '';
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/admin/acceptrules', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    add_dz(appForm: DZViewModel): Observable<DZViewModel> {
        let body = JSON.stringify(appForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/contracts/adddz', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    accept_dz(appForm: DZViewModel): Observable<DZViewModel> {
        let body = JSON.stringify(appForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/companies/acceptdz', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    accept_dz_byadmin(appForm: DZViewModel): Observable<DZViewModel> {
        let body = JSON.stringify(appForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/admin/acceptdz', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    add_lot(appForm: LotViewModel): Observable<LotViewModel> {
        let body = JSON.stringify(appForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/contracts/addlot', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    //новая версия
    addOffers(appForm: SearchLotsResults[]): Observable<SearchLotsResults[]> {
        let body = JSON.stringify(appForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/contracts/addoffers', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    add_offers(appForm: OfferViewModel[]): Observable<OfferViewModel[]> {
        let body = JSON.stringify(appForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/contracts/addoffers', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    processOffer(offer: OfferViewModel): Observable<OfferViewModel> {
        let body = JSON.stringify(offer);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post("/api/contracts/processoffer", body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    processLogin(loginForm: LoginViewModel): Observable<LoginViewModel> {
        let body = JSON.stringify(loginForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post("/api/account/login", body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    processLogout(loginForm: LoginViewModel): Observable<LoginViewModel> {
        let body = JSON.stringify(loginForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post("/api/account/logout", body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    update_person(appForm: PersonViewModel): Observable<PersonViewModel> {
        let body = JSON.stringify(appForm);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/UsersManagement/UpdatePerson', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    delete_file(url: string) {
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message

        console.log("Error in DictService: ", error);
        //let errMsg = (error.message) ? error.message :
        //    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        //console.error(errMsg); // log to console instead

        return Observable.throw(JSON.parse(error._body));
    }
}