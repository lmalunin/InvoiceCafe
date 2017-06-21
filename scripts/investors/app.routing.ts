import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent }      from './index.component';

import { LotsListComponent } from './lots-list.component';
import { LotDetailsComponent } from './lot-details.component';
import { ContractDetailsComponent } from './contract-details.component';
import { OffersListComponent } from './offers-list.component';
import { DealsListComponent } from './deals-list.component';

import { FiltersAddComponent } from './filters-add.component';
import { FilterUpdateComponent } from './filter-update.component';

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
        component: IndexComponent
    },
    {
        path: 'InvestorHome/Sign',
        component: SignComponent
    },
    {
        path: 'InvestorHome/Lots',
        component: LotsListComponent
    },
    {
        path: 'InvestorHome/Offers',
        component: OffersListComponent
    },
    {
        path: 'InvestorHome/Deals',
        component: DealsListComponent
    },
    {
        path: 'InvestorHome/Lot/:id',
        component: LotDetailsComponent
    },
    {
        path: 'InvestorHome/ViewContract',
        component: ContractDetailsComponent
    },
    {
        path: 'InvestorHome/UsersManagement',
        component: UsersManagementComponent
    },
    {
        path: 'InvestorHome/AddPerson',
        component: AddPersonComponent
    },
    {
        path: 'InvestorHome/UpdatePerson/:id',
        component: UpdatePersonComponent
    },
    {
        path: 'InvestorHome/Rules',
        component: RulesComponent
    },
    {
        path: 'InvestorHome/Eds',
        component: EdsComponent
    },
    {
        path: 'InvestorHome/Profile',
        component: ProfileComponent
    },
    {
        path: 'InvestorHome/AddFilter',
        component: FiltersAddComponent
    },
    {
        path: 'InvestorHome/EditFilter/:id',
        component: FilterUpdateComponent
    },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);