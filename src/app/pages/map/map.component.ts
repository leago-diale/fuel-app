import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment.prod';
import { NgForage } from 'ngforage';
import { v4 as uuidv4 } from 'uuid';
import { AppServiceService } from 'src/app/services/app-service.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    zoom = 13;
    display: any;
    center: google.maps.LatLngLiteral | any;
    mapOptions: google.maps.MapOptions | any;
    locationsArr: any = []
    currentLocation: google.maps.LatLngLiteral | any;
    heading: number | any
    address: string = ''
    accuracy: any

    constructor(private route: ActivatedRoute, private readonly ngf: NgForage, private service: AppServiceService) { }

    ngOnInit(): void {

        this.route.queryParams.subscribe((params: any) => {
            this.locationsArr = JSON.parse(params?.['distArr']).map((res: any) => {
                return {
                    position: {
                        lat: parseFloat(res.item['GPS LATITUDE'].replace(',', '.')),
                        lng: parseFloat(res.item['GPS LONGITUDE'].replace(',', '.'))
                    },
                    item: res['item']
                }
            })
            this.center = {
                lat: parseFloat(params['lat']),
                lng: parseFloat(params['lng'])
            }
            this.currentLocation = {
                lat: parseFloat(params['lat']),
                lng: parseFloat(params['lng'])
            }
            this.getAddress(parseFloat(params['lat']), parseFloat(params['lng']))
        });

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };
        if (navigator.geolocation) {
                navigator.geolocation.watchPosition(
                    (position) => {
                        this.currentLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                        this.heading = position.coords.heading
                        this.getAddress(position.coords.latitude, position.coords.longitude)
                        this.accuracy = position.coords.accuracy.toFixed(2)
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

    markerOptions: google.maps.MarkerOptions = {
        icon: {
            url: './assets/blue-car.png', // Path to your custom marker image
            scaledSize: new google.maps.Size(45, 38), // Adjust the size of the marker
            rotation: 90
        },
    };

    marker2Options: google.maps.MarkerOptions = {
        icon: {
            labelOrigin: new google.maps.Point(23, 48),
            url: './assets/pump-logo.png', // Path to your custom marker image
            scaledSize: new google.maps.Size(45, 40), // Adjust the size of the marker
        },
    };

    async getAddress(latitude: number, longitude: number) {
        try {
            const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${environment.apiKey}`);
            this.address = res.data.results[0].formatted_address
        } catch (error: any) {
            console.log(error.response.data)
        }
    }

    openDirections(marker: any) {
        var url = "https://www.google.com/maps/dir/?api=1&destination=" + marker.position.lat + "," + marker.position.lng;
        window.open(url);

        const currentTimestamp = Date.now();
        const options = { timeZone: 'Africa/Johannesburg' };
        const formattedDateTime = new Date(currentTimestamp).toLocaleString('en-ZA', options);
        
        const uuid = uuidv4()
        const logPayload = {
            uuid: uuid,
            time_stamp: `[${formattedDateTime}]`,
            log_entry: `Direction from ${this.address} to ${marker.item['OIL COMPANY']} ${marker.item['STREET ADDRESS']}, ${marker.item['SUBURB']}, ${marker.item['TOWN CITY']}`,
            originLat: this.currentLocation.lat,
            originLng: this.currentLocation.lng,
            accuracy: this.accuracy,
            destLat: marker.position.lat,
            destLng: marker.position.lng,
            user_id: localStorage.getItem('fuelAppUser')
        }
        this.setItem(uuid, logPayload)
        this.service.logActions(logPayload)
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
