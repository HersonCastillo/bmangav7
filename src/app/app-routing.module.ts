import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { MaterialModule } from './material.module';

const routes: Routes = [
    { path: '', component: HomeComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,
            useHash: false
        }),
        MaterialModule
    ],
    exports: [
        RouterModule,
        MaterialModule
    ],
    declarations: [
        HomeComponent
    ]
})
export class AppRoutingModule { }
