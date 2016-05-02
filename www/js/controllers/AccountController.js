angular.module('clockEnough')

.controller('AccountCtrl', [
    '$scope',
    'ionicMaterialInk',
    'ionicMaterialMotion',
    '$state',
    'FaceAPI',
    '$ionicLoading',
    function($scope, ionicMaterialInk, ionicMaterialMotion, $state, FaceAPI, $ionicLoading) {

    $ionicLoading.show();

    $scope.goTo = function ( path ) {
        $state.go(path);
    };

    // Check de la présence ou non du user dans le localStorage
    // S'il existe, on affiche les events auxquels il est invité.

    var user = JSON.parse(localStorage.getItem('User'));

    if(user != null)
    {
        $scope.user_id = user.person_id;
        FaceAPI.getUserInfos($scope.user_id);
    }else {
        $ionicLoading.hide();
    }


    $scope.$on('userInfos', function(event,data){
        $scope.events = data.group;
        setTimeout(function(){
            // ionic materialize animations
            ionicMaterialMotion.fadeSlideInRight();
            ionicMaterialInk.displayEffect();
            $ionicLoading.hide();
        },100);
    });

}])

.controller('AccountDetailsCtrl', [
    '$scope',
    '$stateParams',
    'FaceAPI',
    '$filter',
    function($scope, $stateParams, FaceAPI, $filter) {

    // Récupération de l'événement choisi et binding de ses informations.

    FaceAPI.getEventInfos($stateParams.eventId);

    $scope.$on('eventInfos', function(event,data){
        var tag = data.tag.split('_');
        $scope.group = {
            'group_name' : data.group_name,
            'date'  : tag[0],
            'hour'  : tag[1],
            'place' : tag[2],
            'status' : tag[3].replace('status:','').replace(/:/gi,', '),
            'person' : data.person
        };
    });

}])

.controller('SignUpCtrl', [
    '$scope',
    '$cordovaCamera',
    'FaceAPI',
    'PictureService',
    'UploadService',
    '$rootScope',
    '$ionicPopup',
    '$state',
    '$ionicLoading',
    function($scope, $cordovaCamera, FaceAPI, PictureService, UploadService, $rootScope, $ionicPopup, $state, $ionicLoading){

    $scope.icon = true;

    $scope.account = {
        firstname : "",
        lastname : "",
        picture: ""
    };

    $scope.user_id = null;

    $scope.capturePicture = function() {
        PictureService.getPicture();
    };

    // création du compte user
    // vérification du formulaire + système d'alerte
    $scope.saveAccount = function(){

        $ionicLoading.show();

        if(angular.isDefined($scope.fileURI))
        {

            if($scope.account.firstname !== '' && $scope.account.lastname !== '')
            {
                $ionicLoading.hide();
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
                            UploadService.uploadImage($scope.fileURI);
							$ionicLoading.show();
                        }
                     }
                    ]
                });

            }
            else
            {
                $ionicLoading.hide();
                $scope.alertUser('Création du compte', 'Veuillez remplir tous les champs !');
            }
        }
        else
        {
            $ionicLoading.hide();
            $scope.alertUser('Création du compte', 'Veuillez prendre une photo !');
        }
    };

    // preview de l'image prise avec l'APN 
    $scope.$on('getPicture', function(event,data){
        $scope.preview =  document.getElementById('capturedImage');
        $scope.preview.src = data;
        $scope.icon = false;
        $scope.fileURI = data;
    });

    // détection d'un visage sur la photo uploadée sur le serveur
    $scope.$on('uploadPicture', function(event,imgUrl){
        FaceAPI.detectFace(imgUrl);    
    });

    // création du user dans la base de données si un visage est détecté
    // remise à zéro du formulaire
    $scope.$on('detectFace', function(event,data){
        if(angular.isDefined(data.face[0])){
            $scope.user_face = data.face[0].face_id;
            FaceAPI.createUser($scope.account.firstname,$scope.account.lastname);
            //
            $scope.account = {
                firstname : "",
                lastname : "",
                picture: ""
            };
            $scope.preview.src = "";
        }
        else{

            $ionicLoading.hide();
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
        $ionicLoading.hide();
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
