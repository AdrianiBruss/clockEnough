angular.module('clockEnough')

.controller('AccountCtrl', ['$scope', 'ionicMaterialInk', 'ionicMaterialMotion', '$state', 'FaceAPI', function($scope, ionicMaterialInk, ionicMaterialMotion, $state, FaceAPI) {

    $scope.goTo = function ( path ) {
        $state.go(path);
    };
    
    FaceAPI.getUserInfos('4239c3ab8eb74d07eea27cfa7a77f806');
    
    // var user = JSON.parse(localStorage.getItem('User'));

    // if(user != null)
    // {
    //     $scope.user_id = user.person_id;
    //     FaceAPI.getUserInfos($scope.user_id);
    // }
    // else{
    //     console.log(user);
    // }
    // // FaceAPI.getUserInfos('6a6eb09dc05c64a29b668293efac74f1');

    $scope.$on('userInfos', function(event,data){
        $scope.events = data.group;
        setTimeout(function(){
            // ionic materialize animations
            ionicMaterialMotion.fadeSlideInRight();
            ionicMaterialInk.displayEffect();
        },100);
    });

}])

.controller('AccountDetailsCtrl', ['$scope','$stateParams', 'FaceAPI', '$filter', function($scope, $stateParams, FaceAPI, $filter) {
    
    FaceAPI.getEventInfos($stateParams.eventId);

    $scope.$on('eventInfos', function(event,data){
        var tag = data.tag.split('_');
        $scope.group = {
            'group_name' : data.group_name,
            'date'  : $filter('date')(tag[0], "dd/MM/yyyy"),
            'hours'  : $filter('date')(tag[1], "HH:mm:ss"),
            'place' : tag[2],
            'status' : tag[3],
            'person' : data.person
        };
    });

}])

.controller('SignUpCtrl', ['$scope', '$cordovaCamera', 'FaceAPI', '$rootScope', '$ionicPopup', '$state', function($scope, $cordovaCamera,FaceAPI,$rootScope,$ionicPopup,$state){

    $scope.icon = true;

    $scope.account = {
        firstname : "",
        lastname : "",
        picture: ""
    };

    $scope.user_id = null;

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

    $scope.saveAccount = function(){
        $scope.infos = $scope.account;
        var options = new FileUploadOptions();
        var ft = new FileTransfer();
        var serveur ="http://mailing.awakit-preprod.com/Renault/";

        if(angular.isDefined($scope.fileURI))
        {
            options.fileKey = "uploaded_file";
            options.fileName = String($scope.fileURI).substr(String($scope.fileURI).lastIndexOf('/') + 1);
            options.mimeType = "image/jpg";

            if($scope.infos.firstname!== '' && $scope.infos.lastname!== '')
            {
                $ionicPopup.confirm({
                    title: 'Création du compte',
                    template: 'Confirmez votre choix',
                    buttons: [
                     { text: 'Annuler' },
                     {
                      text: '<b>OK</b>',
                      type: 'button-positive',
                      onTap: function(e) 
                        {
                            // upload de la photo sur le serveur via le plugin File Transfer
                            // détection du visage via l'API grâce à l'URL de l'image retournée par le serveur
                            ft.upload($scope.fileURI, encodeURI(serveur + "index.php"),
                                function sucess(data){
                                    var imgUrl = serveur + data.response;
                                    FaceAPI.detectFace(imgUrl);   
                                }, 
                                function fail(error){
                                    $scope.alertUser('Création du compte', 'Erreur lors de l\'upload de l\'image!');
                                }, 
                                options
                            );
                        }
                     }
                    ]
                });
                
            }
            else
            {
                $scope.alertUser('Création du compte', 'Veuillez remplir tous les champs !');
            }
        }
        else
        {
            $scope.alertUser('Création du compte', 'Veuillez prendre une photo !');
        }
    };

    // création du user dans la base de données si un visage est détecté
    // remise à zéro du formulaire
    $scope.$on('detectFace', function(event,data){
        if(angular.isDefined(data.face[0])){
            $scope.user_face = data.face[0].face_id;
            FaceAPI.createUser($scope.infos.firstname,$scope.infos.lastname);
            //
            $scope.account = {
                firstname : "",
                lastname : "",
                picture: ""
            };
            $scope.preview.src = "";
        }
        else{
            $scope.alertUser('Création du compte', 'Aucun visage n\'a été détecté, essayez à nouveau !');           
        }
    });

    // récupération de l'ID du user s'il est créé
    // association du visage au user
    $scope.$on('createUser', function(event,data){
        $scope.user_id = data.person_id;
        localStorage.setItem('User',JSON.stringify(data));
        FaceAPI.addUserFace($scope.user_id, $scope.user_face);                
    });

    // confirmation de la souscription quand tout s'est bien passsé
    // retour à la page "account"
    $scope.$on('addUserFace', function(event,data){
        $scope.alertUser('Création du compte', 'Votre compte a bien été créé !');
        $state.go('tab.account', {}, {reload: true});                  
    });

    // notifications d'alerte
    $scope.alertUser = function(title,message){
        $ionicPopup.alert({
            title: title,
            template: message
        });
    };

}])
