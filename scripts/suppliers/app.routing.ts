import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent }      from './index.component';
import { AddDebtorComponent } from './debtors-add.component';
import { DebtorsListComponent } from './debtors-list.component';
import { LotsListComponent } from './lots-list.component';
import { OffersListComponent } from './offers-list.component';
import { OfferDetailsComponent } from './offer-details.component';
import { DealsListComponent } from './deals.component';

import { SignComponent }      from '../common/register-sign.component';
import { RulesComponent }      from '../common/register-rules.component';
import { EdsComponent }      from '../common/register-eds.component';
import { ProfileComponent }      from '../common/profile.component';

import { ContractsListComponent }      from './contracts-list.component';
import { ContractsAddComponent }      from './contracts-add.component';
import { ContractDetailsComponent }      from './contract-details.component';
import { ContractUpdateComponent }      from './contract-update.component';

import { UsersManagementComponent } from "./usersmanagement.component";
import { AddPersonComponent } from "./add-person.component";
import { UpdatePersonComponent } from "./update-person.component";


import { TestComponent } from "./test.component";


const appRoutes: Routes = [
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
        component: IndexComponent
    },
    {
        path: 'SupplierHome/Sign',
        component: SignComponent
    },
    {
        path: 'SupplierHome/Debtors',
        component: DebtorsListComponent
    },
    {
        path: 'SupplierHome/AddDebtor',
        component: AddDebtorComponent
    },
    {
        path: 'SupplierHome/Contracts',
        component: ContractsListComponent
    },
    {
        path: 'SupplierHome/AddContract',
        component: ContractsAddComponent
    },
    {
        path: 'SupplierHome/Contract/:contractId',
        component: ContractDetailsComponent
    },
    {
        path: 'SupplierHome/ContractUpdate/:contractId',
        component: ContractUpdateComponent
    },
    {
        path: 'SupplierHome/Offers',
        component: OffersListComponent
    },
    {
        path: 'SupplierHome/Offer/:id',
        component: OfferDetailsComponent
    },
    {
        path: 'SupplierHome/Deals',
        component: DealsListComponent
    },
    {
        path: 'SupplierHome/Lots',
        component: LotsListComponent
    },
    {
        path: 'SupplierHome/UsersManagement',
        component: UsersManagementComponent
    },
    {
        path: 'SupplierHome/AddPerson',
        component: AddPersonComponent
    },
    {
        path: 'SupplierHome/UpdatePerson/:id',
        component: UpdatePersonComponent
    },
    {
        path: 'SupplierHome/Rules',
        component: RulesComponent
    },
    {
        path: 'SupplierHome/Eds',
        component: EdsComponent
    },
    {
        path: 'SupplierHome/Profile',
        component: ProfileComponent
    }
    ,
    {
        path: 'SupplierHome/Test',
        component: TestComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);