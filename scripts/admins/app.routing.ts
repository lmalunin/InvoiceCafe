import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent }      from './index.component';

import { CompaniesListComponent }      from './companies-list.component';
import { SignFormDetailsComponent }      from './signform-details.component';

import { DZListComponent }      from './dz-list.component';
import { DZDetailsComponent}      from './dz-details.component';

const appRoutes: Routes = [
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
        component: IndexComponent
    },
    {
        path: 'AdminHome/Companies',
        component: CompaniesListComponent
    },
    {
        path: 'AdminHome/DZ',
        component: DZListComponent
    },
    {
        path: 'AdminHome/DZ/:id',
        component: DZDetailsComponent
    },
    {
        path: 'AdminHome/SignForm/:id',
        component: SignFormDetailsComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);