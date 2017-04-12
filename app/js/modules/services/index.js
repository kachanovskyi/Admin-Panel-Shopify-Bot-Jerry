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

    .factory('chatbotState', function () {
        return {
            enabled: false
        }
    });
