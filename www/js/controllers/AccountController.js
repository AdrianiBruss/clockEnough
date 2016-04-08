angular.module('starter')

.controller('AccountCtrl', function($scope, ionicMaterialInk, ionicMaterialMotion, $cordovaCamera) {

	// ionic materialize animations
    ionicMaterialMotion.fadeSlideInRight();
    ionicMaterialInk.displayEffect();

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
