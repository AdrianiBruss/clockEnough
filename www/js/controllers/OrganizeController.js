angular.module('clockEnough')

.controller('OrganizeCtrl', function($scope) {

	$scope.event = {
		name: "UCLA",
		date: "everyday",
		hours: "00:00",
		place: "LA, California, USA",
		statusInput: "",
		status: [],
		people: []

	}

	$scope.people = [
        {
            id: 0,
            name: 'Orelsan',
            lastname: 'Gringe',
        },{
            id: 1,
            name: 'Margot',
            lastname: 'Robbie',
        },{
            id: 2,
            name: 'Booba',
            lastname: 'B2O',
        },{
            id: 3,
            name: 'Christine',
            lastname: 'And the Queens',
        },{
            id: 4,
            name: 'Anderson',
            lastname: 'Paak',
        }
    ];

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
		console.log($scope.event);
	}

});
