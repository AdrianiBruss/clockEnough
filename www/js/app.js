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

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

  // Each tab has its own nav history stack:

  .state('tab.event', {
    url: '/event',
    views: {
      'tab-event': {
        templateUrl: 'templates/tab-event.html',
        controller: 'EventCtrl'
      }
    }
  })
  .state('tab.event-check', {
    url: '/event/:eventId',
    views: {
      'tab-event': {
        templateUrl: 'templates/tab-event-check.html',
        controller: 'EventCheckCtrl'
      }
    }
  })
  .state('tab.event-capture', {
    url: '/event/:eventId/capture',
    views: {
      'tab-event': {
        templateUrl: 'templates/tab-event-capture.html',
        controller: 'EventCaptureCtrl'
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
    // .state('tab.chat-detail', {
    //   url: '/chats/:chatId',
    //   views: {
    //     'tab-chats': {
    //       templateUrl: 'templates/chat-detail.html',
    //       controller: 'ChatDetailCtrl'
    //     }
    //   }
    // })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
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
