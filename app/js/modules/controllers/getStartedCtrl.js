HiSumo.controller('GetStartedCtrl', ['$scope', '$location', 'loginFactory', function ($scope, $location, loginFactory) {
    var vm = this;

    vm.firstLogin = loginFactory.firstLogin;
    console.log(vm.firstLogin);

    vm.closeSlider = function () {
        loginFactory.firstLogin = false;
        $location.path('/dashboard');
    };
}]);
