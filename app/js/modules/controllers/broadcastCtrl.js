HiSumo.controller('BroadcastCtrl', ['$scope', '$location', '$http', 'creditsFactory', function ($scope, $location, $http, creditsFactory) {
    var vm = this;
    vm.text = "";
    vm.credits = creditsFactory.amount;
    vm.subscribers = [];

    // $http.get('https://0e9990ad.ngrok.io/buyers/dto?shop=' + $('#shopId').val() +
    //     '&page=' + vm.buyerPage + '&size=8').then(function (res) {
    //
    //     vm.subscribersAmount = res.data.length;
    //
    //     for (var x in res.data) {
    //
    //         var subscriber = res.data[x];
    //         var obj = {};
    //
    //         obj.id = subscriber.shopifyId;
    //         obj.name = subscriber.firstName + " " + subscriber.lastName;
    //         obj.number = subscriber.phone;
    //         obj.email = subscriber.email;
    //         vm.subscribers.push(obj);
    //     }
    // });

    vm.deleteUser = function () {
        var index = findIndexById(vm.deleteId, vm.subscribers);
        console.log(vm.deleteId);
        console.log(index);
        vm.subscribers.splice(index, 1);
        // $http.delete("https://0e9990ad.ngrok.io/buyers/buyer/" + +vm.deleteId).then(function (res) {
        //     console.log("unsubscribed " + vm.deleteId);
        // });
        vm.totalItems--;
        vm.confirmModalClose();
    };

    var findIndexById = function (id, subscribers) {
        for (var i = 0; i <= subscribers.length; i++) {
            if (subscribers.id === id) {
                return i;
            }
        }
    };

    vm.confirmModalOpen = function (id) {
        vm.deleteId = id;
        $('#deleteSubscriberModal')
            .fadeIn(300)
            .on("click", function () {
                $(this).fadeOut(300);
            })
            .find('.modal-content').on("click", function (e) {
            e.stopPropagation();
        });
    };
    vm.confirmModalClose = function () {
        $('#deleteSubscriberModal').fadeOut(300);
        vm.deleteId = -1;
    };

    vm.currentPage = 1;

    var getBuyers = function () {
        // $http.get('https://0e9990ad.ngrok.io/buyers/subscribers?shop=' + $('#shopId').val()).then(function (res) {
        $http.get('data/subscribers.json').then(function (res) {
            vm.totalItems = res.data.length;
            console.log(vm.totalItems);
        });
        // $http.get('https://0e9990ad.ngrok.io/buyers/subscribers?shop=' + $('#shopId').val() + '&page=' + (vm.currentPage - 1) + '&size=8').then(function (res) {
        $http.get('data/subscribers.json').then(function (res) {
            vm.subscribers = [];
            for (var x in res.data) {

                var subscriber = res.data[x];
                var obj = {};
                obj.id = subscriber.shopifyId;
                obj.name = subscriber.firstName + " " + subscriber.lastName;
                obj.number = subscriber.phone;
                obj.email = subscriber.email;
                vm.subscribers.push(obj);


            }
            console.log(vm.subscribers);
        });
    };

    getBuyers();

    vm.setPage = function (pageNo) {
        vm.currentPage = pageNo;
    };

    vm.pageChanged = function () {
        getBuyers();
    };

    vm.confirmModalOpen = function () {
        $('#confirmModal')
            .fadeIn(300)
            .on("click", function () {
                $(this).fadeOut(300);
            })
            .find('.modal-content').on("click", function (e) {
            e.stopPropagation();
        });
    };
    vm.confirmModalClose = function () {
        $('#confirmModal').fadeOut(300);
    };

    vm.sendToSubscribers = function () {
        console.log("sent");
        // $http.get('https://0e9990ad.ngrok.io/shop/send-to-subscribed?shop=' + $('#shopId').val() + '&text=' + vm.text).then(function (res) {
        $http.get('data/subscribers.json').then(function (res) {
            console.log(res.data);
            vm.confirmModalClose();
            $('.new-message').val('');
        });

    }

}]);
