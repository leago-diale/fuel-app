// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    apiBase: "https://data.bidvestfm.co.za/",
    UPLOAD: "SQL/Rental_Inspection/upload?sys=dev",
    SQL: "SQL/Rental_Inspection/db?sys=prod",
    loginReq: "ZRFC3/request?sys=prod",
    production: false,
    sys: 'prod',
    token: 'BK175mqMN0',
    apiKey: 'AIzaSyAfFlIMy6mW8ZDL7WHk8BgWaBqIBeBEi0Q'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
