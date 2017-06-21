"use strict";
var router_1 = require('@angular/router');
var index_component_1 = require('./index.component');
var debtors_add_component_1 = require('./debtors-add.component');
var debtors_list_component_1 = require('./debtors-list.component');
var lots_list_component_1 = require('./lots-list.component');
var offers_list_component_1 = require('./offers-list.component');
var offer_details_component_1 = require('./offer-details.component');
var deals_component_1 = require('./deals.component');
var register_sign_component_1 = require('../common/register-sign.component');
var register_rules_component_1 = require('../common/register-rules.component');
var register_eds_component_1 = require('../common/register-eds.component');
var profile_component_1 = require('../common/profile.component');
var contracts_list_component_1 = require('./contracts-list.component');
var contracts_add_component_1 = require('./contracts-add.component');
var contract_details_component_1 = require('./contract-details.component');
var contract_update_component_1 = require('./contract-update.component');
var usersmanagement_component_1 = require("./usersmanagement.component");
var add_person_component_1 = require("./add-person.component");
var update_person_component_1 = require("./update-person.component");
var test_component_1 = require("./test.component");
var appRoutes = [
    {
        path: '',
        redirectTo: 'SupplierHome/Index',
        pathMatch: 'full'
    },
    {
        path: 'SupplierHome',
        redirectTo: 'SupplierHome/Index',
        pathMatch: 'full'
    },
    {
        path: 'SupplierHome/Index',
        component: index_component_1.IndexComponent
    },
    {
        path: 'SupplierHome/Sign',
        component: register_sign_component_1.SignComponent
    },
    {
        path: 'SupplierHome/Debtors',
        component: debtors_list_component_1.DebtorsListComponent
    },
    {
        path: 'SupplierHome/AddDebtor',
        component: debtors_add_component_1.AddDebtorComponent
    },
    {
        path: 'SupplierHome/Contracts',
        component: contracts_list_component_1.ContractsListComponent
    },
    {
        path: 'SupplierHome/AddContract',
        component: contracts_add_component_1.ContractsAddComponent
    },
    {
        path: 'SupplierHome/Contract/:contractId',
        component: contract_details_component_1.ContractDetailsComponent
    },
    {
        path: 'SupplierHome/ContractUpdate/:contractId',
        component: contract_update_component_1.ContractUpdateComponent
    },
    {
        path: 'SupplierHome/Offers',
        component: offers_list_component_1.OffersListComponent
    },
    {
        path: 'SupplierHome/Offer/:id',
        component: offer_details_component_1.OfferDetailsComponent
    },
    {
        path: 'SupplierHome/Deals',
        component: deals_component_1.DealsListComponent
    },
    {
        path: 'SupplierHome/Lots',
        component: lots_list_component_1.LotsListComponent
    },
    {
        path: 'SupplierHome/UsersManagement',
        component: usersmanagement_component_1.UsersManagementComponent
    },
    {
        path: 'SupplierHome/AddPerson',
        component: add_person_component_1.AddPersonComponent
    },
    {
        path: 'SupplierHome/UpdatePerson/:id',
        component: update_person_component_1.UpdatePersonComponent
    },
    {
        path: 'SupplierHome/Rules',
        component: register_rules_component_1.RulesComponent
    },
    {
        path: 'SupplierHome/Eds',
        component: register_eds_component_1.EdsComponent
    },
    {
        path: 'SupplierHome/Profile',
        component: profile_component_1.ProfileComponent
    },
    {
        path: 'SupplierHome/Test',
        component: test_component_1.TestComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
