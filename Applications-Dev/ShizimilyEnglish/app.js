angular.module('myApp', []).
  controller('YouTubeCtrl', function($scope, $sce) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl('https://www.bing.com/images/search?q=' + src);
    }
  });