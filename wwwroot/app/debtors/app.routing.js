"use strict";
var router_1 = require('@angular/router');
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
var appRoutes = [
    {
        path: '',
        redirectTo: 'DebtorHome/Index',
        pathMatch: 'full'
    },
    {
        path: 'DebtorHome',
        redirectTo: 'DebtorHome/Index',
        pathMatch: 'full'
    },
    {
        path: 'DebtorHome/Index',
        component: index_component_1.IndexComponent
    },
    {
        path: 'DebtorHome/Sign',
        component: register_sign_component_1.SignComponent
    },
    {
        path: 'DebtorHome/DZ',
        component: dz_list_component_1.DZListComponent
    },
    {
        path: 'DebtorHome/DZ/:id',
        component: dz_details_component_1.DZDetailsComponent
    },
    {
        path: 'DebtorHome/ViewContract',
        component: contracts_component_1.ContractDetailsComponent
    },
    {
        path: 'DebtorHome/UsersManagement',
        component: usersmanagement_component_1.UsersManagementComponent
    },
    {
        path: 'DebtorHome/AddPerson',
        component: add_person_component_1.AddPersonComponent
    },
    {
        path: 'DebtorHome/UpdatePerson/:id',
        component: update_person_component_1.UpdatePersonComponent
    },
    {
        path: 'DebtorHome/Rules',
        component: register_rules_component_1.RulesComponent
    },
    {
        path: 'DebtorHome/Eds',
        component: register_eds_component_1.EdsComponent
    },
    {
        path: 'DebtorHome/Profile',
        component: profile_component_1.ProfileComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
