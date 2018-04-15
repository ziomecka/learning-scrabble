/* jshint esversion: 6 */
angular
.module("authorizationModule")
.service("authorizationLoginService", [
  "authorizationSocket",
  "authorizationService",
  function (authorizationSocket, authorizationService) {
    /** Data shared with controller */
    this.data = {
      state: {}
    };

    const clearStates = () => {
      this.data.state = {
        failureLogin: false,
        failurePassword: false,
        waiting: false,
        success: false
      };
    };

    clearStates();

    const changeState = {
      failureLogin: () => {
        clearStates();
        this.data.state.failureLogin = true;
      },
      failurePassword: () => {
        clearStates();
        this.data.state.failurePassword = true;
      },
      success: () => {
        clearStates();
        this.data.state.success = true;
      },
      waiting: () => {
        clearStates();
        this.data.state.waiting = true;
      }
    };

    this.login = data => {
      changeState.waiting();
      authorizationSocket.authorize({
        data: data,
        callbacks: {
          success: data => {
            changeState.success();
            authorizationService.authorize(data);
          },
          failureLogin: () => {
            changeState.failureLogin();
          },
          failurePassword: () => {
            changeState.failurePassword();
          }
        }
      });
    };
  }]
);
