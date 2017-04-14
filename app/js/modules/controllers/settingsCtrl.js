HiSumo.controller('SettingsCtrl', ['$scope', '$route', '$location', '$http', 'chatbotState', 'creditsFactory',
    function ($scope, $route, $location, $http, chatbotState, creditsFactory) {
        var vm = this;
        vm.messTemplates = [];

        var editModal = $('#editModal');
        var createModal = $('#createModal');

        var messageLength = 160;
        var excempt = [37,38,39,40,46,8,36,35];

        vm.editTemplate = function (parentIndex, index) {
            var params = vm.messTemplates[parentIndex].parameters;

            vm.symbolsLeft = 160;
            vm.messLength = 0;

            if(params !== undefined) {
                for(var x in params) {
                    vm.symbolsLeft -= params[x].size;
                }
            }

            vm.mess = "";
            vm.parts = [];
            var myStr = vm.messTemplates[parentIndex].values[index].value;
            if (vm.messTemplates[parentIndex].parameters.length >= 1) {
                vm.parts = [];
                var i = -1;
                var start, end;
                while (i = myStr.indexOf('{') != -1) {
                    start = myStr.indexOf('{');
                    end = myStr.indexOf('}') + 1;
                    vm.parts.push(myStr.substr(0, start));
                    vm.parts.push(myStr.substr(start, end));
                    myStr = myStr.substr(end);
                }
                vm.parts.push(myStr)
            }
            vm.mess = myStr;
            console.log(vm.parts);
            console.log(vm.mess);
            vm.currentParentIndex = parentIndex;
            vm.currentIndex = index;

            editModal.fadeIn(300, function () {
                vm.messLength = 0;
                $(".editable").each(function () {
                    if((vm.parts.length !== undefined) && $(this).attr('id').includes('editPart')) {
                        vm.messLength += $(this).text().length;
                        $scope.$apply();
                    } else if((vm.parts.length === 0) && $(this).attr('id') === "editMess") {
                        vm.messLength += $(this).text().length;
                        $scope.$apply();
                    }
                });

                $(".editable").on('keyup paste change focus blur keydown', function (evt) {
                    if($(this).attr('id').includes('editPart') || $(this).attr('id') === "editMess") {
                        vm.messLength = 0;
                        $(".editable").each(function () {
                            if((vm.parts.length !== undefined) && $(this).attr('id').includes('editPart')) {
                                vm.messLength += $(this).text().length;
                                $scope.$apply();
                            } else if((vm.parts.length === 0) && $(this).attr('id') === "editMess") {
                                vm.messLength += $(this).text().length;
                                $scope.$apply();
                            }
                        });

                        if(excempt.indexOf(evt.which) === -1 && vm.messLength >= vm.symbolsLeft) {
                            evt.preventDefault();
                            return false;
                        }
                    }
                });
            })
                .on("click", function () {
                    $(this).fadeOut(300);
                })
                .find('.modal-content').on("click", function (e) {
                e.stopPropagation();
            });
        };

        vm.closeEdit = function () {
            vm.parts = [];
            vm.mess = "";
            editModal.fadeOut(300);
        };
        vm.closeCreate = function () {
            vm.parts = [];
            vm.mess = "";
            createModal.fadeOut(300);
        };

        vm.updateMessage = function () {
            console.log($("#editMess"));
            console.log(vm.parts);
            if (vm.messTemplates[vm.currentParentIndex].parameters.length >= 1) {
                vm.newValue = "";
                for (var i = 0; i < vm.parts.length; i++) {
                    vm.newValue += $("#editPart" + i)[0].innerText;
                }
            } else {
                vm.newValue = $("#editMess")[0].innerText;
            }
            vm.messTemplates[vm.currentParentIndex].values[vm.currentIndex].value = vm.newValue;
            console.log(vm.messTemplates[vm.currentParentIndex]);
            // $http.put('https://0e9990ad.ngrok.io/messages', vm.messTemplates[vm.currentParentIndex].values[vm.currentIndex]).then(function (res) {
            //     console.log(res.data);
            // });
            vm.mess = "";
            vm.parts = [];
            vm.closeEdit();
        };

        vm.deleteMessage = function () {
            // $http.delete('https://0e9990ad.ngrok.io/messages?shopId=' + $('#shopId').val() + "&messName=" + vm.messTemplates[vm.parentDeleteId].group +
            //     "&messId=" + vm.messTemplates[vm.parentDeleteId].values[vm.deleteId].id).then(function (res) {
            //     console.log(res.data);
            // });
            vm.messTemplates[vm.parentDeleteId].values.splice(vm.deleteId, 1);
            vm.deleteId = -1;
            vm.parentDeleteId = -1;
        };

        vm.createMessage = function () {
            console.log($("#createMess")[0].innerText);
            console.log(vm.createParts);
            if (vm.messTemplates[vm.currentParentIndex].parameters.length >= 1) {
                vm.newValue = "";
                for (var i = 0; i < vm.createParts.length; i++) {
                    console.log($("#createPart" + i));
                    vm.newValue += $("#createPart" + i)[0].innerText;
                }
            }
            else
                vm.newValue = $("#createMess")[0].innerText;
            console.log(vm.newValue);
            console.log(vm.messTemplates[vm.currentParentIndex]);
            var data = {
                shopId: $('#shopId').val(),
                messName: vm.messTemplates[vm.currentParentIndex].group,
                value: vm.newValue
            }
            // $http.post('https://0e9990ad.ngrok.io/messages', data).then(function (res) {
            $http.post('data/messages.json').then(function (res) {
                console.log(res.data);
                vm.messTemplates[vm.currentParentIndex].values.push(res.data)
            });
            $("#createMess")[0].innerText = "";
            vm.createParts = [];
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
            var params = vm.messTemplates[parentIndex].parameters;

            vm.symbolsLeft = 160;
            vm.messLength = 0;

            if(params !== undefined) {
                for(var x in params) {
                    vm.symbolsLeft -= params[x].size;
                }
            }

            vm.createMess = "";
            vm.createParts = [];

            vm.currentParentIndex = parentIndex;
            if (vm.messTemplates[parentIndex].parameters.length >= 1) {
                for (var i = 0; i < vm.messTemplates[parentIndex].parameters.length; i++) {
                    vm.createParts.push('');
                    vm.createParts.push(vm.messTemplates[parentIndex].parameters[i]);
                    vm.createParts.push('');
                }
            } else {
                vm.createMess = "";
            }

            createModal.fadeIn(300, function () {
                vm.messLength = 0;

                $(".editable").on('keyup paste change focus blur keydown', function (evt) {
                    if($(this).attr('id').includes('createPart') || $(this).attr('id') === "createMess") {
                        vm.messLength = 0;
                        $(".editable").each(function () {
                            if((vm.createParts.length !== undefined) && $(this).attr('id').includes('createPart')) {
                                vm.messLength += $(this).text().length;
                                $scope.$apply();
                            } else if((vm.createParts.length === 0) && $(this).attr('id') === "createMess") {
                                vm.messLength += $(this).text().length;
                                $scope.$apply();
                            }
                        });

                        if(excempt.indexOf(evt.which) === -1 && vm.messLength >= vm.symbolsLeft) {
                            evt.preventDefault();
                            return false;
                        }
                    }
                });
            })
                .on("click", function () {
                    $(this).fadeOut(300);
                })
                .find('.modal-content').on("click", function (e) {
                e.stopPropagation();
            });
        };

        var chatbotModal;
        vm.chatbotStateModalOpen = function () {
            chatbotModal = $('#disabledStateModal');

            if (vm.chatbotState) {
                chatbotModal = $('#enabledStateModal');
            }

            if (chatbotModal.css('display') === 'none') {
                chatbotModal.fadeIn(300)
                    .on("click", function () {
                        $(this).fadeOut(300);
                    })
                    .find('.modal-content').on("click", function (e) {
                    e.stopPropagation();
                });
                $('.admin-panel-body').append(
                    $('<div>')
                        .addClass('overlay')
                        .on('click', function () {
                            chatbotModal.css('display', 'none');
                            $(this).remove();
                        })
                )
            }

            if (chatbotState.enabled) {
                chatbotState.enabled = false;
            } else {
                chatbotState.enabled = true;
            }
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
                if (vm.chatbotState) {
                    chatbotState.enabled = vm.chatbotState = false;
                } else {
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
            }
            // $http.put('https://0e9990ad.ngrok.io/shop', data).then(function (res) {
            $http.put('data/shop.json').then(function (res) {
                console.log(res.data);
                customAlert('Saved', 1);
            });
        };


        function checkBotState() {
            var title = 'Enable chatbot';
            console.log(chatbotState.enabled);
            if (!vm.chatbotState) {
                title = 'Enable chatbot'
            } else {
                title = 'Disable chatbot';
            }
            $('.tab-btn.chatbot').text(title);
            $('.disable-container').find('h2').text(title);

        }

        vm.setProblemSpotted = function () {
            console.log(vm.problemSpotted);
            vm.problemSpotted = !vm.problemSpotted;
            updateShop();
        };

        vm.setRechargeReminder = function () {
            vm.rechargeNotification = !vm.rechargeNotification;
            console.log(vm.rechargeNotification);
            updateShop();
        };

        function start() {
            $http.get('https://0e9990ad.ngrok.io/shop?shop=' + $('#shopId').val()).then(function (res) {
                vm.rechargeNotification = res.data.rechargeReminder;
                vm.problemSpotted = res.data.problemSpottedNotification;
                vm.creditsCount = res.data.creditsCount;
                vm.firstVisit = res.data.firstVisit;
                // chatbotState.enabled = res.data.isBotActive;
                vm.chatbotState = res.data.isBotActive;
                checkBotState();
            });
        };

        var handler = StripeCheckout.configure({
            key: 'pk_test_jL3mNBnc2oT4N5IjnUhysrpT',
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function (token) {
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
            }
        });

        var smsPrice = 0.75;
        vm.rechargeAmount = "";

        $("#creditsAmount").keyup(function () {
            var rechargeBtn = $('#btnRecharge').addClass('disabled');
            var value = $(this).val();

            if (value == "") {
                $(this).css('outline-color', '#0078BD');
            } else if ((isNaN(value)) || (!isNaN(value) && value < 10)) {
                $(this).css('outline-color', '#AB3B3B');
            } else if (!isNaN(value) && value >= 10) {
                $(this).css('outline-color', '#41A66B ');
                rechargeBtn.removeClass('disabled');
                vm.rechargeAmount = value * smsPrice;
                console.log(vm.rechargeAmount);
            }
        });

        $('#btnRecharge').on('click', function (e) {
            // Open Checkout with further options:
            e.preventDefault();
            if (!$(this).hasClass('disabled')) {
                handler.open({
                    name: 'TestJerry',
                    description: 'test store',
                    zipCode: true,
                    amount: vm.rechargeAmount,
                    closed: function () {
                        $http.get('https://0e9990ad.ngrok.io/paid?shopId=' + $('#shopId').val() + '&amount=' + vm.rechargeAmount).then(function (res) {
                            console.log(res.data);
                            console.log(vm.rechargeAmount);
                            creditsFactory.amount += vm.rechargeAmount / smsPrice;
                            vm.creditsCount = creditsFactory.amount;
                            vm.rechargeAmount = "";
                            $('#feedbackModal').fadeIn(100);
                        });
                    }
                });
                $("#creditsAmount").val("");
            }
        });

        $(document).ready(function () {
            $('.modal-content').on('blur', function () {
                $('.modal').fadeOut(300);
            })
        });
        start();

        vm.confirmModalClose = function () {
            $('#deleteMessageModal').fadeOut(300);
            vm.deleteId = -1;
        }

        vm.openDeleteModal = function (parentIndex, index) {
            vm.deleteId = index;
            vm.parentDeleteId = parentIndex;
            $('#deleteMessageModal')
                .fadeIn(300)
                .on("click", function () {
                    $(this).fadeOut(300);
                })
                .find('.modal-content').on("click", function (e) {
                e.stopPropagation();
            });
        }

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
            })
        /////////////////////////////////////////////////////////////
        function moveBy(sectionIndex, sectionID, delta) {
            sectionIndex = (typeof sectionIndex === 'undefined')
                ? ''
                : sectionIndex;

            var selector = '#' + sectionID + sectionIndex,
                $scrollable = $(selector),
                curScroll = $scrollable.scrollLeft(),
                scrollTo = curScroll + delta;

            scrollTo = (delta > 0)
                ? Math.min(scrollTo, $(window).width())
                : Math.max(scrollTo, 0);

            // $scrollable.scrollLeft(scrollTo);
            $scrollable.animate({
                scrollLeft: scrollTo
            }, 150);

        }

        vm.scrollLeft  = function (sectionIndex, sectionID) {
            moveBy(sectionIndex, sectionID, -280);
        };
        vm.scrollRight  = function (sectionIndex, sectionID) {
            moveBy(sectionIndex, sectionID, +280);
        };

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
