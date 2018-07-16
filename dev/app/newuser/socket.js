/* jshint esversion: 6 */
class Service {
  constructor (
    socketFactory,
    newuserEvents
  ) {
    "ngInject";
    Object.assign(this, {
      socketFactory,
      newuserEvents
    });
  }

  createUser (options) {
      let {data, callbacks: {success, failureNotUnique, failureOther}} = options;
      let off = () => {
        this.socketFactory.off(this.newuserEvents.resDuplicatedLogin);
        this.socketFactory.off(this.newuserEvents.resNewuserSuccess);
      };

      this.socketFactory.emit(this.newuserEvents.reqNewuser, data);

      this.socketFactory.on(this.newuserEvents.resDuplicatedLogin, () => {
        off();
        failureNotUnique();
      });

      this.socketFactory.on(this.newuserEvents.resNewuserSuccess, data => {
        off();
        success(data);
      });
    }
  }

  angular // eslint-disable-line no-undef
    .module("newuserModule")
    .service("newuserSocket", Service);
