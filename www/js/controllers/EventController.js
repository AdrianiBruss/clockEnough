angular.module('clockEnough')

.controller('EventCtrl', function($scope, $rootScope, ionicMaterialInk, ionicMaterialMotion, $state, FaceAPI) {
	$scope.goTo = function ( path ) {
		$state.go(path);
	};

	FaceAPI.getAllEvents();
	$rootScope.$on('allEvents', function(event,data){
		$scope.events = data.group;

		setTimeout(function(){
			// ionic materialize animations
			ionicMaterialMotion.fadeSlideInRight();
			ionicMaterialInk.displayEffect();
		},0)
    });
})

.controller('EventCheckCtrl', function($scope, $state, $stateParams, FaceAPI, $rootScope) {

	$scope.eventId = $stateParams.eventId;
	console.log($scope.eventId);
    FaceAPI.getEventInfos($scope.eventId);

	$rootScope.$on('eventInfos', function(event,data){
        $scope.group = data;
		console.log($scope.group);
    });
})

.controller('EventCaptureCtrl', function($scope, $state, $stateParams) {
	console.log('capture');
	console.log($stateParams);
	$scope.group_id = $stateParams.eventId;
	$scope.page_param = $stateParams.check;
})

.controller('EventCheckStatusCtrl', function($scope, $state, $stateParams) {
	console.log('checkstatus');
	console.log($stateParams);
	// $scope.group_id = $stateParams.eventId;
	// $scope.page_param = $stateParams.check;
})
