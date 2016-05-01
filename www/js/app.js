// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('clockEnough', ['ionic', 'ngCordova','ionic-material'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.constant('API_KEY','1b24902b29237be03297804d43da768d')
.constant('API_SECRET','5zc8iBY4HNu5sSdOvBxYIEdtWE-Xafim')

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  // route en commun
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Liste des événements existants
  .state('tab.event', {
    url: '/event',
    views: {
      'tab-event': {
        templateUrl: 'templates/tab-event.html',
        controller: 'EventCtrl'
      }
    }
  })

  // Détail d'un événement
  .state('tab.event-check', {
    url: '/event/:eventId',
    views: {
      'tab-event': {
        templateUrl: 'templates/tab-event-check.html',
        controller: 'EventCheckCtrl'
      }
    }
  })

  // capture APN de l'utilisateur
  .state('tab.event-capture', {
    url: '/event/:eventId/capture/:check',
    views: {
      'tab-event': {
        templateUrl: 'templates/tab-event-capture.html',
        controller: 'EventCaptureCtrl'
        }
      }
    })

    // Attribution ou verification de l'utilisateur;
    .state('tab.event-check-status', {
      url: '/event/:eventId/check/:param/:personId',
      views: {
        'tab-event': {
          templateUrl: 'templates/tab-event-check-status.html',
          controller: 'EventCheckStatusCtrl'
        }
      }
    })

  .state('tab.organize', {
    url: '/organize',
    views: {
      'tab-organize': {
        templateUrl: 'templates/tab-organize.html',
        controller: 'OrganizeCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    cache: false,
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
    .state('tab.account-details', {
      url: '/account/:eventId',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account-details.html',
          controller: 'AccountDetailsCtrl'
        }
      }
    })
    .state('tab.signUp', {
      url: '/account/signUp',
      views: {
        'tab-account': {
          templateUrl: 'templates/signUp.html',
          controller: 'SignUpCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/account');

});
