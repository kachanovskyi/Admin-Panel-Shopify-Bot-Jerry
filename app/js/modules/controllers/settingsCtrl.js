HiSumo.controller('SettingsCtrl', ['$scope', '$route', '$location', '$http', 'chatbotState', function ($scope, $route, $location, $http, chatbotState) {
    var vm = this;

    vm.symbolsLeft = 160;
    vm.messTemplates = [];

    var editModal = $('#editModal');
    var createModal = $('#createModal');
    var excempt = [37,38,39,40,46,8,36,35];

    $('#feedbackModal').fadeIn(100);

    vm.editTemplate = function (parentIndex, index) {
        var params = vm.messTemplates[parentIndex].parameters;

        vm.symbolsLeft = 160;

        if(params !== undefined) {
            for(var x in params) {
                vm.symbolsLeft -= params[x].size;
            }
        }

        $("[contenteditable='true']").each(function(index,elem) {
            var $elem = $(elem);
            // Check for a property called data-input-length="value"
            var length = $elem.data('input-length');
            // Validation of value
            if(!isNaN(length)) {
                // Register keydown handler
                $elem.on('keydown',function(evt){
                    // If the key isn't excempt AND the text is longer than length stop the action.
                    if(excempt.indexOf(evt.which) === -1 && $elem.text().length > length) {
                        evt.preventDefault();
                        return false;
                    }
                });
            }
        });


        console.log(parentIndex);
        console.log(index);
        console.log(vm.messTemplates[parentIndex].parameters[index].size);
        console.log(vm.messTemplates[parentIndex].values[index].value);
        vm.currentParentIndex = parentIndex;
        vm.currentIndex = index;
        if (vm.messTemplates[parentIndex].parameters.length >= 1) {
            vm.message = vm.messTemplates[parentIndex].values[index].value.split(vm.messTemplates[parentIndex].parameters[0].parameter);
            vm.messageOne = vm.message[0];
            vm.messageTwo = vm.message[1];
        } else {
            vm.messageOne = vm.messTemplates[parentIndex].values[index].value;
            vm.messageTwo = "";
        }
        $('#editMessageOne')[0].innerText = vm.messageOne;
        $('#editMessageTwo')[0].innerText = vm.messageTwo;
        console.log(vm.messageOne);
        console.log(vm.messageTwo);
        editModal.css('display', "block");
    };

    vm.closeEdit = function () {
        editModal.css('display', "none");
    };
    vm.closeCreate = function () {
        createModal.css('display', "none");
    };

    vm.updateMessage = function () {
        console.log(vm.messTemplates[vm.currentParentIndex]);
        vm.messageOne = $('#editMessageOne')[0].innerText;
        vm.messageTwo = $('#editMessageTwo')[0].innerText;
        console.log($('#editMessageOne'));
        console.log(vm.messageOne);
        console.log(vm.messageTwo);
        if (vm.messTemplates[vm.currentParentIndex].parameters.length >= 1)
            vm.messTemplates[vm.currentParentIndex].values[vm.currentIndex].value = vm.messageOne + vm.messTemplates[vm.currentParentIndex].parameters[0].parameter + vm.messageTwo;
        else
            vm.messTemplates[vm.currentParentIndex].values[vm.currentIndex].value = vm.messageOne + vm.messageTwo;
        console.log(vm.messTemplates[vm.currentParentIndex]);
        // $http.put('https://0e9990ad.ngrok.io/messages', vm.messTemplates[vm.currentParentIndex].values[vm.currentIndex]).then(function (res) {
        //     console.log(res.data);
        // });
        vm.closeEdit();
    };

    vm.createMessage = function () {
        console.log(vm.messTemplates[vm.currentParentIndex]);
        vm.messageOne = $('#createMessageOne')[0].innerText;
        vm.messageTwo = $('#createMessageTwo')[0].innerText;
        console.log(vm.messageOne);
        console.log(vm.messageTwo);
        if (vm.messTemplates[vm.currentParentIndex].parameters.length >= 1)
            vm.newValue = vm.messageOne + vm.messTemplates[vm.currentParentIndex].parameters[0].parameter + vm.messageTwo;
        else
            vm.newValue = vm.messageOne + vm.messageTwo;
        console.log(vm.messTemplates[vm.currentParentIndex]);
        var data = {
            shopId: $('#shopId').val(),
            messName: vm.messTemplates[vm.currentParentIndex].group,
            value: vm.newValue
        }
        // $http.post('https://0e9990ad.ngrok.io/messages', data).then(function (res) {
        //     console.log(res.data);
        //     vm.messTemplates[vm.currentParentIndex].values.push(res.data)
        // });
        vm.closeCreate();
    };

    vm.loadMessagesTemplates = function () {

        // $http.get('https://0e9990ad.ngrok.io/messages?shop=' + $('#shopId').val()).then(function (res) {
        $http.get('data/messages.json').then(function (res) {
            for (var x in res.data) {
                var obj = {};
                var template = res.data[x];
                obj.group = template.name;
                obj.shopId = template.shopId;
                obj.values = [];
                obj.parameters = [];
                if (template.values.length) {
                    for (var a in template.values) {
                        var value = {};
                        value.id = template.values[a].id;
                        value.value = template.values[a].value;
                        obj.values.push(value);
                    }
                }
                if (template.parameters.length) {
                    for (var b in template.parameters) {
                        var parameter = {};
                        parameter.id = template.parameters[b].id;
                        parameter.parameter = template.parameters[b].parameter;
                        parameter.size = template.parameters[b].size
                        obj.parameters.push(parameter);
                    }
                }
                vm.messTemplates.push(obj);
            }
        });
    };
    vm.loadMessagesTemplates();
    console.log(vm.messTemplates);

    vm.addTemplate = function (parentIndex) {
        console.log(parentIndex);
        console.log(vm.messTemplates[parentIndex].parameters);
        vm.currentParentIndex = parentIndex;
        // if (vm.messTemplates[parentIndex].parameters.length >= 1)
        //     vm.message = ["", vm.messTemplates[parentIndex].parameters[0].parameter, ""];
        // else
        //     vm.message = ["", ""];
        vm.messageOne = "";
        vm.messageTwo = "";

        console.log(vm.messageOne);
        console.log(vm.messageTwo);
        createModal.css('display', "block");
    };
    checkBotState();

    var chatbotModal;
    vm.chatbotStateModalOpen = function () {
        chatbotModal = $('#disabledStateModal');

        if (vm.chatbotState) {
            chatbotModal = $('#enabledStateModal');
        }

        if (chatbotModal.css('display') === 'none') {
            chatbotModal.fadeIn(300);
            $('.admin-panel-body').append(
                $('<div>')
                    .addClass('overlay')
                    .on('click', function () {
                        chatbotModal.css('display', 'none');
                        $(this).remove();
                    })
            )
        }

        // if(chatbotState.enabled) {
        //     chatbotState.enabled = false;
        // } else {
        //     chatbotState.enabled = true;
        // }
    };

    vm.chatbotStateModalClose = function (res) {

        chatbotModal = $('#disabledStateModal');

        if (vm.chatbotState) {
            chatbotModal = $('#enabledStateModal');
        }

        if (!res) {
            chatbotModal.fadeOut(300);
            $('.admin-panel-body').find('.overlay').remove();
        } else if (res) {
            if (vm.chatbotState){
                chatbotState.enabled = vm.chatbotState = false;
            }else {
                chatbotState.enabled = vm.chatbotState = true;
            }
            chatbotModal.fadeOut(300);
            $('.admin-panel-body').find('.overlay').remove();
            $route.reload();
        }
        updateShop();
        checkBotState();
    };

    $scope.$on('$routeChangeSuccess', function (next, current) {
        checkBotState();
    });

    var timeout;
    var customAlert = function(text, type) {
        if ($('.alert')) {
            $('.alert').remove();
            window.clearTimeout(timeout);
        }
        var alert = $('<div class="alert" role="alert">').append($('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'));
        alert.css('right', "-" + alert.width()).css('opacity', 0);
        if (type === 1) {
            alert.addClass('alert-success').append($('<p>').append($('<strong>Saved! </strong>')))
        } else {
            alert.addClass('alert-danger').append($('<p>').append($('<strong>Oh! </strong>')).append(text + " ").append($('<i class="twa twa-confused"></i>')))
        }
        alert.appendTo('.wrapper');

        console.log(alert.css('right'));
        $(".alert").animate({
            right: 30,
            opacity: 1
        }, 250);
        timeout = window.setTimeout(function() {
            $(".alert").fadeOut(250, function() {
                $(this).remove();
            });
        }, 2000);
    };

    var updateShop = function () {
        var data = {
            name: $('#shopId').val(),
            isBotActive: vm.chatbotState,
            problemSpottedNotification: vm.problemSpotted,
            creditsCount: vm.creditsCount,
            firstVisit: vm.firstVisit,
            rechargeReminder: vm.rechargeNotification
        };
        // $http.put('https://0e9990ad.ngrok.io/shop', data).then(function (res) {
        $http.get('data/messages.json').then(function (res) {
            console.log(res.data);
            customAlert('Saved', 1);
        });
    };


    function checkBotState() {
        var title = 'Enable chatbot';
        console.log(chatbotState.enabled);
        if (!chatbotState.enabled) {
            title = 'Enable chatbot'
        } else {
            title = 'Disable chatbot';
        }
        $('.tab-btn.chatbot').text(title);
        $('.disable-container').find('h2').text(title);

    }
    vm.setProblemSpotted = function () {
        console.log(vm.problemSpotted);
        updateShop();
    };

    vm.setRechargeReminder = function () {
        console.log(vm.rechargeNotification);
        updateShop();
    };


    // $http.get('https://0e9990ad.ngrok.io/shop?shop=' + $('#shopId').val()).then(function (res) {
    //     vm.rechargeNotification = res.data.rechargeReminder;
    //     vm.problemSpotted = res.data.problemSpottedNotification;
    //     vm.creditsCount = res.data.creditsCount;
    //     vm.firstVisit = res.data.firstVisit;
    //     // chatbotState.enabled = res.data.isBotActive;
    //     vm.chatbotState = res.data.isBotActive;
    //     checkBotState();
    // });

    var handler = StripeCheckout.configure({
        key: 'pk_test_jL3mNBnc2oT4N5IjnUhysrpT',
        image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
        locale: 'auto',
        token: function(token) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
        }
    });

    var smsPrice = 0.75;
    vm.rechargeAmount = "";

    $("#creditsAmount").keyup(function() {
        var rechargeBtn = $('#btnRecharge').addClass('disabled');
        var value = $(this).val();

        if(value == "") {
            $(this).css('outline-color', '#0078BD');
        } else if((isNaN(value)) || (!isNaN(value) && value < 10)) {
            $(this).css('outline-color', '#AB3B3B');
        } else if(!isNaN(value) && value >= 10) {
            $(this).css('outline-color', '#41A66B ');
            rechargeBtn.removeClass('disabled');
            vm.rechargeAmount = value * smsPrice;
            console.log(vm.rechargeAmount);
        }
    });

    $('#btnRecharge').on('click', function(e) {
        // Open Checkout with further options:
        e.preventDefault();
        if(!$(this).hasClass('disabled')) {

            handler.open({
                name: 'TestJerry',
                description: 'test store',
                zipCode: true,
                amount: vm.rechargeAmount
            });
            $("#creditsAmount").val("");
            // $http.get('https://0e9990ad.ngrok.io/paid?shopId=' + $('#shopId').val() + '&amount=' + vm.rechargeAmount).then(function (res) {
            //     console.log(res.data);
            // });
            vm.rechargeAmount = "";
        }
    });

    // window.addEventListener('popstate', function() {
    //     handler.close();
    // });


    $('#leaveFeedback')
        .on("click", function () {
            $('#feedbackModal').fadeOut(300);
        });
    $('#feedbackModal').find('.close img')
        .on('click', function () {
            $('#feedbackModal').fadeOut(300);
        })
        .on('mouseover', function () {
            console.log('mouse over');
            $('#feedbackImg').attr('src', '/images/sad.png');
        })
        .on('mouseleave', function () {
            console.log('mouse left');
            $('#feedbackImg').attr('src', '/images/happy.png');
        });

    $(document).ready(function(){
        // Excempt keys(arrows, del, backspace, home, end);
        var excempt = [37,38,39,40,46,8,36,35];
        // Loop through every editiable thing
        $("[contenteditable='true']").each(function(index,elem) {
            var $elem = $(elem);
            // Check for a property called data-input-length="value"
            var length = $elem.data('input-length');
            // Validation of value
            if(!isNaN(length)) {
                // Register keydown handler
                $elem.on('keydown',function(evt){
                    // If the key isn't excempt AND the text is longer than length stop the action.
                    if(excempt.indexOf(evt.which) === -1 && $elem.text().length > length) {
                        evt.preventDefault();
                        return false;
                    }
                });
            }
        });
    });
}]);
