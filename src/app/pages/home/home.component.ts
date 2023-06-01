import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppServiceService } from 'src/app/services/app-service.service';
import { NgForage } from 'ngforage';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

    title = 'fuel-app';
    latitude: number = 0;
    longitude: number = 0;
    accuracy: number = 0;
    fuel_stations = []
    distances: any = []
    loading: boolean = true
    watchId: number | any
    distArr: any = []
    parseInt: any = parseInt
    updated: boolean = false
    direction: string = ''
    heading: any

    constructor(
        private service: AppServiceService,
        private readonly ngf: NgForage,
        private router: Router
    ) { }

    ngOnDestroy() {
        navigator.geolocation.clearWatch(this.watchId)
    }

    ngOnInit() {
        this.getLocation()
            .then(() => {
                this.getShortestDistances()
            }).catch(() => {
                console.log('Ther was an error')
            })

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };
        if (navigator.geolocation) {
                navigator.geolocation.watchPosition(
                    (position) => {
                        this.updateLocation(position.coords.latitude, position.coords.longitude)
                        //this.getDirection(position.coords.latitude, position.coords.longitude)
                        this.heading = position.coords.heading
                    },
                    (error) => {
                        console.log('Error getting location:', error);
                    },
                    options
                );
        } else {
            console.log('Geolocation is not supported by this browser.');
            new Error('Geolocation is not supported.');
        }
    }

    getLocation(): Promise<void> {
        this.loading = true
        return new Promise<void>((resolve, reject) => {
            const options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            };
            if (navigator.geolocation) {
                this.watchId =
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            this.latitude = position.coords.latitude;
                            this.longitude = position.coords.longitude;
                            this.accuracy = position.coords.accuracy;
                            resolve();
                        },
                        (error) => {
                            console.log('Error getting location:', error);
                            this.loading = false
                            reject(error);
                        },
                        options
                    );
            } else {
                console.log('Geolocation is not supported by this browser.');
                this.loading = false
                reject(new Error('Geolocation is not supported.'));
            }
        });
    }

    getDistanceInKm(lat1: any, lon1: any, item: any) {
        const toRadians = (degrees: number): number => {
            return degrees * (Math.PI / 180);
        }
        const earthRadius = 6371; // Radius of the Earth in kilometers
        const dLat = toRadians(parseFloat(lat1.replace(',', '.')) - this.latitude);
        const dLon = toRadians(parseFloat(lon1.replace(',', '.')) - this.longitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(parseFloat(lat1.replace(',', '.')))) * Math.cos(toRadians(this.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
        return { distance: distance, item: item }
    }

    async getShortestDistances() {
        const distances: any = []
        const fuel_stations = await this.getItem('fuel_stations')
        fuel_stations.map((element: any) => {
            const dist = this.getDistanceInKm(element['GPS LATITUDE'], element['GPS LONGITUDE'], element)
            if (!isNaN(dist.distance)) {
                distances.push(dist)
            }
        });
        distances.sort((a: any, b: any) => a.distance - b.distance);
        const origins = [
            {
                "waypoint": {
                    "via": false,
                    "vehicleStopover": false,
                    "sideOfRoad": false,
                    "location": {
                        "latLng": {
                            "latitude": this.latitude,
                            "longitude": this.longitude
                        }
                    }
                }
            }
        ]

        const destinations = distances.slice(0, 6).map((res: any, index: number) => {
            return {
                "waypoint": {
                    "via": false,
                    "vehicleStopover": false,
                    "sideOfRoad": false,
                    "location": {
                        "latLng": {
                            "latitude": parseFloat(res.item['GPS LATITUDE'].replace(',', '.')),
                            "longitude": parseFloat(res.item['GPS LONGITUDE'].replace(',', '.'))
                        }
                    }
                }
            }
        })
        const payload = {
            "origins": origins,
            "destinations": destinations,
            "travelMode": "DRIVE",
            "routingPreference": "TRAFFIC_AWARE_OPTIMAL",
            "languageCode": "en-US"
        }
        this.distArr = this.sortObjects(distances.slice(0, 6))
        //console.log(this.distArr)
        //const drivingDistArr = await this.service.getDrivingDistance(payload)

        // this.distArr = distances.slice(0, 6).map((item: any, index: number)=> {
        //     return {
        //         straightDist: {...item},
        //         drivingDist: drivingDistArr.map((item: any)=> {
        //             if(item.destinationIndex == index) {
        //                 return item
        //             }
        //         }).filter((value: any) => value !== undefined)
        //     }
        // })
        this.loading = false
    }

    sortObjects(arr: any) {
        const sortedObjects = arr.sort((a: any, b: any) => {
            if (parseInt(a.item['Ranking']) !== parseInt(b.item['Ranking'])) {
                return parseInt(a.item['Ranking']) - parseInt(b.item['Ranking']);
            } else {
                return a.distance - b.distance;
            }
        });
        return sortedObjects;
    }

    getStars(ranking: number): number[] {
        const maxStars = 6;
        const numStars = maxStars - ranking;
        return Array(numStars).fill(0);
    }

    async updateLocation(lat: number, lon: number) {
        const toRadians = (degrees: number): number => {
            return degrees * (Math.PI / 180);
        }
        const earthRadius = 6371; // Radius of the Earth in kilometers
        const dLat = toRadians(lat - this.latitude);
        const dLon = toRadians(lon - this.longitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat)) * Math.cos(toRadians(this.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
        if (distance > 0.5) {
            this.latitude = lat
            this.longitude = lon
            this.getShortestDistances()
            this.updated = true
            setTimeout(() => {
                this.updated = false
            }, 5000)
        }
    }

    openDirections(lat: any, lng: any) {
        var url = "https://www.google.com/maps/dir/?api=1&destination=" + parseFloat(lat.replace(',', '.')) + "," + parseFloat(lng.replace(',', '.'));
        window.open(url);
    }

    mapLocations() {
        const queryParams = {
            lat: this.latitude,
            lng: this.longitude,
            distArr: JSON.stringify(this.distArr)
        };
        this.router.navigate(['/map'], { queryParams })
        //this.router.navigateByUrl('/directions')
    }

    getDirection(lat: number, lon: number) {
        const latitudeDifference = lat - this.latitude;
        const longitudeDifference = lon - this.longitude;

        let direction = '';

        if (latitudeDifference > 0) {
            direction += 'North';
        } else if (latitudeDifference < 0) {
            direction += 'South';
        }

        if (longitudeDifference > 0) {
            direction += 'East';
        } else if (longitudeDifference < 0) {
            direction += 'West';
        }

        if (direction === '') {
            direction = 'Stationary';
        }
        
        if (direction == 'Stationary') {
            this.direction =  `You are ${direction}`
        }else{
            this.direction = `You are moving in the ${direction} direction`
        }
    }

    reshresh() {
        window.location.reload();
    }

    public setItem<T = any>(key: string, data: T): Promise<T> {
        return this.ngf.setItem<T>(key, data);
    }

    public getItem<T = any>(key: string): Promise<T | null> {
        return this.ngf.getItem<T>(key);
    }

    public removeItem<T = string>(key: string): Promise<void> {
        return this.ngf.removeItem(key);
    }

}
