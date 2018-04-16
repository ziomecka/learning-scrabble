/* jshint esversion: 6 */

class AuthorizationLoginService {
  constructor(authorizationSocket, authorizationService, authorizationStates) {
    "ngInject";

    this.authorizationSocket = authorizationSocket;
    this.authorizationService = authorizationService;
    this.authorizationStates = authorizationStates;

    this._state = "";
  }
  get isWaiting () {
    return this._state === this.authorizationStates.get("waiting");
  }

  set isWaiting (value) {
    if (value === true) {
      this._state = this.authorizationStates.get("waiting");
    }
  }

  get isFailureLogin () {
    return this._state === this.authorizationStates.get("failureLogin");
  }

  set isFailureLogin (value) {
    if (value === true) {
      this._state = this.authorizationStates.get("failureLogin");
    }
  }

  get isFailurePassword () {
    return this._state === this.authorizationStates.get("failurePassword");
  }

  set isFailurePassword (value) {
    if (value === true) {
      this._state = this.authorizationStates.get("failurePassword");
    }
  }

  get isSuccess () {
    return this._state === this.authorizationStates.get("success");
  }

  set isSuccess (value) {
    if (value === true) {
      this._state = this.authorizationStates.get("success");
    }
  }

  login (data) {
    this.isWaiting = true;
    this.authorizationSocket.authorize({
      data: data,
      callbacks: {
        success: data => {
          this.isSuccess = true;
          this.authorizationService.authorize(data);
        },
        failureLogin: () => {
          this.isFailureLogin = true;
        },
        failurePassword: () => {
          this.isFailurePassword = true;
        }
      }
    });
  }
}


angular
  .module("authorizationModule")
  .service("authorizationLoginService", AuthorizationLoginService);

// angular
// .module("authorizationModule")
// .service("authorizationLoginService",
//   function (authorizationSocket, authorizationService, authorizationStates) {
//     "ngInject";
//
//     this.isWaiting = () => this.state === authorizationStates.get("waiting");
//     this.isFailureLogin = () => this.state === authorizationStates.get("failureLogin");
//     this.isFailurePassword = () => this.state === authorizationStates.get("failurePassword");
//
//     this.login = data => {
//       this.state = authorizationStates.get("waiting");
//       authorizationSocket.authorize({
//         data: data,
//         callbacks: {
//           success: data => {
//             this.state = authorizationStates.get("success");
//             authorizationService.authorize(data);
//           },
//           failureLogin: () => {
//             this.state = authorizationStates.get("failureLogin");
//           },
//           failurePassword: () => {
//             this.state = authorizationStates.get("failurePassword");
//           }
//         }
//       });
//     };
//   });
