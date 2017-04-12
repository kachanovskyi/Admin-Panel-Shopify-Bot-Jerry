$(document).ready(function() {

    $(function () {
        var $form = $('#payment-form');

        $form.submit(function (event) {
            $('.loading').css("visibility", "visible")
            var publicKey= $('.public-key').text();
            Stripe.setPublishableKey(publicKey);
            Stripe.card.createToken($form, stripeResponseHandler);
            return false;
        });
    });
});

function stripeResponseHandler(status, response) {
    var $form = $('#payment-form');
    if (response.error) {
        $('.loading').css("visibility", "hidden")
        swal("Error", response.error.message, "error")
    } else {
        var token = response.id;
        var orderHash= $('.orderHash').text();
        var url = $('.url').text();
        var address = $('#address').val();
        var phone = $('#phone').val();
        $.ajax({
            url : url + '/paid/',
            method : 'POST',
            crossDomain:true,
            data :  JSON.stringify( {token: token, orderHash: orderHash, address: address, phone: phone}),
            contentType : 'application/json',
            success : function(resData, status, jqXHR) {
                $('.loading').css("visibility", "hidden")
                swal("Successfull", "Order was paid", "success")
                var $form = $('#payment-form');
                $form.find('#confirm-purchase').prop('disabled', true);
                $form.find('#confirm-purchase').css("background", "#e2e2e2");
                $form.find('#confirm-purchase').css("color", "#867676");
                $form.find('#confirm-purchase').css("border", "0");
                setTimeout(function(){
                    window.close();
                }, 1500);

            },
            error : function(jqXHR, textStatus, errorThrown) {
                $('.loading').css("visibility", "hidden")
                swal("Error", jqXHR.responseText, "error")
            }
        });
    }
};

function checkData(element){
    var cardNumber = $('#card-number');
    var mon = $('#mon');
    var year = $('#year');
    var cvc = $('#cvc');
    var elements = [cardNumber, mon, year, cvc];
    var isCorrectData = true;
    for(var i = 0; i < elements.length; i++){
        if(checkInput(elements[i])){
            $(elements[i]).css({"background": "", "border": ""});
        }else{
            $(elements[i]).css({"background": "#fdd8d8", "border": "2px solid red"});
        }
        isCorrectData = isCorrectData && checkInput(elements[i]);
    }
    if(isCorrectData){
        $("#confirm-purchase").prop('disabled', false)
        $("#confirm-purchase").css("cursor", "pointer")
        $('.tool_tip').css('visibility', 'hidden')
        $('.tool_tip').css('height', '0px')
    }else{
        $("#confirm-purchase").attr('disabled','disabled');
        $("#confirm-purchase").css("cursor", "not-allowed")
        $('.tool_tip').css('visibility', 'visible')
        $('.tool_tip').css('height', '')
    }
}

function checkInput(element){
    var number = $(element).val();
    return !isNaN(number)
}





