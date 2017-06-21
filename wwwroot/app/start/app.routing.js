"use strict";
var router_1 = require('@angular/router');
var register_component_1 = require('./register.component');
var login_component_1 = require('./login.component');
var index_component_1 = require('./index.component');
var appRoutes = [
    {
        path: '',
        redirectTo: 'Start/Index',
        pathMatch: 'full'
    },
    {
        path: 'Start/Index',
        component: index_component_1.IndexComponent
    },
    {
        path: 'Start/Register',
        component: register_component_1.RegisterComponent
    },
    {
        path: 'Start/Logout',
        component: login_component_1.LogoutComponent
    },
    {
        path: 'Start/Login',
        component: login_component_1.LoginComponent
    },
    {
        path: 'Start/Login/:ReturnUrl',
        component: login_component_1.LoginComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
