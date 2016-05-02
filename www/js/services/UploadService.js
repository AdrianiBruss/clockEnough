angular.module('clockEnough')

.factory('UploadService', ['$rootScope', '$ionicPopup', function ($rootScope, $ionicPopup) {

  return {

    // upload d'un fichier vers un serveur distant
    uploadImage: function(img){

      var options = new FileUploadOptions();
      var ft = new FileTransfer();
      var serveur ="http://clockenough.adrien-brussolo.com/";

      options.fileKey = "uploaded_file";
      options.fileName = String(img).substr(String(img).lastIndexOf('/') + 1);
      options.mimeType = "image/jpg";

      // upload de la photo sur le serveur via le plugin File Transfer
      ft.upload(img, encodeURI(serveur + "index.php"),
          function sucess(data){
              var imgUrl = serveur + data.response;
              $rootScope.$broadcast('uploadPicture', imgUrl);
          },
          function fail(error){
            $ionicPopup.alert({
                title: 'Plugin File Transfer',
                template: 'Erreur lors de l\'upload'
            });
          },
          options
      );
    }

  }

}]);
