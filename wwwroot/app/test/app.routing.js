"use strict";
var router_1 = require('@angular/router');
var test_component_1 = require("./test.component");
var appRoutes = [
    {
        path: '',
        redirectTo: 'Start/Test',
        pathMatch: 'full'
    },
    {
        path: 'Start/Test',
        redirectTo: 'Start/Test',
        component: test_component_1.TestComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
