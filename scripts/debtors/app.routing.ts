import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent }      from './index.component';
import { DZListComponent }      from './dz-list.component';
import { DZDetailsComponent}      from './dz-details.component';
import { ContractDetailsComponent }      from './contracts.component';

import { SignComponent }      from '../common/register-sign.component';
import { RulesComponent }      from '../common/register-rules.component';
import { EdsComponent }      from '../common/register-eds.component';
import { ProfileComponent }      from '../common/profile.component';

import { UsersManagementComponent } from "./usersmanagement.component";
import { AddPersonComponent } from "./add-person.component";
import { UpdatePersonComponent } from "./update-person.component";

const appRoutes: Routes = [
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
        component: IndexComponent
    },
    {
        path: 'DebtorHome/Sign',
        component: SignComponent
    },
    {
        path: 'DebtorHome/DZ',
        component: DZListComponent
    },
    {
        path: 'DebtorHome/DZ/:id',
        component: DZDetailsComponent
    },
    {
        path: 'DebtorHome/ViewContract',
        component: ContractDetailsComponent
    },
    {
        path: 'DebtorHome/UsersManagement',
        component: UsersManagementComponent
    },
    {
        path: 'DebtorHome/AddPerson',
        component: AddPersonComponent
    },
    {
        path: 'DebtorHome/UpdatePerson/:id',
        component: UpdatePersonComponent
    },
    {
        path: 'DebtorHome/Rules',
        component: RulesComponent
    },
    {
        path: 'DebtorHome/Eds',
        component: EdsComponent
    },
    {
        path: 'DebtorHome/Profile',
        component: ProfileComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);