import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestComponent } from "./test.component";


const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'Start/Test',
        pathMatch: 'full'
    },
    {
        path: 'Start/Test',
        redirectTo: 'Start/Test',
        component: TestComponent
    }

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);