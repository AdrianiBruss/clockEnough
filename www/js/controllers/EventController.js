angular.module('clockEnough')

.controller('EventCtrl', function($scope, $rootScope, ionicMaterialInk, ionicMaterialMotion, $state, FaceAPI) {
	$scope.goTo = function ( path ) {
		$state.go(path);
		// console.log(path)
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

.controller('EventCheckCtrl', function($scope, $state, $stateParams, FaceAPI) {

	FaceAPI.getEventInfos($stateParams.eventId);

    $scope.$on('eventInfos', function(event,data){
        $scope.event = data;
    });
})

.controller('EventCaptureCtrl', ['$scope', '$cordovaCamera', 'FaceAPI', '$rootScope', '$ionicPopup', '$state','$stateParams', function($scope, $cordovaCamera,FaceAPI,$rootScope,$ionicPopup,$state, $stateParams){

    $scope.icon = true;

    $scope.group_id = $stateParams.eventId;

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
        FaceAPI.recognizeUser($scope.group_id,$scope.imgUrl);   
    });

    //popup d'alerte résultat
    $scope.$on('recognizeUser', function(event,data){
       if(angular.isDefined(data.face[0])){
            var candidate_name = data.face[0].candidate[0].person_name
            $scope.alertUser('Vérification de l\'utilisateur', 'Bonjour ' + candidate_name + '!');           
        }
        else{
            $scope.alertUser('Vérification de l\'utilisateur', 'Nous ne parvenons pas à vous reconnaître !');           
        }
    });

    // notifications d'alerte
    $scope.alertUser = function(title,message){
        $ionicPopup.alert({
            title: title,
            template: message
        });
    };

}])
