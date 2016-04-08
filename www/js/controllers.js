angular.module('starter.controllers', [])

.controller('EventCtrl', function($scope) {})

.controller('OrganizeCtrl', function($scope, Chats) {

  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // $scope.chats = Chats.all();
  // $scope.remove = function(chat) {
  //   Chats.remove(chat);
  // };

})

// .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//   $scope.chat = Chats.get($stateParams.chatId);
// })

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

});
