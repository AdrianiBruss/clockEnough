angular.module('clockEnough')

.controller('EventCtrl', function($scope, $rootScope, ionicMaterialInk, ionicMaterialMotion, $state, FaceAPI) {
	$scope.goTo = function ( path ) {
		$state.go(path);
		// console.log(path)
	};

	FaceAPI.getAllEvents();
	$rootScope.$on('allEvents', function(event,data){
		$scope.events = data.group;
    });

	setTimeout(function(){
		// ionic materialize animations
		ionicMaterialMotion.fadeSlideInRight();
		ionicMaterialInk.displayEffect();
	},0)
})

.controller('EventCheckCtrl', function($scope, $state, $stateParams) {
	$scope.events = [
        {
            id: 1,
            name: 'Event 1',
            address: 'Avenue des champs Elysées',
            date: 'Sam. 32 Fev, 21:00',
        },{
            id: 2,
            name: 'Event 2',
            address: 'Limoge Susu',
            date: 'Sam. 32 Fev, 21:00',
        },{
            id: 4,
            name: 'Event 3',
            address: 'Boulbi 92 izi',
            date: 'Sam. 32 Fev, 21:00',
        }];

	$scope.eventId = $stateParams.eventId;

	$scope.event = $scope.events[$scope.eventId - 1];
})

.controller('EventCaptureCtrl', function($scope, $state, $stateParams) {
	console.log('capture');
})
