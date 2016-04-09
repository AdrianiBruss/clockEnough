angular.module('clockEnough')

.controller('OrganizeCtrl', function($scope) {
	console.log('UCLA');

	$scope.event = {
		name: "UCLA",
		date: "everyday",
		hours: "00:00",
		place: "LA, California, USA",
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

});
