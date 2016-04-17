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
        $scope.events = data.group;
        console.log(data);

        setTimeout(function(){
            // ionic materialize animations
            ionicMaterialMotion.fadeSlideInRight();
            ionicMaterialInk.displayEffect();
        },0)

    });

}])

.controller('SignUpCtrl', ['$scope', '$cordovaCamera', function($scope, $cordovaCamera){

    $scope.icon = true;
    $scope.account = {
        firstname : "",
        lastname : "",
        picture: ""
    }
    $scope.capturePicture = function() {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
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
            var path = "data:image/jpeg;base64," + imageData
            image.src = path;
            $scope.icon = false;
            $scope.account.picture = path;
        }, function(err) {
            console.error(err)
        });
    };

    $scope.saveAccount = function(){
        $scope.infos = $scope.account;
    }
}])
