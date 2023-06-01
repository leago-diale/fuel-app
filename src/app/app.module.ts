import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DEFAULT_CONFIG, NgForageOptions, NgForageConfig, Driver } from 'ngforage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsModule } from '@angular/google-maps'

import {MatNativeDateModule} from '@angular/material/core'
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list'; 
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { HomeComponent } from './pages/home/home.component';
import { MapComponent } from './pages/map/map.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment.prod';
import { DirectionsComponent } from './pages/directions/directions.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        MapComponent,
        DirectionsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatMenuModule,
        MatTabsModule,
        MatGridListModule,
        MatSelectModule,
        MatBottomSheetModule,
        MatSidenavModule,
        MatListModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSnackBarModule,
        MatProgressBarModule,
        MatStepperModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatRadioModule,
        GoogleMapsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        })
    ],
    providers: [
        {
            provide: DEFAULT_CONFIG,
            useValue: {
                name: 'FuelApp',
                driver: [ // defaults to indexedDB -> webSQL -> localStorage
                    Driver.INDEXED_DB,
                    Driver.LOCAL_STORAGE
                ]
            } as NgForageOptions
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    public constructor(ngfConfig: NgForageConfig) {
        ngfConfig.configure({
            name: 'FuelApp',
            driver: [ // defaults to indexedDB -> webSQL -> localStorage
                Driver.INDEXED_DB,
                Driver.LOCAL_STORAGE
            ]
        });
    }
}
