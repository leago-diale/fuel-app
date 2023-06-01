import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | any;
    zoom = 13;
    display: any;
    center: google.maps.LatLngLiteral | any;
    mapOptions: google.maps.MapOptions | any;
    locationsArr: any = []
    currentLocation: google.maps.LatLngLiteral | any;
    heading: number | any

    constructor(private route: ActivatedRoute) { }

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

    openDirections(marker: any) {
        var url = "https://www.google.com/maps/dir/?api=1&destination=" + marker.position.lat + "," + marker.position.lng;
        window.open(url);
    }

}
