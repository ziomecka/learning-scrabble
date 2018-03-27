/* jshint esversion: 6 */
angular
.module("authorizationModule")
.config([
  "$routeProvider",
  "$locationProvider",
  "$stateProvider",
  ($routeProvider, $locationProvider, $stateProvider) => {

  const authorizationState = {
    name: "authorization",
    component: "authorizationComponent",
    url: "/",
    resolve: {
      loginUser : (clientService) => {
      }
    }
  };

  const newUserState = {
    name: "newuser",
    url: "/newuser",
    component: "newuserComponent",
  };

  const privateState = {
    abstract: true,
    name: "private",
    resolve: {
      user: ["authorizationService", "$q", (authorization, $q) => {
        const deferred = $q.defer();
        if (authorization.authorized) {
          deferred.resolve(authorization.user);
        } else {
          deferred.reject("not authorized");
        }
        return deferred.promise;
      }]
    }
  };

  const privateRoomsState = {
    // abstract: true,
    name: "privaterooms",
    url: "/rooms",
    views: {
      "": {
        component: "roomsComponent"
      },
      "newroom@private.rooms": {
        component: "newroomComponent"
      }
    }
  };

  const privateRoomState = {
    name: "privateroom",
    url: "/:roomId",
    component: "roomComponent",
    resolve: {
      roomData: [
        "clientService",
        "clientEvents",
        "$q",
        (clientService, clientEvents, $q) => {
          const deferred = $q.defer();
          clientService.on(clientEvents.resJoinedRoomDetails, data => deferred.resolve(data));
          // TODO
          clientService.on(clientEvents, data => deferred.reject("failed to join the room"));
          return deferred.promise;
        }
      ]
    }
 };

  $routeProvider.otherwise({templateUrl: "../index.html"});

  $stateProvider.state("authorization", authorizationState);
  $stateProvider.state("newuser", newUserState);
  $stateProvider.state("private", privateState);
  $stateProvider.state("private.rooms", privateRoomsState);
  // $stateProvider.state("private.rooms.newroom", privateNewRoomState);
  $stateProvider.state("private.room", privateRoomState);

  $locationProvider.html5Mode({enabled: true});
}
]);
