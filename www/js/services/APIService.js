angular.module('clockEnough')

.factory('FaceAPI', ['$http','$rootScope', function ($http,$rootScope) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  // var chats = [{
  //   id: 0,
  //   name: 'Ben Sparrow',
  //   lastText: 'You on your way?',
  //   face: 'img/ben.png'
  // }, {
  //   id: 1,
  //   name: 'Max Lynx',
  //   lastText: 'Hey, it\'s me',
  //   face: 'img/max.png'
  // }, {
  //   id: 2,
  //   name: 'Adam Bradleyson',
  //   lastText: 'I should buy a boat',
  //   face: 'img/adam.jpg'
  // }, {
  //   id: 3,
  //   name: 'Perry Governor',
  //   lastText: 'Look at my mukluks!',
  //   face: 'img/perry.png'
  // }, {
  //   id: 4,
  //   name: 'Mike Harrington',
  //   lastText: 'This is wicked good ice cream.',
  //   face: 'img/mike.png'
  // }];

  return {
    //////Events//////
    getAllEvents: function() {
      callAjax('GET','https://apius.faceplusplus.com/v2/info/get_group_list?api_secret=5zc8iBY4HNu5sSdOvBxYIEdtWE-Xafim&api_key=1b24902b29237be03297804d43da768d','allEvents');
    },
    getEventInfos: function(id) {
      callAjax('GET','https://apius.faceplusplus.com/v2/group/get_info?api_secret=5zc8iBY4HNu5sSdOvBxYIEdtWE-Xafim&api_key=1b24902b29237be03297804d43da768d&group_id=' + id,'eventInfos');
    },
    createEvent: function(groupName,infos) {
      callAjax('POST','https://apius.faceplusplus.com/v2/group/create?api_secret=5zc8iBY4HNu5sSdOvBxYIEdtWE-Xafim&api_key=1b24902b29237be03297804d43da768d&group_name=' + groupName + '&tag=' + infos,'createEvent');
    },
    trainEvent: function(id) {
      callAjax('POST','https://apius.faceplusplus.com/v2/train/identify?api_secret=5zc8iBY4HNu5sSdOvBxYIEdtWE-Xafim&api_key=1b24902b29237be03297804d43da768d&group_id=' + id,'trainEvent');
    },
    //////Users//////
    getAllUsers: function() {
      callAjax('GET','https://apius.faceplusplus.com/v2/info/get_person_list?api_secret=5zc8iBY4HNu5sSdOvBxYIEdtWE-Xafim&api_key=1b24902b29237be03297804d43da768d','allUsers');
    },
    getUserInfos: function(id) {
      callAjax('GET','https://apius.faceplusplus.com/v2/person/get_info?api_secret=5zc8iBY4HNu5sSdOvBxYIEdtWE-Xafim&api_key=1b24902b29237be03297804d43da768d&person_id=' + id,'userInfos');
    },
    createUser: function(familyName,firstName) {
      callAjax('POST','https://apius.faceplusplus.com/v2/person/create?api_secret=5zc8iBY4HNu5sSdOvBxYIEdtWE-Xafim&api_key=1b24902b29237be03297804d43da768d&person_name=' + familyName + '_' + firstName,'createUser');
    },
    updateUser: function(id,infos) {
      callAjax('POST','https://apius.faceplusplus.com/v2/person/set_info?api_secret=5zc8iBY4HNu5sSdOvBxYIEdtWE-Xafim&api_key=1b24902b29237be03297804d43da768d&person_id=' + id + '&tag=' + infos,'updateUser');
    },
    addUserFace: function(idPerson,idFace) {
      callAjax('POST','https://apius.faceplusplus.com/v2/person/add_face?api_secret=5zc8iBY4HNu5sSdOvBxYIEdtWE-Xafim&api_key=1b24902b29237be03297804d43da768d&person_id=' + idPerson + '&face_id=' + idFace ,'addUserFace');
    },
    addUserInGroup: function(idGroup,idPerson) {
      callAjax('POST','https://apius.faceplusplus.com/v2/group/add_person?api_secret=5zc8iBY4HNu5sSdOvBxYIEdtWE-Xafim&api_key=1b24902b29237be03297804d43da768d&group_id=' + idGroup + '&person_id=' + idPerson,'addUserInGroup');
    },
    deleteUserinGroup: function(idPerson,idGroup) {
      callAjax('GET','https://apius.faceplusplus.com/v2/group/remove_person?api_secret=5zc8iBY4HNu5sSdOvBxYIEdtWE-Xafim&api_key=1b24902b29237be03297804d43da768d&person_id=' + idPerson, + '&group_id='+ idGroup,'deleteUserInGroup');
    },
    recognizeUser: function(id) {
      callAjax('GET','https://apius.faceplusplus.com/v2/recognition/identify?api_secret=5zc8iBY4HNu5sSdOvBxYIEdtWE-Xafim&api_key=1b24902b29237be03297804d43da768d&group_id=' + id,'recognizeUser');
    },
    /////Face/////
    detectFace: function(url) {
      callAjax('GET','https://apius.faceplusplus.com/v2/detection/detect?api_secret=5zc8iBY4HNu5sSdOvBxYIEdtWE-Xafim&api_key=1b24902b29237be03297804d43da768d&url=' + url,'detectFace');
    },
    // remove: function(chat) {
    //   chats.splice(chats.indexOf(chat), 1);
    // },
    // get: function(chatId) {
    //   for (var i = 0; i < chats.length; i++) {
    //     if (chats[i].id === parseInt(chatId)) {
    //       return chats[i];
    //     }
    //   }
    //   return null;
    // }
  };

  function callAjax(method,url,event){
    $http({
      method: method,
      url: url
    }).then(function successCallback(response) {
      $rootScope.$broadcast(event,response.data);
    }, function errorCallback(response) {
        return response;
    });
  }

}]);
