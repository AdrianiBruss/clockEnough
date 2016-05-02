angular.module('clockEnough')

.factory('PictureService', ['$cordovaCamera','$rootScope', '$ionicPopup', function ($cordovaCamera, $rootScope, $ionicPopup) {

    return {

        // accès à l'APN du smartphone
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

            // broadcast de l'url de la photp dès qu'elle est capturée
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $rootScope.$broadcast('getPicture', imageData);
            }, function(err) {
                $ionicPopup.alert({
                    title: 'Plugin Cordova Camera',
                    template: 'Erreur lors de la capture'
                });
            });

        }
        
    }

}]);
