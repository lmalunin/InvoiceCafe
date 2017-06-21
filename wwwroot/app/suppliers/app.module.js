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
var debtors_add_component_1 = require('./debtors-add.component');
var debtors_list_component_1 = require('./debtors-list.component');
var usersmanagement_component_1 = require("./usersmanagement.component");
var add_person_component_1 = require("./add-person.component");
var update_person_component_1 = require("./update-person.component");
var lots_list_component_1 = require('./lots-list.component');
var offers_list_component_1 = require('./offers-list.component');
var offer_details_component_1 = require('./offer-details.component');
var deals_component_1 = require('./deals.component');
var contracts_list_component_1 = require('./contracts-list.component');
var contracts_add_component_1 = require('./contracts-add.component');
var contract_details_component_1 = require('./contract-details.component');
var contract_update_component_1 = require('./contract-update.component');
var register_sign_component_1 = require('../common/register-sign.component');
var register_rules_component_1 = require('../common/register-rules.component');
var register_eds_component_1 = require('../common/register-eds.component');
var profile_component_1 = require('../common/profile.component');
var test_component_1 = require("./test.component");
var pipes_1 = require('./../pipes');
var ng2_translate_1 = require('ng2-translate/ng2-translate');
var helperService_1 = require('./../helperService');
var dataService_1 = require('./../dataService');
var storageService_1 = require('./../storageService');
var dictService_1 = require('./../dictService');
var edsService_1 = require('./../edsService');
var app_routing_1 = require('./app.routing');
var platform_browser_2 = require('@angular/platform-browser');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            providers: [
                dataService_1.DataService,
                storageService_1.StorageService,
                dictService_1.DictionaryService,
                edsService_1.EDSService,
                helperService_1.HelperService,
                platform_browser_2.__platform_browser_private__.BROWSER_SANITIZATION_PROVIDERS,
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
                lots_list_component_1.LotsListComponent,
                debtors_list_component_1.DebtorsListComponent,
                debtors_add_component_1.AddDebtorComponent,
                usersmanagement_component_1.UsersManagementComponent,
                add_person_component_1.AddPersonComponent,
                update_person_component_1.UpdatePersonComponent,
                register_sign_component_1.SignComponent,
                contracts_list_component_1.ContractsListComponent,
                contracts_add_component_1.ContractsAddComponent,
                contract_details_component_1.ContractDetailsComponent,
                contract_update_component_1.ContractUpdateComponent,
                offers_list_component_1.OffersListComponent,
                offer_details_component_1.OfferDetailsComponent,
                deals_component_1.DealsListComponent,
                pipes_1.CurrencyRurPipe,
                register_rules_component_1.RulesComponent,
                register_eds_component_1.EdsComponent,
                profile_component_1.ProfileComponent,
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
                angular2_polymer_1.PolymerElement('paper-fab'),
                angular2_polymer_1.PolymerElement('iron-autogrow-textarea'),
                //PolymerElement('iron-ajax'),
                //PolymerElement('iron-form'),
                angular2_polymer_1.PolymerElement('vaadin-date-picker'),
                angular2_polymer_1.PolymerElement('vaadin-upload'),
                //PolymerElement('vaadin-combo-box'), с объявлением некорректно работает vaadin-combo-box последней альфа версии, а без объявления - норм.
                angular2_polymer_1.PolymerElement('vaadin-grid'),
                test_component_1.TestComponent,
            ],
            bootstrap: [app_component_1.AppComponent],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
