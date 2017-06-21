"use strict";
var router_1 = require('@angular/router');
var index_component_1 = require('./index.component');
var lots_list_component_1 = require('./lots-list.component');
var lot_details_component_1 = require('./lot-details.component');
var contract_details_component_1 = require('./contract-details.component');
var offers_list_component_1 = require('./offers-list.component');
var deals_list_component_1 = require('./deals-list.component');
var filters_add_component_1 = require('./filters-add.component');
var filter_update_component_1 = require('./filter-update.component');
var register_sign_component_1 = require('../common/register-sign.component');
var register_rules_component_1 = require('../common/register-rules.component');
var register_eds_component_1 = require('../common/register-eds.component');
var profile_component_1 = require('../common/profile.component');
var usersmanagement_component_1 = require("./usersmanagement.component");
var add_person_component_1 = require("./add-person.component");
var update_person_component_1 = require("./update-person.component");
var appRoutes = [
    {
        path: '',
        redirectTo: 'InvestorHome/Index',
        pathMatch: 'full'
    },
    {
        path: 'InvestorHome',
        redirectTo: 'InvestorHome/Index',
        pathMatch: 'full'
    },
    {
        path: 'InvestorHome/Index',
        component: index_component_1.IndexComponent
    },
    {
        path: 'InvestorHome/Sign',
        component: register_sign_component_1.SignComponent
    },
    {
        path: 'InvestorHome/Lots',
        component: lots_list_component_1.LotsListComponent
    },
    {
        path: 'InvestorHome/Offers',
        component: offers_list_component_1.OffersListComponent
    },
    {
        path: 'InvestorHome/Deals',
        component: deals_list_component_1.DealsListComponent
    },
    {
        path: 'InvestorHome/Lot/:id',
        component: lot_details_component_1.LotDetailsComponent
    },
    {
        path: 'InvestorHome/ViewContract',
        component: contract_details_component_1.ContractDetailsComponent
    },
    {
        path: 'InvestorHome/UsersManagement',
        component: usersmanagement_component_1.UsersManagementComponent
    },
    {
        path: 'InvestorHome/AddPerson',
        component: add_person_component_1.AddPersonComponent
    },
    {
        path: 'InvestorHome/UpdatePerson/:id',
        component: update_person_component_1.UpdatePersonComponent
    },
    {
        path: 'InvestorHome/Rules',
        component: register_rules_component_1.RulesComponent
    },
    {
        path: 'InvestorHome/Eds',
        component: register_eds_component_1.EdsComponent
    },
    {
        path: 'InvestorHome/Profile',
        component: profile_component_1.ProfileComponent
    },
    {
        path: 'InvestorHome/AddFilter',
        component: filters_add_component_1.FiltersAddComponent
    },
    {
        path: 'InvestorHome/EditFilter/:id',
        component: filter_update_component_1.FilterUpdateComponent
    },
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
