import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment.prod';
import { NgForage } from 'ngforage';

@Injectable({
    providedIn: 'root'
})
export class AppServiceService {

    constructor(
        private readonly ngf: NgForage,
    ) { }

    async logActions(params: any) {
        const payload = { "db": "BFM_FuelApp", "table": "Logs", "action": "insert", "data": params }
        const headers = { 'Content-Type': 'application/json', 'token': 'BK175mqMN0' }
        try {
            const { data } = await axios.post(`${environment.apiBase}${environment.SQL}`, payload, { headers: headers })
            console.log(data)
        } catch (error) {
            console.log(error)
            await this.setItem(params.uuid,params)
        }
    }

    async getFuelStations() {
        const payload = { "db": "BFM_FuelApp", "table": "[Stations]", "action": "select" }
        const headers = { 'Content-Type': 'application/json', 'token': 'BK175mqMN0' }
        try {
            const { data } = await axios.post(`${environment.apiBase}${environment.SQL}`, payload, { headers: headers })
            await this.setItem('fuel_stations', data.Stations)
            return true
        } catch (error) {
            console.log(error)
        }
    }

    async getDrivingDistance(payload: { origins: { waypoint: { via: boolean; vehicleStopover: boolean; sideOfRoad: boolean; location: { latLng: { latitude: number; longitude: number; }; }; }; }[]; destinations: any; travelMode: string; routingPreference: string; languageCode: string; }) {
        const headers = { 'X-Goog-FieldMask': '*' }
        try {
            const res = await axios.post(`https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix?key=${environment.apiKey}`, payload, { headers: headers })
            return res.data
        } catch (error) {
            return error
        }
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
