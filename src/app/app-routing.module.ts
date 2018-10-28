import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { MaterialModule } from './material.module';
import { LoginComponent } from './modules/login/login.component';
import { ErrorComponent } from './modules/error/error.component';
import { BuscarComponent } from './modules/buscar/buscar.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'buscar', component: BuscarComponent },
    { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,
            useHash: false
        }),
        MaterialModule,
        CommonModule
    ],
    exports: [
        RouterModule,
        MaterialModule,
        CommonModule
    ],
    declarations: [
        HomeComponent,
        LoginComponent,
        ErrorComponent,
        BuscarComponent
    ]
})
export class AppRoutingModule { }
