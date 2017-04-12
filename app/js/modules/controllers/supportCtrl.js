HiSumo.controller('SupportCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {
    var vm = this;

    vm.submitMessage = function () {
        var message = $('#supportMessage').val();

        if(message.length > 0) {
            $('#successModal')
                .fadeIn(300)
                .on("click", function () {
                    $(this).fadeOut(300);
                })
                .find('.modal-content').on("click", function (e) {
                e.stopPropagation();
            });
            // $http.post...        finish this
        }
    };

    vm.successModalClose = function () {
        $('#successModal').fadeOut(300);
    }
}]);
