HiSumo.controller('SupportCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {
    var vm = this;

    vm.submitMessage = function () {
        var message = $('#supportMessage').val();
        var title = $('#supportTittle').val();

        if (message.length > 0) {
            $('#successModal')
                .fadeIn(300)
                .on("click", function () {
                    $(this).fadeOut(300);
                })
                .find('.modal-content').on("click", function (e) {
                e.stopPropagation();
            });
            var data = {
                shopName: $('#shopId').val(),
                title: title,
                body: message
            }
            $http.post("https://0e9990ad.ngrok.io/shop/sendEmail",data)
        }
    };

    vm.successModalClose = function () {
        $('#successModal').fadeOut(300);
    }
}]);
