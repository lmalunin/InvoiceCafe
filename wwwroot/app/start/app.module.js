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
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var forms_1 = require('@angular/forms');
var angular2_polymer_1 = require('@vaadin/angular2-polymer');
var register_component_1 = require('./register.component');
var dataService_1 = require('./../dataService');
var ng2_translate_1 = require('ng2-translate/ng2-translate');
var helperService_1 = require('./../helperService');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            providers: [
                dataService_1.DataService, helperService_1.HelperService
            ],
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                forms_1.FormsModule,
                http_1.JsonpModule,
                ng2_translate_1.TranslateModule.forRoot(),
            ],
            declarations: [
                register_component_1.RegisterComponent,
                angular2_polymer_1.PolymerElement('app-header-layout'),
                angular2_polymer_1.PolymerElement('app-header'),
                angular2_polymer_1.PolymerElement('app-toolbar'),
                angular2_polymer_1.PolymerElement('paper-card'),
                angular2_polymer_1.PolymerElement('paper-input'),
                angular2_polymer_1.PolymerElement('vaadin-date-picker'),
                angular2_polymer_1.PolymerElement('paper-slider'),
                angular2_polymer_1.PolymerElement('paper-button'),
                angular2_polymer_1.PolymerElement('paper-checkbox'),
                angular2_polymer_1.PolymerElement('paper-toast'),
                angular2_polymer_1.PolymerElement('paper-dialog'),
                angular2_polymer_1.PolymerElement('vaadin-upload'),
                angular2_polymer_1.PolymerElement('iron-autogrow-textarea')
            ],
            bootstrap: [register_component_1.RegisterComponent],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
