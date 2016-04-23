angular.module('clockEnough')

.controller('OrganizeCtrl', function($scope, $rootScope, FaceAPI) {

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

		$scope.tag = $scope.event.date +'&'+$scope.event.hours +'&'+$scope.event.place;

		//check des données
		if ( $scope.event.name != "" ) {

			// Appel Api: creation de l'événement
			FaceAPI.createEvent($scope.event.name, $scope.tag);
		    $rootScope.$on('createEvent', function(result, data) {
			    console.log(result, data);
				// Appel Api: ajout des personnes à l'événement
				FaceAPI.addUserInGroup(data.group_id, $scope.peopleList.join())
		    });
			$rootScope.$on('addUserInGroup', function(result, data) {
				console.log(result, data);
			});

		}else {
			
			console.error('Error: Please name the event before saving');
			$scope.error = true;
			$scope.event.name = "Veuillez entrer un nom";
		}

	}

});
