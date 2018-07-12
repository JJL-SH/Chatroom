var app = angular.module('myApp', ['ngRoute']);
var socket = io();
var userID = Math.random() * Math.pow(10, 17) + Number(new Date()) + '';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/html/index.html',
    controller: 'chatroom'
  })
}])

app.controller('chatroom', function($scope, $sce) {
  $scope.isFirstEnter = true;
  $scope.name = '';
  $scope.message = '';
  $scope.messageList = [];
  $scope.sendName = function() {
    if (!$scope.name.trim()) {
      alert('请输入您的姓名！');
      return;
    }
    $scope.isFirstEnter = false;
  };
  $scope.sendMessage = function(event) {
    console.log(event);
    if (!$scope.message.trim()) {
      return;
    }
    socket.emit('sendMessage', {
      userID: userID,
      name: $scope.name,
      msg: $scope.message
    });
    $scope.message = '';
  };

  socket.on('sendMessageToClient', function(res){
    $scope.$apply(function(){
      res.imgUrl = 'data:image/png;base64,' + new Identicon(res.hash).toString();
      res.isMe = userID === res.userID ? true : false;
      $scope.messageList.push(res);
      setTimeout(function(){
        document.getElementById('list').scrollTo(0, 999999)
      })
    })
  })
})

