HiSumo.controller('MessagesCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {
    var vm = this;

    vm.dialogs = [];

    var startIndex = 0;
    var conversation = $(".conversation");
    var input = $("#messageInput");


    function chatScrollBottom() {
        conversation.animate({scrollTop: conversation.prop("scrollHeight")}, 0);
    }

    vm.buyerPage = 0;
    vm.hasNextBuyer = true;

    vm.loadBuyers = function () {
        getBuyer();
    };

    var getBuyer = function () {
        $http.get('https://0e9990ad.ngrok.io/buyers/dto?shop=' + $('#shopId').val() +
            '&page=' + vm.buyerPage + '&size=10').then(function (res) {
            for (var x in res.data) {
                var obj = {};
                var dialog = res.data[x];
                obj.dialogId = dialog.shopifyId;
                obj.buyer = dialog.firstName + " " + dialog.lastName;
                obj.phone = dialog.phone;
                obj.messages = dialog.messCount;
                obj.perfect = dialog.perfect;
                obj.date = dialog.date;
                obj.initials = dialog.firstName[0] + dialog.lastName[0];
                obj.transaction = "Problem spotted";
                if (obj.perfect) {
                    obj.transaction = "Perfect transaction";
                }
                vm.dialogs.push(obj);
            }
            vm.buyerPage += 1;
            if (res.data.length < 10) {
                vm.hasNextBuyer = false;
            }
            vm.openDialog(startIndex, vm.dialogs[startIndex].dialogId);
        });
    }

    vm.userMessage = function () {
        var text = input.val().trim();

        if (text.length && text !== "") {

            input.val('');
            vm.send(text, 'bot');

            $http.get('https://0e9990ad.ngrok.io/send?shopId=' + vm.shopName +
                '&to=' + vm.titlePhone + '&text=' + text).then(function (res) {

            });

        } else {
            $("#messageInput").val('').focus();
        }
    };

    vm.send = function (text, type) {
        var message = $('<div class="chat-message">').addClass(type);

        $('<div class="message-outer">')
            .addClass(type)
            .append(message.text(text))
            .prependTo(
                $('.conversation')
            );

        chatScrollBottom();
    }

    vm.addToEnd = function (text, type) {
        var message = $('<div class="chat-message">').addClass(type);

        $('<div class="message-outer">')
            .addClass(type)
            .append(message.text(text))
            .appendTo(
                $('.conversation')
            );
    }


    vm.inputEnter = function (keyEvent) {
        if (keyEvent.which === 13) {
            keyEvent.preventDefault();
            vm.userMessage();
        }
    };

    vm.messagePage = 0;
    vm.messageHasNext = true;

    vm.openDialog = function ($index, dialogId) {

        vm.shopName = 'teststore11111111111.myshopify.com';
        vm.titlePhone = '5034367607';
        vm.titleName = vm.dialogs[$index].buyer;
        // vm.titlePhone = vm.dialogs[$index].phone;
        getMessage();

        console.log($index);
        console.log('I\'m opening dialog with id of ' + dialogId);
    };

    vm.loadBuyers();

    var getMessage = function () {
        $http.get('https://0e9990ad.ngrok.io/conversation?shop=' + vm.shopName +
            '&sort=time,desc&phone=' + vm.titlePhone + '&page=' + vm.messagePage + '&size=20').then(function (res) {
            console.log($('#shopId').val());
            console.log(vm.titlePhone);
            console.log(res.data);
            for (var x in res.data) {
                var dialog = res.data[x];
                if (dialog.sender == vm.titlePhone) {
                    vm.addToEnd(dialog.value, 'user');
                } else {
                    vm.addToEnd(dialog.value, 'bot');
                }
            }
            if (res.data.length < 20)
                vm.messageHasNext = false;
            vm.messagePage += 1;
        });
    }

    var findBuyers = function (query) {
        $http.get('https://0e9990ad.ngrok.io/buyers/dto?shop=' + vm.shopName + '&query=' + query).then(function (res) {
            // $http.get('https://0e9990ad.ngrok.io/conversation?shop=' + vm.shopName +
            //     '&sort=time,desc&phone=' + vm.titlePhone + '&page=' + vm.messagePage + '&size=20').then(function (res) {
            for (var x in res.data) {
                var obj = {};
                var dialog = res.data[x];
                obj.dialogId = dialog.shopifyId;
                obj.buyer = dialog.firstName + " " + dialog.lastName;
                obj.phone = dialog.phone;
                obj.messages = dialog.messCount;
                obj.perfect = dialog.perfect;
                obj.date = dialog.date;
                obj.initials = dialog.firstName[0] + dialog.lastName[0];
                obj.transaction = "Problem spotted";

                if (obj.perfect) {
                    obj.transaction = "Perfect transaction";
                }

                vm.dialogs.push(obj);
            }
            vm.buyerPage += 1;
            if (res.data.length < 10) {
                vm.hasNextBuyer = false;
            }
        });
    }

    $(".search-input").change(function () {
        console.log($(this).val())
        vm.dialogs = [];
        findBuyers($(this).val());
    });

    $('.conversation').scroll(function () {
        if ($(this).scrollTop() == 0 && vm.messageHasNext) {
            getMessage();
        }
    });
    $('.dialogs-container').scroll(function () {
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            console.log("down")
            getBuyer();
        }
    });


    var taskSocket = new WebSocket("ws://https://0e9990ad.ngrok.io/webhooks/recieve");
    taskSocket.onmessage = function (message) {
        $scope.tasks = JSON.parse(message.data);
        $scope.$apply();
        console.log($scope.tasks);
    };
    taskSocket.onclose = function () {
        $scope.message = {
            type: "danger",
            short: "Socket error",
            long: "An error occured with the WebSocket."
        };
        $scope.$apply();
    }

}]);


