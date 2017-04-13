HiSumo.controller('MainCtrl', ['$scope', '$location', '$http', 'loginFactory', function ($scope, $location, $http, loginFactory) {
    var vm = this;

    vm.firstLogin = loginFactory.firstLogin;

    // $http.get('https://0e9990ad.ngrok.io/shop?shop=' + $('#shopId').val()).then(function (res) {
    $http.get('data/shop.json').then(function (res) {

        if(res.data.firstVisit === false) {
            vm.firstLogin = loginFactory.firstLogin = false;
        }

        if(vm.firstLogin) {
            $location.path('/getStarted');
        } else {
            $location.path('/dashboard');
        }

    });
}]);
