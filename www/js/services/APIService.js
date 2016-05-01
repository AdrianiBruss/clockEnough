angular.module('clockEnough')

.factory('FaceAPI', ['$http','$rootScope','API_KEY','API_SECRET', '$ionicPopup', function ($http,$rootScope,API_KEY,API_SECRET,$ionicPopup) {

  return {
    //////Events//////
    getAllEvents: function() {
      callAjax('GET','https://apius.faceplusplus.com/v2/info/get_group_list?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '','allEvents');
    },
    getEventInfos: function(id) {
      callAjax('GET','https://apius.faceplusplus.com/v2/group/get_info?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&group_id=' + id,'eventInfos');
    },
    createEvent: function(groupName,infos) {
      callAjax('POST','https://apius.faceplusplus.com/v2/group/create?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&group_name=' + groupName + '&tag=' + infos,'createEvent');
    },
    trainEvent: function(id) {
      callAjax('POST','https://apius.faceplusplus.com/v2/train/identify?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&group_id=' + id,'trainEvent');
    },
    //////Users//////
    getAllUsers: function() {
      callAjax('GET','https://apius.faceplusplus.com/v2/info/get_person_list?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '','allUsers');
    },
    getUserInfos: function(idUser) {
      callAjax('GET','https://apius.faceplusplus.com/v2/person/get_info?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&person_id=' + idUser,'userInfos');
    },
    createUser: function(familyName,firstName) {
      callAjax('POST','https://apius.faceplusplus.com/v2/person/create?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&person_name=' + familyName + '_' + firstName,'createUser');
    },
    updateUser: function(idUser,infos) {
      callAjax('POST','https://apius.faceplusplus.com/v2/person/set_info?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&person_id=' + idUser + '&tag=' + infos,'updateUser');
    },
    addUserFace: function(idUser,idFace) {
      callAjax('POST','https://apius.faceplusplus.com/v2/person/add_face?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&person_id=' + idUser + '&face_id=' + idFace ,'addUserFace');
    },
    addUserInGroup: function(idGroup,idUSer) {
      callAjax('POST','https://apius.faceplusplus.com/v2/group/add_person?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&group_id=' + idGroup + '&person_id=' + idUSer,'addUserInGroup');
    },
    deleteUserinGroup: function(idUser,idGroup) {
      callAjax('GET','https://apius.faceplusplus.com/v2/group/remove_person?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&person_id=' + idUser, + '&group_id='+ idGroup,'deleteUserInGroup');
    },
    recognizeUser: function(idUser,url) {
      callAjax('GET','https://apius.faceplusplus.com/v2/recognition/identify?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&group_id=' + idUser + '&url=' + url,'recognizeUser');
    },
    /////Face/////
    detectFace: function(url) {
      callAjax('GET','https://apius.faceplusplus.com/v2/detection/detect?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&url=' + url,'detectFace');
    },
    getFace: function(idFace) {
      callAjax('GET','https://apius.faceplusplus.com/v2/detection/detect?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&face_id=' + idFace,'detectFace');
    }

  };

  function callAjax(method,url,event){
    $http({
      method: method,
      url: url
    }).then(function successCallback(response) {
      $rootScope.$broadcast(event, response.data);
    }, function errorCallback(error) {
        $ionicPopup.alert({
            title: 'API Face ++',
            template: 'Erreur de l\'API'
        });
    });
  }

}]);
