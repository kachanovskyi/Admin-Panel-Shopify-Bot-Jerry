HiSumo.controller('DashboardCtrl', ['$scope', '$location', '$http', 'loginFactory', 'creditsFactory', 'buyerMessages',
    function ($scope, $location, $http, loginFactory, creditsFactory, buyerMessages) {
        var vm = this;

        // $http.get('https://0e9990ad.ngrok.io/shop?shop=' + $('#shopId').val()).then(function (res) {
        $http.get('data/shop.json').then(function (res) {
            console.log(res.data);
            if (!loginFactory.firstLogin) {
                $('.left-menu').parent().removeClass('hidden');
                creditsFactory.amount = vm.credits = res.data.creditsCount;
                vm.total = res.data.messageCount;
                vm.perfect = res.data.perfectCount;
                vm.problem = res.data.spottedCount;
                vm.totalBuyers = res.data.buyerCount;
                vm.totalItems = vm.totalBuyers;
                if (vm.total > 0) {
                    $('.messages-container .amount-info .empty').addClass('hidden');
                    $('.messages-container .amount-info .amounts').removeClass('hidden');
                    $('.messages-container .amount-info .messages-block').removeClass('hidden');
                }
            }
        });

        vm.currentPage = 1;
        var sortField = "";

        var getBuyers = function () {
            // $http.get('https://0e9990ad.ngrok.io/buyers/dto?shop=' + $('#shopId').val() + sortField).then(function (res) {
            $http.get('data/buyers.json').then(function (res) {
                vm.totalItems = res.data.length;
            });
            // $http.get('https://0e9990ad.ngrok.io/buyers/dto?shop=' + $('#shopId').val() + '&page=' + (vm.currentPage - 1) + '&size=4'
            $http.get('data/buyers.json').then(function (res) {
                if (!loginFactory.firstLogin) {
                    vm.dialogs = [];
                    for (var x in res.data) {
                        var obj = {};
                        var dialog = res.data[x];
                        obj.buyer = dialog.firstName + " " + dialog.lastName;
                        obj.phone = dialog.phone;
                        obj.messages = dialog.messCount;
                        vm.dialogs.push(obj);
                    }
                }
            });
        };

        getBuyers();

        vm.setPage = function (pageNo) {
            vm.currentPage = pageNo;
        };

        vm.pageChanged = function () {
            getBuyers();
        };

        $('#SortDropdown').on("change", function () {
            console.log('sort by ' + $(this).val());
            sortField = '&sort=' + $(this).val();
            getBuyers();
            console.log(vm.totalItems);
        });

        vm.getPerfect = function () {
            vm.currentPage = 1;
            sortField = '&isPerfect=true';
            getBuyers();
            console.log(vm.totalItems);
        };

        vm.getSpotted = function () {
            sortField = '&isPerfect=false';
            vm.currentPage = 1;
            getBuyers();
            console.log(vm.totalItems);
        };

        vm.getAll = function () {
            sortField = '';
            vm.currentPage = 1;
            getBuyers();
            console.log(vm.totalItems);
        };

        $('.buyerDashbord > a').on('click', function () {
            $('.buyerDashbord > a').removeClass('active');
            $(this).addClass('active');

        });

        vm.goToMessage = function (id) {
            buyerMessages.name = vm.dialogs[id].buyer;
            buyerMessages.phone = vm.dialogs[id].phone;
            $location.path('/messages');
        }

    }]);
