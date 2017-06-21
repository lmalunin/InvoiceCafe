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
var app_component_1 = require('./app.component');
var index_component_1 = require('./index.component');
var dz_list_component_1 = require('./dz-list.component');
var dz_details_component_1 = require('./dz-details.component');
var contracts_component_1 = require('./contracts.component');
var register_sign_component_1 = require('../common/register-sign.component');
var register_rules_component_1 = require('../common/register-rules.component');
var register_eds_component_1 = require('../common/register-eds.component');
var profile_component_1 = require('../common/profile.component');
var usersmanagement_component_1 = require("./usersmanagement.component");
var add_person_component_1 = require("./add-person.component");
var update_person_component_1 = require("./update-person.component");
var pipes_1 = require('./../pipes');
var ng2_translate_1 = require('ng2-translate/ng2-translate');
var dataService_1 = require('./../dataService');
var storageService_1 = require('./../storageService');
var dictService_1 = require('./../dictService');
var helperService_1 = require('./../helperService');
var edsService_1 = require('./../edsService');
var app_routing_1 = require('./app.routing');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            providers: [
                dataService_1.DataService, storageService_1.StorageService, dictService_1.DictionaryService, helperService_1.HelperService, edsService_1.EDSService
            ],
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                forms_1.FormsModule,
                http_1.JsonpModule,
                ng2_translate_1.TranslateModule.forRoot(),
                app_routing_1.routing
            ],
            declarations: [
                app_component_1.AppComponent,
                index_component_1.IndexComponent,
                dz_list_component_1.DZListComponent,
                dz_details_component_1.DZDetailsComponent,
                contracts_component_1.ContractDetailsComponent,
                register_sign_component_1.SignComponent,
                register_rules_component_1.RulesComponent,
                register_eds_component_1.EdsComponent,
                profile_component_1.ProfileComponent,
                usersmanagement_component_1.UsersManagementComponent,
                add_person_component_1.AddPersonComponent,
                update_person_component_1.UpdatePersonComponent,
                pipes_1.CurrencyRurPipe, pipes_1.LabelDaysPipe,
                angular2_polymer_1.PolymerElement('app-header-layout'),
                angular2_polymer_1.PolymerElement('app-header'),
                angular2_polymer_1.PolymerElement('app-toolbar'),
                angular2_polymer_1.PolymerElement('paper-card'),
                angular2_polymer_1.PolymerElement('paper-input'),
                angular2_polymer_1.PolymerElement('paper-slider'),
                angular2_polymer_1.PolymerElement('paper-button'),
                angular2_polymer_1.PolymerElement('paper-checkbox'),
                angular2_polymer_1.PolymerElement('paper-toast'),
                angular2_polymer_1.PolymerElement('paper-dialog'),
                angular2_polymer_1.PolymerElement('paper-radio-group'),
                angular2_polymer_1.PolymerElement('paper-radio-button'),
                angular2_polymer_1.PolymerElement('paper-toolbar'),
                angular2_polymer_1.PolymerElement('iron-autogrow-textarea'),
                angular2_polymer_1.PolymerElement('vaadin-date-picker'),
                angular2_polymer_1.PolymerElement('vaadin-upload'),
                angular2_polymer_1.PolymerElement('vaadin-grid')
            ],
            bootstrap: [app_component_1.AppComponent],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
