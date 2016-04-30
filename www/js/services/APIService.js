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
    getUserInfos: function(id) {
      callAjax('GET','https://apius.faceplusplus.com/v2/person/get_info?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&person_id=' + id,'userInfos');
    },
    createUser: function(familyName,firstName) {
      callAjax('POST','https://apius.faceplusplus.com/v2/person/create?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&person_name=' + familyName + '_' + firstName,'createUser');
    },
    updateUser: function(id,infos) {
      callAjax('POST','https://apius.faceplusplus.com/v2/person/set_info?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&person_id=' + id + '&tag=' + infos,'updateUser');
    },
    addUserFace: function(idPerson,idFace) {
      callAjax('POST','https://apius.faceplusplus.com/v2/person/add_face?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&person_id=' + idPerson + '&face_id=' + idFace ,'addUserFace');
    },
    addUserInGroup: function(idGroup,idPerson) {
      callAjax('POST','https://apius.faceplusplus.com/v2/group/add_person?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&group_id=' + idGroup + '&person_id=' + idPerson,'addUserInGroup');
    },
    deleteUserinGroup: function(idPerson,idGroup) {
      callAjax('GET','https://apius.faceplusplus.com/v2/group/remove_person?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&person_id=' + idPerson, + '&group_id='+ idGroup,'deleteUserInGroup');
    },
    recognizeUser: function(id,url) {
      callAjax('GET','https://apius.faceplusplus.com/v2/recognition/identify?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&group_id=' + id + '&url=' + url,'recognizeUser');
    },
    /////Face/////
    detectFace: function(url) {
      callAjax('GET','https://apius.faceplusplus.com/v2/detection/detect?api_secret=' + API_SECRET + '&api_key=' + API_KEY + '&url=' + url,'detectFace');
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
