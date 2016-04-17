angular.module('clockEnough')

.controller('OrganizeCtrl', function($scope, $rootScope, FaceAPI) {

	FaceAPI.getAllUsers();

	$rootScope.$on('allUsers', function(event,data){
		$scope.people = data.person;
    });

	$scope.event = {
		name: "",
		date: "",
		hours: "",
		place: "",
		statusInput: "",
		status: [],
		people: []

	}

	$scope.addPeople = function(index){
		$scope.event.people.push($scope.people[index]);
		$scope.people[index].added = true;
	}

	$scope.addStatus = function(){
		$scope.event.status.push($scope.event.statusInput);
		$scope.event.statusInput = "";
	}

	$scope.saveEvent = function(){
		console.log('event saved');
		$scope.tag = $scope.event.date +'&'+$scope.event.hours +'&'+$scope.event.place;

		// personnes ajoutées à l'événement
		$scope.peopleList = [];
		$scope.event.people.forEach(function(item, index){
			$scope.peopleList.push(item.person_id);
		})

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

	}

});
