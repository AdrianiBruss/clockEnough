angular.module('clockEnough')

// tab.event ( Tous les événements );
.controller('EventCtrl', function($scope, $rootScope, ionicMaterialInk, ionicMaterialMotion, $state, FaceAPI) {
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
		},0)
    });
})

// tab.event-check ( Detail d'un événement );
.controller('EventCheckCtrl', function($scope, $state, $stateParams, FaceAPI, $rootScope) {

	FaceAPI.getEventInfos($stateParams.eventId);
	$scope.$on('eventInfos', function(event,data){
		$scope.event = data;
	});
})

// tab.event-capture ( prise en photo de l'utilisateur )
.controller('EventCaptureCtrl', ['$scope', '$cordovaCamera', 'FaceAPI', '$rootScope', '$ionicPopup', '$state','$stateParams', '$ionicLoading', function($scope, $cordovaCamera,FaceAPI,$rootScope,$ionicPopup,$state, $stateParams, $ionicLoading){

    $scope.icon = true;
    $scope.group_id = $stateParams.eventId;
	$scope.page_param = $stateParams.check;

    $scope.capturePicture = function() {

        // options pour la capture photo
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 200,
            targetHeight: 200,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation:true
        };

        // preview de la photo quand la capture est effectuée
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.preview = document.getElementById('capturedImage');
            $scope.preview.src = imageData;
            $scope.icon = false;
            $scope.fileURI = imageData;
        }, function(err) {
            console.error(err)
        });
    };

    //upload de l'image
    $scope.sendPicture = function(){
        var options = new FileUploadOptions();
        var ft = new FileTransfer();
        var serveur ="http://clockenough.adrien-brussolo.com/";

        if(angular.isDefined($scope.fileURI))
        {

			$ionicLoading.show();

			options.fileKey = "uploaded_file";
            options.fileName = String($scope.fileURI).substr(String($scope.fileURI).lastIndexOf('/') + 1);
            options.mimeType = "image/jpg";

            ft.upload($scope.fileURI, encodeURI(serveur + "index.php"),
                function sucess(data){

                    $scope.imgUrl = serveur + data.response;

                    // train du group nécessaire avant l'identification du user
                    FaceAPI.trainEvent($scope.group_id);
                },
                function fail(error){
                    $scope.alertUser('Vérification de l\'utilisateur', 'Erreur lors de l\'upload de l\'image!');
                },
                options
            );
        }
        else
        {
            $scope.alertUser('Vérification de l\'utilisateur', 'Veuillez prendre une photo !');
        }
    };

    // reconnaissance faciale
    $scope.$on('trainEvent', function(event,data){
        FaceAPI.recognizeUser($scope.group_id, $scope.imgUrl);
    });

    //popup d'alerte résultat
    $scope.$on('recognizeUser', function(event,data){
		$scope.candidate = data.face[0].candidate[0];
		console.log($scope.candidate);

       if(angular.isDefined($scope.candidate) ){
		   console.log('--confidence', $scope.candidate.confidence)
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

	// FaceAPI.getUserInfos('6a6eb09dc05c64a29b668293efac74f1');
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
					'faceId' : $scope.candidate.face_id
					// 'faceId' : "7ef4d3ea38ad390613c482a6679d4144"
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
.controller('EventCheckStatusCtrl', ['FaceAPI', '$scope', '$state', '$stateParams', '$ionicLoading', function(FaceAPI, $scope, $state, $stateParams, $ionicLoading) {

	FaceAPI.getFace($stateParams.faceId);
	FaceAPI.getEventInfos($stateParams.eventId);

	( $stateParams.param == "status" ) ? $scope.userInfos = true : $scope.userInfos = false;

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
