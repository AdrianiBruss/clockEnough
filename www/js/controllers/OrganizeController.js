angular.module('clockEnough')

.controller('OrganizeCtrl',['$scope', '$state', 'FaceAPI', '$ionicLoading', '$ionicPopup', '$filter', function($scope, $state, FaceAPI, $ionicLoading, $ionicPopup, $filter){

	FaceAPI.getAllUsers();

	$scope.$on('allUsers', function(event,data){
		$scope.people = data.person;
    });

	$scope.error = false;

	$scope.peopleList = [];
	$scope.event = {
		name: '',
		date: new Date(),
		hours: new Date(),
		place: '',
		statusInput: '',
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

		var date = $filter('date')($scope.event.date, 'dd/MM/yyyy');
		var hour = $filter('date')($scope.event.hours, 'HH:mm:ss');

		//chaine de caractères contenant les infos de l'événement
		$scope.tag = date + '_' + hour + '_' + $scope.event.place + '_status:' + $scope.event.status.join(':');

		//check des données
		if ( $scope.event.name != '' && $scope.peopleList.length > 0 ) {

			// Appel Api: creation de l'événement
			FaceAPI.createEvent($scope.event.name, $scope.tag);
		    $scope.$on('createEvent', function(result, data) {
				// Appel Api: ajout des personnes à l'événement
				FaceAPI.addUserInGroup(data.group_id, $scope.peopleList.join())
		    });
			$scope.$on('addUserInGroup', function(result, data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
				    title: 'Nouvel événement',
				    template: 'Votre événement a bien été créé !'
			   });
			   alertPopup.then(function(res) {
			    	$state.go('tab.account');
			   });
			});

		}else {

			$ionicLoading.hide();

			var alertPopup = $ionicPopup.alert({
				title: 'Nouvel événement',
				template: 'Veuillez nommer et ajouter au moins une personne à votre événement'
		   	});
		}

	}

}]);
