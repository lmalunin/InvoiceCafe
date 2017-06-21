"use strict";
var router_1 = require('@angular/router');
var index_component_1 = require('./index.component');
var companies_list_component_1 = require('./companies-list.component');
var signform_details_component_1 = require('./signform-details.component');
var dz_list_component_1 = require('./dz-list.component');
var dz_details_component_1 = require('./dz-details.component');
var appRoutes = [
    {
        path: '',
        redirectTo: 'AdminHome/Index',
        pathMatch: 'full'
    },
    {
        path: 'AdminHome',
        redirectTo: 'AdminHome/Index',
        pathMatch: 'full'
    },
    {
        path: 'AdminHome/Index',
        component: index_component_1.IndexComponent
    },
    {
        path: 'AdminHome/Companies',
        component: companies_list_component_1.CompaniesListComponent
    },
    {
        path: 'AdminHome/DZ',
        component: dz_list_component_1.DZListComponent
    },
    {
        path: 'AdminHome/DZ/:id',
        component: dz_details_component_1.DZDetailsComponent
    },
    {
        path: 'AdminHome/SignForm/:id',
        component: signform_details_component_1.SignFormDetailsComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
