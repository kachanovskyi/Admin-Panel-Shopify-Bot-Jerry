HiSumo.controller('GetStartedCtrl', ['$scope', '$location', 'loginFactory', '$http', function ($scope, $location, loginFactory, $http) {
    var vm = this;

    vm.firstLogin = loginFactory.firstLogin;

    $('.view-div').addClass('center-no-float');

    vm.closeSlider = function () {
        loginFactory.firstLogin = false;
        // $http.get('https://0e9990ad.ngrok.io/shop?shop=' + $('#shopId').val()).then(function (res) {
        $http.get('data/shop.json').then(function (res) {
            var shop = res.data;
            var data = {
                name: $('#shopId').val(),
                isBotActive: shop.isBotActive,
                problemSpottedNotification: shop.problemSpottedNotification,
                creditsCount: shop.creditsCount,
                firstVisit: false,
                rechargeReminder: shop.rechargeReminder
            }
            // $http.put('https://0e9990ad.ngrok.io/shop', data).then(function (res) {
            //     console.log(res.data);
            //     $location.path('/dashboard');
            // });
            $location.path('/dashboard');
        });
    };
}]);
