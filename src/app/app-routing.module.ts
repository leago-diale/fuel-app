import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MapComponent } from './pages/map/map.component';
import { DirectionsComponent } from './pages/directions/directions.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'map', component: MapComponent },
    { path: 'directions', component: DirectionsComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
