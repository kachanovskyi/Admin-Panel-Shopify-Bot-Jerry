HiSumo
    .factory('loginFactory', function () {
        return {
            firstLogin: true
        }
    })
    .factory('creditsFactory', function () {
        return {
            amount: 0
        }
    })
    .factory('buyerMessages', function () {
        return {
            name: "",
            phone: ""
        }
    })
    .factory('chatbotState', function () {
        return {
            enabled: false
        }
    });
