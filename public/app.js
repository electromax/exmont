var app = angular.module('proview', []);

app.controller('MainCtrl', ['$http', '$scope', function($http, $scope) {
    $scope.markets = []

    var upd = function() {  
        $http.get('/updates')
        .then(function(response) {
            response.data.markets = response.data.markets.filter(function(x) { return x.sell_take < 30000; });
            $scope.data = response.data;
            setTimeout(upd, 1500);
        })
        .catch(function() {
            setTimeout(upd, 1500);
        });
    };

  $scope.round10 = function(value, exp) {
    if ((typeof value) == "string") return value;
    return value.toFixed(exp);
  };

  $scope.getClass = function(value) {
    if ((typeof value) == "string") return "";
    if (value == 0) return "";
    return value > 0 ? 'green' : 'red';
  };

  upd();
}]);
