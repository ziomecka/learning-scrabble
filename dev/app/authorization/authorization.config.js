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
    // url: "/private",
    resolve: {
       user: ["authorizationService", "$q", (authorization, $q) => {
         const d = $q.defer();
         if (authorization.authorized) {
           d.resolve(authorization.user);
         } else {
           d.reject("not authorized");
         }
         return d.promise;
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
    // resolve: {
    //  "": (rooms, $stateParams) => rooms.find(room => room.id === $stateParams.roomId)
    // }
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
