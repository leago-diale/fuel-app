import { Component, OnInit, ViewChild } from '@angular/core';
import { AppServiceService } from './services/app-service.service';
import { NgForage } from 'ngforage';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'fuel-app';

    constructor(
        private service: AppServiceService,
        private readonly ngf: NgForage,
        private router: Router,
        private swUpdate: SwUpdate
    ) { }

    async ngOnInit() {
        this.service.getFuelStations().then(async (res) => {
            if (res) {
                this.router.navigateByUrl('/home')
            }
        }).catch((err) => {
            console.log(err)
        })

        const check = await this.getItem('fuel_stations')
        if (check) {
            this.router.navigateByUrl('/home')
        }

        if (this.swUpdate.isEnabled) {
            this.swUpdate.available.subscribe(event => {
                if (confirm('A new version is available. Update now?')) {
                    window.location.reload();
                }
            });
        }
    }

    public getItem<T = any>(key: string): Promise<T | null> {
        return this.ngf.getItem<T>(key);
    }
}
