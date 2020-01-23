/* global $, Stripe */
//Document ready
$(document).on('turbolinks:load', function(){
  var theForm = $('#pro_form');
  var submitBtn = $('#form-submit-btn');
  
  //Set stripe public key
  Stripe.setPublishableKey($('meta[name="stripe-key"]').attr('content'));
  
  //When user clicks form submit button
  submitBtn.click(function(event){
    
    //prevent default submission behavior.
    event.preventDefault();
    submitBtn.val("Processing").prop('disabled', true);
    
  //Collect the credit card fields
  var ccNum = $('#card_number').val(),
      cvcNum = $('#card_code').val(),
      expMonth = $('#card_month').val(),
      expYear = $('#card_year').val();
      
      
      //User stripe js library to check for card errors
      var error = false;
      
      //Validate card number
      if(!Stripe.card.validateCardNumber(ccNum)) {
        error = true;
        alert('the credit card number appears to be invaild');
      }
      
      //Validate CVC number
      if(!Stripe.card.validateCVC(cvcNum)) {
        error = true;
        alert('the CVC number appears to be invaild');
      }
      
      //Validate expiration date.
      if(!Stripe.card.validateExpiry(expMonth, expYear)) {
        error = true;
        alert('the experation date appears to be invalid');
      }
      
      if (error){
        //If there are errors. dont send to stripe
        submitBtn.prop('disabled', false).valueOf("Sign Up");
      } else {
          //Send card information to stripe
          Stripe.createToken({
            number: ccNum,
            cvc: cvcNum,
            exp_month: expMonth,
            exp_year: expYear
          }, stripeResponseHandler);
        }
          
  return false;
  
  });
  
  //Stripe will return a card token.
  function stripeResponseHandler(status, response) {
    //Get token from the response
    var token = response.id;
    
    //Inject the card token in a hidden field
    theForm.append($('<input type="hidden" name="user[stripe_card_token]">').val(token) );
     
  //Submit form into our rails app
  theForm.get(0).submit();
       
  }
});
