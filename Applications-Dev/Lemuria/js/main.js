/*global window, angular*/

(function () {
    var app = angular.module("app", []);

    app.service('getLemuria', ['$http', function ($http) {
        this.get_repos = function (num, callback) {
            $http({
                url: 'http://lm-s4.ujj.co.jp/web/image2/merc/' + num + '/card.png',
                method: 'GET',
                headers: {
                    'Referer': 'http://lm-s4.ujj.co.jp/web/mercenary.php'
                }
            }).success(function (data, status, headers, config) {
                window.getElementById("aaa").src = "data:image/jpeg;base64," + window.btoa(data);
            }).error(function (data, status, headers, config) {
            });
        };
    }]);
    app.controller("MyController", function ($scope, getLemuria) {
        $scope.buttonText = "aaa";
        $scope.apply = function () {
            getLemuria.get_repos(10, null);
        };
    });

}());