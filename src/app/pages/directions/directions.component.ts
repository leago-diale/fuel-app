import { Component, OnInit } from '@angular/core';
import {MapDirectionsService} from '@angular/google-maps'
import { Observable, map } from 'rxjs';

@Component({
    selector: 'app-directions',
    templateUrl: './directions.component.html',
    styleUrls: ['./directions.component.css']
})
export class DirectionsComponent implements OnInit {
    
    readonly directionsResults$: Observable<google.maps.DirectionsResult | undefined> | undefined;
    center: google.maps.LatLngLiteral = {lat: 24, lng: 12};
    zoom = 15;

    constructor(mapDirectionsService: MapDirectionsService) { 
        const request: google.maps.DirectionsRequest = {
            destination: {lat: -25.853952, lng: 28.1935872},
            origin: {lat: -25.8193952, lng: 28.1972113},
            travelMode: google.maps.TravelMode.DRIVING
          };
          this.directionsResults$ = mapDirectionsService.route(request).pipe(map((response: any) => response.result));
    }

    ngOnInit() {
        
    }

}
