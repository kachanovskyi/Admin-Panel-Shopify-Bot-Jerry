HiSumo.controller('LeftMenuCtrl', ['$scope', '$location', 'loginFactory', function ($scope, $location, loginFactory) {
    var vm = this;

    $('.left-menu > li').on('click', function () {

        $('.left-menu > li').removeClass('active');
        $(this).addClass('active');
        
    })

}]);
