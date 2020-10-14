// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  readThreshold: {
    match: [-1000, 0],
    undef: [-30000, -1000],
    unmatch: [-Infinity, -30000]
  },
  // apiUrl: 'https://2c7a49032683.ngrok.io/api'
  apiUrl: 'https://rustreader.herokuapp.com/api'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
