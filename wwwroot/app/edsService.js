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
var http_2 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
require('./rxjs-operators');
var LocalSignatureRequest = (function () {
    function LocalSignatureRequest() {
    }
    return LocalSignatureRequest;
}());
exports.LocalSignatureRequest = LocalSignatureRequest;
var LocalSignatureResponse = (function () {
    function LocalSignatureResponse() {
    }
    return LocalSignatureResponse;
}());
exports.LocalSignatureResponse = LocalSignatureResponse;
var LocalProviderInfo = (function () {
    function LocalProviderInfo() {
    }
    return LocalProviderInfo;
}());
exports.LocalProviderInfo = LocalProviderInfo;
var EDSService = (function () {
    function EDSService(http) {
        this.http = http;
        this.apiBase = 'api/'; // URL to web API
        this.localBase = 'http://127.0.0.1:61611/';
    }
    EDSService.prototype.checkLocalProvider = function () {
        return this.http.get(this.localBase + 'version')
            .map(this.extractData)
            .catch(this.handleError);
    };
    EDSService.prototype.prepareDraftForSignature = function (guid) {
        var params = new http_2.URLSearchParams();
        params.append("docId", guid);
        var body = params.toString();
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new http_1.RequestOptions({ headers: headers });
        console.log(body);
        return this.http.post(this.apiBase + 'service/UploadDraftToEDSStorage', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    EDSService.prototype.localSign = function (request) {
        var body = JSON.stringify(request);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        //console.log(body);
        return this.http.post(this.localBase + 'hash/signature', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    EDSService.prototype.serverSign = function (request) {
        var body = JSON.stringify(request);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        //console.log(body);
        return this.http.post(this.apiBase + 'service/SignDraftInEDSStorage', body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    EDSService.prototype.extractData = function (res) {
        var body = res.json();
        return body || {};
    };
    EDSService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        console.log("Error in DictService: ", error);
        //let errMsg = (error.message) ? error.message :
        //    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        //console.error(errMsg); // log to console instead
        return Observable_1.Observable.throw(JSON.parse(error._body));
    };
    EDSService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], EDSService);
    return EDSService;
}());
exports.EDSService = EDSService;
