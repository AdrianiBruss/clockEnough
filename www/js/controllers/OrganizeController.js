angular.module('clockEnough')

.controller('OrganizeCtrl', function($scope, $state, $rootScope, FaceAPI, $ionicLoading, $ionicPopup) {

	FaceAPI.getAllUsers();

	$rootScope.$on('allUsers', function(event,data){
		$scope.people = data.person;
    });

	$scope.error = false;

	$scope.peopleList = [];
	$scope.event = {
		name: "",
		date: "",
		hours: "",
		place: "",
		statusInput: "",
		status: [],
		people: []

	}

	// personnes ajoutées à l'événement
	$scope.managePeople = function(index){

		if ( !$scope.people[index].added ) {
			$scope.peopleList.push($scope.people[index].person_id);
			$scope.people[index].added = true;
		} else {
			var index = $scope.peopleList.indexOf($scope.people[index].person_id);
			if ( index > -1 ) {
				$scope.peopleList.splice(index, 1);
				$scope.people[index].added = false;
			}
		}

	}

	$scope.addStatus = function(){
		$scope.event.status.push($scope.event.statusInput);
		$scope.event.statusInput = "";
	}

	$scope.saveEvent = function(){

		$ionicLoading.show();

		//chaine de caractères contenant les infos de l'événement
		$scope.tag = $scope.event.date+' '+$scope.event.hours+' '+$scope.event.place+' status:'+$scope.event.status.join(':');

		//check des données
		if ( $scope.event.name != "" && $scope.peopleList.length > 0 ) {

			// Appel Api: creation de l'événement
			FaceAPI.createEvent($scope.event.name, $scope.tag);
		    $rootScope.$on('createEvent', function(result, data) {
			    console.log(result, data);
				// Appel Api: ajout des personnes à l'événement
				FaceAPI.addUserInGroup(data.group_id, $scope.peopleList.join())
		    });
			$rootScope.$on('addUserInGroup', function(result, data) {
				console.log(result, data);
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
				    title: 'Great !',
				    template: 'Your event has been registred with sucess'
			   });
			   alertPopup.then(function(res) {
			    	$state.go('tab.account');
			   });
			});

		}else {

			$ionicLoading.hide();

			var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: 'Please name the event, and add almost one person before saving'
		   });
			console.error('Error: Please name the event, and add almost one person before saving');
		}

	}

});
