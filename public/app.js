var app = angular.module('proview', []);

app.controller('MainCtrl', ['$http', '$scope', function($http, $scope) {
    $scope.markets = []

    var upd = function() {
        $http.get('/updates')
            .then(function(response) {
                $scope.data = response.data;
                var buy_market = response.data.markets[0];
                var sell_market = response.data.markets[0];
                for (var i = 1; i < response.data.markets.length; i++) {
                    if (response.data.markets[i].buy_take < buy_market.buy_take)
                        buy_market = response.data.markets[i];
                    if (response.data.markets[i].sell_take > sell_market.sell_take)
                        sell_market = response.data.markets[i];
                }
                $scope.data.buy_market = buy_market;
                $scope.data.sell_market = sell_market;
                $scope.data.margin = 0;
                if (buy_market.buy_take < sell_market.sell_take)
                    $scope.data.margin = sell_market.sell_take - buy_market.buy_take;
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