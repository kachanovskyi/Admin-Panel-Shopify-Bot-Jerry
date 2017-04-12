'use strict';
// var myApp = angular.module('navBarDemoBasicUsage', ['ngMaterial', 'ngRoute'])
//     .controller('AppCtrl', AppCtrl);

var HiSumo = angular.module('HiSumo', ['ngRoute', 'ngAnimate', 'ngMaterial', 'ui.bootstrap', 'ngSanitize']);

HiSumo
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                redirectTo: function () {
                    return "/dashboard"
                }
            })

            .when('/dashboard', {
                templateUrl: 'pages/dashboard.html',
                controller: 'DashboardCtrl',
                controllerAs: 'dashboard'
            })

            .when('/messages', {
                templateUrl: 'pages/messages.html',
                controller: 'MessagesCtrl',
                controllerAs: 'messages'
            })

            .when('/settings', {
                templateUrl: 'pages/settings.html',
                controller: 'SettingsCtrl',
                controllerAs: 'settings'
            })
            .when('/settings-disable', {
                templateUrl: 'pages/settings-disable.html',
                controller: 'SettingsCtrl',
                controllerAs: 'settings'
            })
            .when('/settings-notifications', {
                templateUrl: 'pages/settings-notifications.html',
                controller: 'SettingsCtrl',
                controllerAs: 'settings'
            })

            .when('/settings-recharge', {
                templateUrl: 'pages/settings-recharge.html',
                controller: 'SettingsCtrl',
                controllerAs: 'settings'
            })

            .when('/broadcast', {
                templateUrl: 'pages/broadcast.html',
                controller: 'BroadcastCtrl',
                controllerAs: 'broadcast'
            })

            .when('/broadcast-subscribers', {
                templateUrl: 'pages/broadcast-subscribers.html',
                controller: 'BroadcastCtrl',
                controllerAs: 'broadcast'
            })

            .when('/support', {
                templateUrl: 'pages/support.html',
                controller: 'SupportCtrl',
                controllerAs: 'support'
            })

            .when('/getStarted', {
                templateUrl: 'pages/get-started.html',
                controller: 'GetStartedCtrl',
                controllerAs: 'getStarted'
            })

            .otherwise({
                templateUrl: 'pages/404.html'
            });

        $locationProvider.html5Mode(true);
        $locationProvider.hasPrefix = '!';
    }]);


// function AppCtrl($scope, $http, $mdDialog) {
//   $scope.currentNavItem = 'dashboard';
//   $scope.shopId = document.getElementById("shop").value;
//   $scope.sendMessage = function (index) {
//     console.log($scope.buyers[index]);
//     $http.get("/send?to=" + $scope.buyers[index].phone + "&text=" + $scope.buyers[index].text + "&shopId=" + $scope.shopId)
//         .then(function (responce){
//           console.log("sent");
//         });
//   };
//
//   $scope.sendToSubscribed = function (text) {
//     $http.get("/send-to-subscribed?shopId=" + $scope.shopId + "&text=" + text)
//         .then(function (response) {
//         });
//   };
//
//   $scope.showConfirm = function (ev) {
//     var confirm = $mdDialog.confirm()
//         .title('Are you sure you want to disable chatbot?')
//         .targetEvent(ev)
//         .ok('Disable!')
//         .cancel('Cancel');
//
//     $mdDialog.show(confirm).then(function() {
//       $http({
//         method: 'POST',
//         url: '/webhook/app/disableBot',
//         data: {
//           shopId : $scope.shopId
//         }
//       });
//       $scope.shop.isBotActive = !$scope.shop.isBotActive;
//       console.log($scope.shop.isBotActive)
//     }, function() {
//
//     });
//   };
//
//   $scope.unsubscribeUser = function (ev, id, index) {
//     var confirm = $mdDialog.confirm()
//         .title('Are you sure you want to delete this user?')
//         .targetEvent(ev)
//         .ok('Delete!')
//         .cancel('Cancel');
//
//     $mdDialog.show(confirm).then(function() {
//       console.log(id);
//       $http({
//         method: 'DELETE',
//         url: '/shop/buyer/',
//         data: {
//           shopifyId: id,
//           shopId: $scope.shopId
//         },
//         headers: {
//           'Content-type': 'application/json;charset=utf-8'
//         }
//       })
//           .then(function(response) {
//             console.log(response.data);
//             $scope.subscribeCount = $scope.subscribeCount - 1;
//             $scope.buyers[index].isSubscribe = false;
//           }, function(rejection) {
//             console.log(rejection.data);
//           });
//     }, function() {
//
//     });
//   };
//
//   $scope.showEnableBot = function (ev) {
//     var confirm = $mdDialog.confirm()
//         .title('Are you sure you want to enable chatbot?')
//         .targetEvent(ev)
//         .ok('Enable!')
//         .cancel('Cancel');
//
//     $mdDialog.show(confirm).then(function() {
//       $http({
//         method: 'POST',
//         url: '/webhook/app/enableBot',
//         data: {
//           shopId : $scope.shopId
//         }
//       });
//       $scope.shop.isBotActive = !$scope.shop.isBotActive;
//       console.log($scope.shop.isBotActive)
//     }, function() {
//
//     });
//   };
//
//   $http.get("/shop?shop=" + $scope.shopId)
//       .then(function (response) {
//         $scope.shop = response.data;
//         console.log($scope.shop);
//       });
//   $http.get("/orders?shop=" + $scope.shopId)
//       .then(function (response) {
//         $scope.orders = response.data;
//         console.log($scope.orders);
//       });
//   $http.get("/messages?shop=" + $scope.shopId)
//       .then(function (response) {
//         $scope.messages = response.data;
//         console.log($scope.messages);
//       });
//   $http.get("/buyers?shop=" + $scope.shopId)
//       .then(function (response) {
//         $scope.buyers = response.data;
//         $scope.subscribeCount = response.data.filter(isSubscriber).length;
//         console.log($scope.buyers);
//         console.log($scope.subscribeCount);
//       });
// }

// function isSubscriber(buyer) {
//   return buyer.isSubscribe;
// }

// myApp.config(function ($routeProvider) {
//   $routeProvider.when('/settings', {
//     templateUrl: '/part/setting.html',
//     controller: AppCtrl
//   }).when('/', {
//     templateUrl: '/part/dashboard.html',
//     controller: AppCtrl
//   }).when('/messages', {
//     templateUrl: '/part/messages.html',
//     controller: AppCtrl
//   }).when('/broadcast', {
//     templateUrl: '/part/broadcast.html',
//     controller: AppCtrl
//   }).when('/faq', {
//     templateUrl: '/part/faq.html',
//     controller: AppCtrl
//   }).when('/support', {
//     templateUrl: '/part/support.html',
//     controller: AppCtrl
//   });
// });
