angular.module('clockEnough')

.controller('AccountCtrl', function($scope, ionicMaterialInk, ionicMaterialMotion, $cordovaCamera, $state) {

    $scope.goTo = function ( path ) {
        $state.go(path);
    };

    $scope.events = [
        {
            id: 0,
            name: 'Event 1',
            address: 'Avenue des champs Elysées',
            date: 'Sam. 32 Fev, 21:00',
        },{
            id: 1,
            name: 'Event 2',
            address: 'Limoge Susu',
            date: 'Sam. 32 Fev, 21:00',
        },{
            id: 2,
            name: 'Event 3',
            address: 'Boulbi 92 izi',
            date: 'Sam. 32 Fev, 21:00',
        }
    ];

    setTimeout(function(){
        // ionic materialize animations
        ionicMaterialMotion.fadeSlideInRight();
        ionicMaterialInk.displayEffect();
    },0)

})

.controller('SignUpCtrl', function(){
    $scope.capturePicture = function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation:true
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            var image = document.getElementById('capturedImage');
            image.src = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            console.error(err)
        });
    }
})
