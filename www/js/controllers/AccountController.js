angular.module('clockEnough')

.controller('AccountCtrl', ['$scope', 'ionicMaterialInk', 'ionicMaterialMotion', '$state', 'FaceAPI','$rootScope', function($scope, ionicMaterialInk, ionicMaterialMotion, $state, FaceAPI, $rootScope) {

    $scope.goTo = function ( path ) {
        $state.go(path);
    };

    // $scope.events = [
    //     {
    //         id: 0,
    //         name: 'Event 1',
    //         address: 'Avenue des champs Elysées',
    //         date: 'Sam. 32 Fev, 21:00',
    //     },{
    //         id: 1,
    //         name: 'Event 2',
    //         address: 'Limoge Susu',
    //         date: 'Sam. 32 Fev, 21:00',
    //     },{
    //         id: 2,
    //         name: 'Event 3',
    //         address: 'Boulbi 92 izi',
    //         date: 'Sam. 32 Fev, 21:00',
    //     }
    // ];
    
    FaceAPI.getAllEvents();

    $rootScope.$on('allEvents', function(event,data){
        $scope.events = data;
        console.log(data);
    });


    setTimeout(function(){
        // ionic materialize animations
        ionicMaterialMotion.fadeSlideInRight();
        ionicMaterialInk.displayEffect();
    },0)

}])

.controller('SignUpCtrl', ['$scope', '$cordovaCamera', 'FaceAPI', '$rootScope', function($scope, $cordovaCamera,FaceAPI,$rootScope){

    $scope.icon = true;

    $scope.account = {
        firstname : "",
        lastname : "",
        picture: ""
    };

    $scope.user_id = null;

    $scope.capturePicture = function() {
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
        $cordovaCamera.getPicture(options).then(function(imageData) {
            var image = document.getElementById('capturedImage');
            image.src = imageData;
            $scope.icon = false;
            $scope.fileURI = imageData;
        }, function(err) {
            console.error(err)
        });
    };

    $scope.saveAccount = function(){
        $scope.infos = $scope.account;
        var options = new FileUploadOptions();
        var ft = new FileTransfer();
        var serveur ="http://mailing.awakit-preprod.com/server/";

        options.fileKey = "uploaded_file";
        options.fileName = String($scope.fileURI).substr(String($scope.fileURI).lastIndexOf('/') + 1);
        options.mimeType = "image/jpg";

        ft.upload($scope.fileURI, encodeURI(serveur + "index.php"),
            function sucess(data){
                var imgUrl = serveur + data.response;
                FaceAPI.detectFace(imgUrl);
            }, 
            function fail(error){
                console.log("An error has occurred: Code = " + error.code);
                console.log("Error =" + error);
            }, 
            options
        );

        if($scope.infos.firstname!== '' && $scope.infos.lastname!== '')
        {
            // if( $scope.infos.firstname.indexOf('\'') != -1){
            //     $scope.infos.firstname.replace(/'/g,"-");
            // }

            // if( $scope.infos.lastname.indexOf('\'') != -1){
            //     $scope.infos.lastname.replace(/'/g,"-");
            // }
            // FaceAPI.createUser($scope.infos.firstname,$scope.infos.lastname);
        }
    }

    $scope.$on('createUser', function(event,data){
        // $scope.user_id = data.person_id;
        // FaceAPI.detectFace($scope.account.picture);
    });

    $scope.$on('detectFace', function(event,data){
        // FaceAPI.detectFace($scope.user_id,data.face_id);
    });
}])
