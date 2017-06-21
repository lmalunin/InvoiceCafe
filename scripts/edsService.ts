import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { URLSearchParams } from '@angular/http';

import { EDSLocalSignatureViewModel } from './models/EDSLocalSignatureViewModel';
import { UUID } from 'angular2-uuid';

import { Observable }     from 'rxjs/Observable';
import './rxjs-operators';

export class LocalSignatureRequest {
    hash: string;
    certificate: string;
}

export class LocalSignatureResponse {
    signature: string;
}

export class LocalProviderInfo {
    version: string;
    os: string;
    api: string;
}

@Injectable()
export class EDSService {
    constructor(private http: Http) { }
    private apiBase = 'api/';  // URL to web API
    private localBase = 'http://127.0.0.1:61611/';

    checkLocalProvider(): Observable<LocalProviderInfo> {
        return this.http.get(this.localBase + 'version')
            .map(this.extractData)
            .catch(this.handleError);
    }

    prepareDraftForSignature(guid: string): Observable<EDSLocalSignatureViewModel> {
        let params = new URLSearchParams();
        params.append("docId", guid);
        let body = params.toString();
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        console.log(body);
        return this.http.post(this.apiBase + 'service/UploadDraftToEDSStorage', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    localSign(request: LocalSignatureRequest): Observable<LocalSignatureResponse> {
        let body = JSON.stringify(request);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        //console.log(body);
        return this.http.post(this.localBase + 'hash/signature', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    serverSign(request: EDSLocalSignatureViewModel): Observable<any> {
        let body = JSON.stringify(request);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        //console.log(body);
        return this.http.post(this.apiBase + 'service/SignDraftInEDSStorage', body, options)
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