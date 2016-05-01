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
        var serveur ="http://mailing.awakit-preprod.com/Renault/";

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

       if(angular.isDefined($scope.candidate) ){
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
					'personId' : $scope.candidate.person_id
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
.controller('EventCheckStatusCtrl', function(FaceAPI, $scope, $state, $stateParams) {
	console.log('checkstatus');
	console.log($stateParams);

})
