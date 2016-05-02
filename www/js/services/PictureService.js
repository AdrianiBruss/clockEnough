angular.module('clockEnough')

.factory('PictureService', ['$cordovaCamera','$rootScope', function ($cordovaCamera, $rootScope) {

    return {

        getPicture: function(){

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
                $rootScope.$broadcast('getPicture', imageData);
            }, function(err) {
                console.error(err);
            });

        }
        
    }

}]);
