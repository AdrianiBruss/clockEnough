angular.module('clockEnough')

.factory('UploadService', ['$rootScope', function ($rootScope) {

  return {

    uploadImage: function(img){

      var options = new FileUploadOptions();
      var ft = new FileTransfer();
      var serveur ="http://clockenough.adrien-brussolo.com/";

      options.fileKey = "uploaded_file";
      options.fileName = String(img).substr(String(img).lastIndexOf('/') + 1);
      options.mimeType = "image/jpg";

      // upload de la photo sur le serveur via le plugin File Transfer
      // détection du visage via l'API grâce à l'URL de l'image retournée par le serveur
      ft.upload(img, encodeURI(serveur + "index.php"),
          function sucess(data){
              var imgUrl = serveur + data.response;
              $rootScope.$broadcast('uploadPicture', imgUrl);
          },
          function fail(error){
              $scope.alertUser('Vérification de l\'utilisateur', 'Erreur lors de l\'upload de l\'image!');
          },
          options
      );
    }

  }

}]);
