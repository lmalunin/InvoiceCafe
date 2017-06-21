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
var platform_browser_1 = require('@angular/platform-browser');
require('./../rxjs-operators');
var router_1 = require('@angular/router');
var OpenFileComponent = (function () {
    function OpenFileComponent(_dataService, _route, _router, _storService, _helper, _sanitizer) {
        //this._dataService.get_file(this._route.snapshot.params['file'], this._route.snapshot.params['id'])
        //    .subscribe(
        //    data => {
        //        this._page = 1;
        this._dataService = _dataService;
        this._route = _route;
        this._router = _router;
        this._storService = _storService;
        this._helper = _helper;
        this._sanitizer = _sanitizer;
        this._isImage = false;
        this._isPdf = true;
        //        //this._file_url = data.file;
        //        //this._file_url = _sanitizer.bypassSecurityTrustResourceUrl(data.file);
        //        this._file_url = 'files/636156251571615198_document-18206154166001841508.pdf';
        //        //var ext = this._file_url.substr(this._file_url.lastIndexOf('.') + 1);
        //        //if ((ext == 'jpeg') || (ext =='jpg')) {
        //        //    this._isImage = true;
        //        //    this._isPdf = false;
        //        //} else if (ext == 'pdf'){
        //        //    this._isImage = false;
        //        //    this._isPdf = true;
        //        //}
        //    },
        //    errorObject => this.process_error(errorObject));
    }
    OpenFileComponent.prototype.ngOnInit = function () { };
    OpenFileComponent.prototype.process_error = function (errorObject) {
        for (var fieldName in errorObject)
            for (var message in errorObject[fieldName])
                this.errorMessages.push(errorObject[fieldName][message]);
        console.log(errorObject);
    };
    OpenFileComponent = __decorate([
        core_1.Component({
            selector: 'ic-update-supplier',
            templateUrl: '/templates/v0102/suppliers/open-file.tpl.html'
        }), 
        __metadata('design:paramtypes', [dataService_1.DataService, router_1.ActivatedRoute, router_1.Router, storageService_1.StorageService, helperService_1.HelperService, platform_browser_1.DomSanitizer])
    ], OpenFileComponent);
    return OpenFileComponent;
}());
exports.OpenFileComponent = OpenFileComponent;
