/* jshint esversion: 6 */
class Service {
  constructor(
    authorizationStates,
    $timeout
  ) {
    "ngInject";

    Object.assign(this, {
      authorizationStates,
      $timeout
    });

    this.isIdle = true;
  }

  get isIdle () {
    return this._state === this.authorizationStates.get("idle");
  }

  set isIdle (value) {
    if (value === true) {
      this._state = this.authorizationStates.get("idle");
    } else {
      this.isWaiting = true;
    }
  }

  get isWaiting () {
    return this._state === this.authorizationStates.get("waiting");
  }

  set isWaiting (value) {
    if (value === true) {
      this._state = this.authorizationStates.get("waiting");
    } else {
      this.isIdle = true;
    }
  }

  get isFailurelogin () {
    return this._state === this.authorizationStates.get("failureLogin");
  }

  set isFailurelogin (value) {
    if (value === true) {
      this._state = this.authorizationStates.get("failureLogin");
    } else {
      this.isIdle = true;
    }
  }

  get isFailurepassword () {
    return this._state === this.authorizationStates.get("failurePassword");
  }

  set isFailurepassword (value) {
    if (value === true) {
      this._state = this.authorizationStates.get("failurePassword");
    } else {
      this.isIdle = true;
    }
  }

  get isSuccess () {
    return this._state === this.authorizationStates.get("success");
  }

  set isSuccess (value) {
    if (value === true) {
      this._state = this.authorizationStates.get("success");
    } else {
      this.isIdle = true;
    }
  }

  get isFailureother () {
    return this._state === this.authorizationStates.get("failureOther");
  }

  set isFailureother (value) {
    if (value === true) {
      this._state = this.authorizationStates.get("failureOther");
    } else {
      this.isIdle = true;
    }
  }

  get isFailurenotunique () {
    return this._state === this.authorizationStates.get("failureNotUnique");
  }

  set isFailurenotunique (value) {
    if (value === true) {
      this._state = this.authorizationStates.get("failureNotUnique");
    } else {
      this.isIdle = true;
    }
  }

  setTemporaryState (options) {
    let {state, value = true, temporary = true, time = 1500} = Object(options);
    let property = `is${state.charAt(0).toUpperCase() + state.slice(1).toLowerCase()}`;
    this[property] = value;
    if (temporary) {
      this.$timeout(() => {
        this[property] = !value;
      }, time);
    }
  }
}

angular // eslint-disable-line no-undef
  .module("app")
  .service("manageStatesService", Service);
