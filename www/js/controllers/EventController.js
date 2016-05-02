angular.module('clockEnough')

// tab.event ( Tous les événements );
.controller('EventCtrl', [
	'$scope',
	'$rootScope',
	'ionicMaterialInk',
	'ionicMaterialMotion',
	'$state',
	'FaceAPI',
	'$ionicLoading',
	function($scope, $rootScope, ionicMaterialInk, ionicMaterialMotion, $state, FaceAPI, $ionicLoading) {

	$ionicLoading.show();
	$scope.goTo = function ( path ) {
		$state.go(path);
	};

	FaceAPI.getAllEvents();
	$scope.$on('allEvents', function(event,data){
		$scope.events = data.group;

		setTimeout(function(){
			// ionic materialize animations
			ionicMaterialMotion.fadeSlideInRight();
			ionicMaterialInk.displayEffect();
			$ionicLoading.hide();
		},0)
    });
}])

// tab.event-check ( Detail d'un événement );
.controller('EventCheckCtrl', [
	'$scope',
	'$state',
	'$stateParams',
	'FaceAPI',
	'$rootScope',
	function($scope, $state, $stateParams, FaceAPI, $rootScope) {

	FaceAPI.getEventInfos($stateParams.eventId);
	$scope.$on('eventInfos', function(event,data){
		$scope.event = data;
	});
}])

// tab.event-capture ( prise en photo de l'utilisateur )
.controller('EventCaptureCtrl', [
	'$scope',
	'$cordovaCamera',
	'FaceAPI',
    'PictureService',
    'UploadService',
	'$rootScope',
	'$ionicPopup',
	'$state',
	'$stateParams',
	'$ionicLoading',
	function($scope,$cordovaCamera,FaceAPI,PictureService,UploadService,$rootScope,$ionicPopup,$state, $stateParams, $ionicLoading){

    $scope.icon = true;
    $scope.group_id = $stateParams.eventId;
	$scope.page_param = $stateParams.check;

    $scope.capturePicture = function() {
        PictureService.getPicture();
    };

    //upload de l'image
    $scope.sendPicture = function(){


        if(angular.isDefined($scope.fileURI))
        {
            UploadService.uploadImage($scope.fileURI);
        }
        else
        {
            $scope.alertUser('Vérification de l\'utilisateur', 'Veuillez prendre une photo !');
        }
    };

    // reconnaissance faciale
    $scope.$on('getPicture', function(event,data){
        $scope.preview =  document.getElementById('capturedImage');
        $scope.preview.src = data;
        $scope.icon = false;
        $scope.fileURI = data;
    });

    $scope.$on('uploadPicture', function(event,data){
        $scope.imgUrl = data;
        // train du group nécessaire avant l'identification du user
        FaceAPI.trainEvent($scope.group_id);
    });

    // reconnaissance faciale
    $scope.$on('trainEvent', function(event,data){
        FaceAPI.recognizeUser($scope.group_id, $scope.imgUrl);
    });

    //popup d'alerte résultat
    $scope.$on('recognizeUser', function(event,data){
		$scope.face = data.face[0];
		$scope.candidate = $scope.face.candidate[0];

       if(angular.isDefined($scope.face) ){
		   if ( $scope.candidate.confidence > 35 ) {
    		   FaceAPI.getUserInfos($scope.candidate.person_id);
		   }else {
			   $ionicLoading.hide();
			   $scope.alertUser('Vérification de l\'utilisateur', 'Désolé, vous ne faites pas partie de l\' événement ! Au revoir');
		   }
        }
        else{
			$ionicLoading.hide();
            $scope.alertUser('Vérification de l\'utilisateur', 'Nous ne parvenons pas à vous reconnaître !');
        }
    });

	// FaceAPI.getUserInfos('59454b2703b2359f18e00927d23f5f25');
	// verification de l'appartenance de l'utilisateur au groupe en question
	$scope.$on('userInfos', function(event, data){
		$ionicLoading.hide();
		$scope.belongsTo = data.group.filter(function(group){
			return group.group_id == $scope.group_id;
		})
		// l'utilisateur appartient bien au groupe
		if ( $scope.belongsTo != [] ){

			$state.go('tab.event-check-status', {
					'eventId': $scope.group_id,
					'param': $scope.page_param,
					'faceId' : data.face[0].face_id
					// 'faceId' : "1249cfb4b412704f350cc0f7fa85afd4"
				}
			)
		} else {
			$scope.alertUser('Vérification de l\'utilisateur', 'Bonjour ' + $scope.candidate.person_name + ', vous ne faites pas partie de la soirée ! Au revoir');
		}
	})
    // notifications d'alerte
    $scope.alertUser = function(title,message){
        $ionicPopup.alert({
            title: title,
            template: message
        });
    };

}])

// tab.event-check-status ( possibilité d'attribuer ou verifier un status )
.controller('EventCheckStatusCtrl', [
	'FaceAPI',
	'$scope',
	'$state',
	'$stateParams',
	'$ionicLoading',
	function(FaceAPI, $scope, $state, $stateParams, $ionicLoading) {

	FaceAPI.getFace($stateParams.faceId);
	FaceAPI.getEventInfos($stateParams.eventId);

	if ( $stateParams.param == "status" ) {
		$scope.userInfos = true;
	} else {
		$scope.userInfos = false;
	}

	$scope.$on('getFace', function(event, data){
		$scope.name = data.face_info[0].person[0].person_name.replace('_',' ');
		$scope.person_id = data.face_info[0].person[0].person_id;
		$scope.tags = data.face_info[0].person[0].tag.replace('status:','');
		$scope.img = data.face_info[0].url;

	})

	// status de l'événement
	$scope.$on('eventInfos', function(event, data){
		var tag = data.tag.split('_');
        $scope.event = {
            'group_name' : data.group_name,
            'status' : tag[3].replace('status:','').replace(/:/gi,', '),
        };
		$scope.event.status = $scope.event.status.split(', ');
	})

	$scope.addStatus = function(status){

		$ionicLoading.show();

		$scope.status = 'status:'+status;
		FaceAPI.updateUser($scope.person_id, $scope.status);

	};

	$scope.$on('updateUser', function(event, data){
		$ionicLoading.hide();
		$state.go('tab.event-check', {'eventId': $stateParams.eventId})
	})

}])
