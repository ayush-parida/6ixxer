 //18-10-2018//
  //01-11-2020//
function getMobileExistOrNot(ele){
    var Mobile = $(ele).find(".reg-mble").val();
    Mobile=$.trim(Mobile);
    if (Mobile == ""){  return false; }
    var mobileexist=true;
    if (Mobile != ""){
      if (Mobile.length != 10){
        showexistErrors("mobile invalid",  true);
        return false;
    }
  }
    $.ajax({    url: '/checkmobileavailability/'+Mobile+"/",
              dataType: 'json',
              async: false,
              data: {},
              success: function(data) {
                    result = data.result
                    if (result == "True"){
                        showexistErrors("mobile",  true);
                         mobileexist = true;
                     }
                     if (result == "False"){
                        showexistErrors("mobile",  false)
                        mobileexist = false;

                     }
               }
    });
    return mobileexist;
}


function showexistErrors(error_type, is_error){

    var error_msg = ""
    if(error_type == "mobile"){
        error_msg = "* Given mobile number already registered with us."
    }
    else if(error_type =="mobile invalid"){
         error_msg = "* Please enter valid mobile number."
    }
    else if(error_type =="email"){
         error_msg = "* Given email address already registered with us."
    }
    else if(error_type == "username"){
        error_msg = "* Given username already registered with us."
    }
    if(is_error){
        $(".message_div,.popmessage_div").show();
        $("div[for='"+error_type+"']").html(error_msg).show();
        //$('#signupsubmit').attr('disabled','disabled');
    }
    else{
        $(".message_div,.popmessage_div").hide();
        $("div[for='"+error_type+"']").html("").hide();
        $('#signupsubmit').removeAttr('disabled');
    }
}


var usernameexist=false;var emailexist=false;mobileexist=false;
function getUsernameExistOrNot(ele){
    var Username=$(ele).find(".reg-user").val();
    Username=$.trim(Username);
    if (Username == ""){  return false; }
    $.ajax({ url:'/checkusernameavailability/'+Username+"/",
             dataType:'json',
             async:false,
             data:{},
             success:function(data){
                result=data.result;
            if(result=="True"){
                showexistErrors("username",  true);
                usernameexist=true;
            }
            if(result=="False"){
                usernameexist=false;
                showexistErrors("username",  false);

             }
         }
    });
    return usernameexist;
}


function getEmailExistOrNot(ele){
    var Email=$(ele).find(".reg-email").val();
    Email=$.trim(Email);
    if (Email == ""){  return false; }
    $.ajax({ url:'/checkemailavailability/'+Email+"/",
             dataType:'json',
             async:false,
             data:{},
             success:function(data){
                result=data.result
                if(result=="True"){
                    showexistErrors("email",  true);
                    emailexist=true;
                 }
                if(result=="False"){
                    emailexist=false;
                    showexistErrors("email",  false);
                }
             }
    });

    return emailexist;
}

 
function send_login(ele){

  var user= $(ele).find(".log-user").val();
  var pswd= $(ele).find(".log-pswd").val();
  var token= $(ele).find(".log-otp").val();
  var next_url= $(ele).find(".next_url").val();
  var url_redirect = "/lobby/";
  if (next_url != ""){
        url_redirect = next_url;
  }
//   if(user == "" || pswd == "") {
//     $('.response_msg').removeClass('success_msg');
//     $('.response_msg').html("*Please Enter username and password");
//     $('.response_msg').show();
//     $('.response_msg').addClass('error_msg');
//     //window.scrollTo(0 ,450), !1;
//     return false;
// }
if(user == "") {
          $('.response_msg').removeClass('success_msg');
          if( pswd == "")
            $('.response_msg').html("*Please enter username and password");
          if(token == "")
            $('.response_msg').html("*Please enter otp");
          $('.response_msg').show();
          $('.response_msg').addClass('error_msg');
          //window.scrollTo(0 ,450), !1;
          return false;
      }
      var reg_type = "Username";
      if(!isNaN(parseInt(user)))reg_type="Mobile";
      if(user.indexOf("@") > -1)reg_type="Email";
      if(token != undefined && token != null && token != "" && token.length > 0) {
       reg_type +="-OTP"
      }
      else{
          reg_type +="-Password"
      }
      if (pswd == "") {
        logindata = {
          'username': user,
          'token' : token,
        }
      }
      else {
        logindata = {
          'username': user,
          'password': pswd, 
        }
      }
  ajaxBlockUI();
   $.ajax({
        url: '/api/v1/login/',
        dataType: 'json',
        data: logindata,
        async: false,
        type: "POST",
        success: function(data) {
              var status = data.status;
              var message = data.message;
                    if (status == "error"){

                        $('.response_msg').removeClass('success_msg');
                        $('.response_msg').show();
                        $('.response_msg').html(message);
                        $('.response_msg').addClass('error_msg');
                        //window.scrollTo(0 ,450), !1;
                    }
                    if (status == "Success"){
                        //$('.response_msg').show();
                        //$('.response_msg').addClass('success_msg');
                        //$('.response_msg').html("*Entered success");
                        var token =data.token;
                        // CheckandsetUserattributes(true, JSON.stringify(data));
                        try{
                          data.reg_type=reg_type;
                          CheckandsetGlobalEventService(JSON.stringify(data), true);
                      }
                      catch (e) {
                        console.log("Error in Global Setting on Login.")
                      }
                        // Glb_WebEngage.loginEvent();
                        window.localStorage.setItem("token", token);
                        window.location.href=url_redirect;
                        //window.location.assign(url_redirect);
                        //window.scrollTo(0 ,450), !1;

                    }
                    ajaxUnBlockUI();
              },
            error: function(edata) {
                    status = edata.responseJSON.status;
                    message = edata.responseJSON.error;
                    if (status == "Error"){
                      $('.response_msg_otp').show();

                      if(pswd != "" && token== ""){
                        $('.response_msg').html("*Incorrect username and password");
                        $('.response_msg').show();
                        $('.response_msg').addClass('error_msg');
                  
                        
                    }
                        // $('.response_msg').removeClass('success_msg');
                        // $('.response_msg').show();
                        // $('.response_msg').html(message);
                        // $('.response_msg').addClass('error_msg');
                        //window.scrollTo(0 ,450), !1;
                    } 
                    ajaxUnBlockUI(); 
                  },
        });
    return false;
}


function ajaxunblock(){
  var $body = $("body");
  $body.removeClass("loading");
  console.log("adasdad");

}
function ajaxBlockUI(ele){
  var $body = $("body");
   $body.addClass("loading"); 
  console.log("adasdad");  
}

function ajaxUnBlockUI(ele){
  setTimeout(ajaxunblock, 2000);
}



function send_signup(ele){

  // var user_exists=getUsernameExistOrNot(ele);
  // var email_exists=getEmailExistOrNot(ele);
  var mobile_exist = getMobileExistOrNot(ele);
  if( mobile_exist){
  // $('#signupsubmit').attr('disabled','disabled');
  return false;
}


  // var user = $(ele).find(".reg-user").val();
  // var pswd = $(ele).find(".reg-pswd").val();
  // var email = $(ele).find(".reg-email").val();
  var mobile = $(ele).find('.reg-mble').val();
  // var referer_code = $(ele).find('.reg_referer_code').val();
  var reg_promo_code = $(ele).find('.reg_promo_code').val();
  // var token = $(ele).find('.reg-otp').val();
  var token= $('#validationTooltip03').val();
  
  if( mobile == "") {
    var mobile = $(ele).find('.reg-mble').eq(1).val();
}
  if( reg_promo_code == "") {
    var reg_promo_code = $(ele).find('.reg_promo_code').eq(1).val();
}

      if( mobile == "") {
          $('.response_msg').removeClass('success_msg');
          $('.response_msg').html("*Please enter below details");
          $('.response_msg').show();
          $('.response_msg').addClass('error_msg');
          window.scrollTo(0 ,0), !1;
          return false;
      }

  //     var csrf = getCookie('csrftoken');
  // if(csrf == "" || csrf == null){
  //     return;
  // }
      ajaxBlockUI();
      $.ajax({
            url: '/api/v1/signup/',
            dataType: 'json',
            data: {
            // 'username': user,
            // 'password': pswd,
            // 'email': email,
            'mobile':mobile,
            'reg_promo_code': reg_promo_code,
            'token' : token,
            //'csrfmiddlewaretoken': csrf,
            },
            async: false,
            type: "POST",
            success: function(data) {
                  status = data.status;
                    if (status == "error"){

                        $('.message_div,.popmessage_div').removeClass('success_msg');
                        $('.message_div,.popmessage_div').show();
                        $('.message_div,.popmessage_div').html("Please try later");
                        $('.message_div,.popmessage_div').addClass('error_msg');
                        //window.scrollTo(0 ,450), !1;
                    }
                    if (status == "Success"){
                        //$('.response_msg').show();
                        //$('.response_msg').addClass('success_msg');
                        //$('.response_msg').html("*Entered success");
                        var token =data.token;
                        // CheckandsetUserattributes(true, JSON.stringify(data));
                        // Glb_WebEngage.registerEvent();
                        window.localStorage.setItem("token", token);
                      try{
                          data.reg_type="Mobile-OTP";
                          CheckandsetGlobalEventService(JSON.stringify(data), true);
                      }
                      catch (e) {
                        console.log("Error in Global Setting on Register.");
                      }
                        window.localStorage.setItem("token", token);
                        window.location.href="/thank-you/";
                        //window.scrollTo(0 ,450), !1;

                    }
                    ajaxUnBlockUI();
              },
            error: function(edata) {
                    status = edata.responseJSON.status;
                    message = edata.responseJSON.message;
                    if (status == "Error"){

                        $('.message_div,.popmessage_div').removeClass('success_msg');
                        // $('.message_div,.popmessage_div').show();
                        $('.response_msg_otp').show();
                        $('.message_div,.popmessage_div').html(message);
                        $('.message_div,.popmessage_div').addClass('error_msg');
                        window.scrollTo(0 ,0), !1;
                    }
                    ajaxUnBlockUI(); 
                  },
        });
    return false;


}


/////////////////////////////////////index.html scripts starts from herer//////////////////////////////////////////////////////////////////////////

function registernow(ele) {
  $(".invalid-feedback").css('display','none');
  var form = $(ele).closest("form"); 
 
  var getphonenumber = $(form).find(".reg-mble").val()
  $('#dummy-reg-mob').val(getphonenumber);
  if (getphonenumber != undefined) {
    $('#dummy-log-mob').val(getphonenumber);

  }
  getphonenumber= $('#dummy-log-mob').val();
  if ( isNaN(getphonenumber) || getphonenumber.length != 10) {
    showexistErrors("mobile invalid",  true);
    // $('#reg-mob-id').css('display', 'block');
    $('#mobile-signup').css('display', 'block');
    event.preventDefault();
    event.stopPropagation();
    return;
  }
    ajaxBlockUI();
    $.ajax({
    url: '/api/v1/register-OTP/',
    dataType: 'json',
    data: {'mobile':getphonenumber},
    type: "POST",
    success: function (data) {
      console.log(data);
      status = data.status;
      if (status == "error") {

      $('.response_msg').removeClass('success_msg');
      $('.response_msg').show();
      $('.response_msg').html("Please try later");
      $('.response_msg').addClass('error_msg');
      $("server_resp").hide();
      }
      if (status == "Success") {
      console.log('success')
      // $('#register').modal('toggle');
      $('#register-otp-modal').modal('show');


      }
      ajaxUnBlockUI();
    },
    error: function (edata) {
      status = edata.responseJSON.status;
      message = edata.responseJSON.message;
      if (status == "Error") {
      $(".message_div,.popmessage_div").show();
      // $("div[for='server_resp']").html(message).show();
      window.scrollTo(0, 0), !1;
      }
      ajaxUnBlockUI();
    },
    })
    return false;
    form.classList.add('was-validated');
    ajaxUnBlockUI();
  }
    /////////////////////////////////////////////////////////////////////
  
    function verifyotp(ele) {

      var regotp1 = $('#otp-number-input-register-1').val();
      var regotp2 = $('#otp-number-input-register-2').val();
      var regotp3 = $('#otp-number-input-register-3').val();
      var regotp4 = $('#otp-number-input-register-4').val();
      var regotp5 = $('#otp-number-input-register-5').val();
      var regotp6 = $('#otp-number-input-register-6').val();
      var regotpfull = regotp1 + regotp2 + regotp3 + regotp4 + regotp5 + regotp6;
      $('#otp-register').val(regotpfull);
  
  
  
      var otpvalue = $('#otp-register').val();
      $('#validationTooltip03').val(otpvalue);
      // var forms = document.getElementsByClassName('needs-validation');
      var form = document.getElementsByClassName('reg_form')
      if (otpvalue.length == 0) {
        $('#otp_for_register').css('display', 'block');
        event.preventDefault();
        event.stopPropagation();
      }
      else {
          $('#invalid-feedback1').css('display', 'none');
          $('#otp_for_register').css('display', 'none');
        console.log('291')
        var formId = $(form).attr('id');
        console.log(formId)
        if (formId == "reg_form") {
          send_signup(form);
          event.preventDefault();
          event.stopPropagation();
        }
    
      }
      form.classList.add('was-validated');
    
    }
    
      /////////////////////////////////////////index.html scripts ends from herer//////////////////////////////////////////////////////////////////////

      //////////////////////////////////////header befor login script starts here/////////////////////////////////////////   
  
    function validatemobileforlogin(event) {


        var mob = $('#usernamel').val();
        if (mob.trim() != '') {
          $('#emu_id').css('display', 'none')
        }
        
        
        if (mob.length == 10 && !isNaN(mob)) {
          $('#emu_id').css('display', 'none')
          $('#EnterOTPtext').css('display', 'block')
          $('label[for="foo"]').css('display', 'block');
        
        }
        else {
          $('#EnterOTPtext').css('display', 'none');
          $('.invalid-feedback').css('display', 'none');
        }
        return;
        }
        ////////////////////////////////////////////////////////////

        
  ///////////////////////////////
  function request_otp_for_login(ele) {
    var form = $(ele).closest("form");
    var userName = $(form).find(".log-user").val();
    $('#dummy-log-mob').val(userName);
    if (userName != undefined) {
      $('#dummy-log-mob').val(userName);

    }
    userName= $('#dummy-log-mob').val();
    if (userName == "" || isNaN(userName) || userName.length != 10) {
     
      $('#error-for-otp').css('display','block');
      event.preventDefault();
      event.stopPropagation();
      console.log('Error in Mobile Number in Username');
      return false;
    }
      $.ajax({
        url: '/api/v1/login-OTP/',
        dataType: 'json',
        data: {'mobile': userName},
        type: "POST",
        success: function (data) {
          console.log(data)
          status = data.status;
          if (status == "error") {
            $("#login-otp-modal").modal('show');
            $('.response_msg').removeClass('success_msg');
            $('.response_msg').show();
            $('.response_msg').html("Please try later");
            $('.response_msg').addClass('error_msg');
          }
          if (status == "Success") {
            $('.response_msg_otp').css('display','none');
              $('#login-otp-modal').attr('formID', $(form).attr('id'));
              $('#login-otp-modal').modal('show');
              // $('#exampleModalCenter').modal('toggle');
          }
          ajaxUnBlockUI();
        },
        error: function (edata) {
          status = edata.responseJSON.status;
          message = edata.responseJSON.message;
          if (status == "Error") {
            $(".message_div,.popmessage_div").show();
            $("#server_resp").show();
            //$('#login-otp-modal').hide();
            window.scrollTo(0, 0), !1;
          }
          ajaxUnBlockUI();
        },
      })
      return false;
    form.classList.add('was-validated');
  }
  /////////////////

  function verifyotplogin(ele) {
    $('.response_msg').css('display', 'none');
    $('.response_msg').hide();

    var logotp1 = $('#otp-number-input-login-1').val();
    var logotp2 = $('#otp-number-input-login-2').val();
    var logotp3 = $('#otp-number-input-login-3').val();
    var logotp4 = $('#otp-number-input-login-4').val();
    var logotp5 = $('#otp-number-input-login-5').val();
    var logotp6 = $('#otp-number-input-login-6').val();
    var logotpfull = logotp1 +logotp2 + logotp3 + logotp4 + logotp5 + logotp6;
    $('#otp-login').val(logotpfull);



    var otpvalue_login = $('#otp-login').val();
    $('#user-otp-token-1').val(otpvalue_login);
    $('#user-otp-token-2').val(otpvalue_login);
    if (otpvalue_login.length !=6) {
      $("#login-otp-modal").modal('show');
        $('#otpforlogin').css('display', 'block');
        event.preventDefault();
        event.stopPropagation();
        return;
    }
    var FormtoSubmit = $("#login-otp-modal").attr("formID");
    console.log('Submitting Login Form ...')
    send_login($("#"+FormtoSubmit));
    // $("#"+FormtoSubmit).classList.add('was-validated');
}
          //////////////////////////////////////header befor login script ends here/////////////////////////////////////////      
    
$(document).ready(function(){

        $(".reg-email").blur(function(){
            getEmailExistOrNot($(this).closest('form'));
       });
        $(".reg-user").blur(function(){
           getUsernameExistOrNot($(this).closest('form'));
       });

        $(".reg-mble").blur(function(){
           getMobileExistOrNot($(this).closest('form'));
       });

        $("#rv-signin-form-id").validate({//onfocusout: false,onkeyup: false,
              onfocusout: false,
              rules: {
                  Username: {

          required: true,
          minlength: 4

          },
                 Password: {

          required: true,
          minlength: 5

          }
              },
              messages: {
                  Username: {
                      required: "Please enter username",
                      minlength: "Length should be 4 to 15 "
                  },
                  Password: {
                      required: "Please enter password",
                      minlength: "Length should be 5 to 15 "
                  },
              },
              //errorPlacement: function(){
                //      return false;
                //},
                errorElement : 'div',
    errorLabelContainer: '.message_div',

          });


           $(".rv-signup-form").validate({rules:{Username:{required:true,minlength:4},
          Email:{required:true,email:true},Password:{required:true,minlength:5}},
          messages:{Username:{required:"Please enter username",minlength:"Username (4-15 Characters)"},
          Password:{required:"Please enter password",minlength:"Password (5-15 Characters)"},
          Email:"Please enter valid email"},
         //errorPlacement: function(){
           //           return false;
             //  },
            errorElement : 'div',
    errorLabelContainer: '.message_div',
          showErrors:function(errorMap,errorList){
            this.defaultShowErrors();},
        success:function(){
                },
             });
        });



//forgot password //
var resendOTP=false;
function reset_pswd(){

    
    var rmail= $("#resetmail").val();

        if(rmail == "") {
            $('.response_msg').removeClass('success_msg');
            $('.response_msg').html("*Please enter valid email or mobile");
            $('.response_msg').show();
            $('.response_msg').addClass('error_msg');
            //window.scrollTo(0 ,450), !1;
            return false;
        }
        var showmob = false
        if(!isNaN(rmail)){
          showmob = true

        }
        ajaxBlockUI();
        $.ajax({
              url: '/api/v1/forgot-password/',
              dataType: 'json',
              data: {
              'email': rmail,
              },
              async: false,
              type: "GET",
              success: function(data) {
                    status = data.status;
                    message = data.message;
                    if (status == "Error"){

                        $('.response_msg1').removeClass('success_msg');
                        $('.response_msg1').show();
                        $('.response_msg1').html(message);
                        $('.response_msg1').addClass('error_msg');
                        //window.scrollTo(0 ,450), !1;
                    }
                    if (status == "Success"){
                        if(showmob){
                          $('#formdiv').hide();
                          $('#otppop').show();
                          document.getElementById('modalreset2').reset();
                          $('.response_msg1').addClass('success_msg');
                          $('.response_msg1').show();
                          $('.response_msg1').html(message);
                        }
                    else{
                      $('#formdiv').hide();
                      resendOTP=true;
                      $('.response_msg1').show();
                      $('.response_msg1').addClass('success_msg');
                      $('.response_msg1').html(message);
                      //window.scrollTo(0 ,0), !1;
                    }

                    }
                    ajaxUnBlockUI();
              },
            error: function(edata) {
                    status = edata.responseJSON.status;
                    message = edata.responseJSON.message;
                    if (status == "Error"){

                        $('.response_msg1').removeClass('success_msg');
                        $('.response_msg1').show();
                        $('.response_msg1').html(message);
                        $('.response_msg1').addClass('error_msg');
                        //window.scrollTo(0 ,0), !1;
                    }
                    ajaxUnBlockUI(); 
                  }
        });
    return false;
}




function OTPcheck(){ 
    var rmail= $("#resetmail").val();
    var token = $("#resetotp").val();

        if(rmail == "" || token == "" ) {
            $('.response_msg1').removeClass('success_msg');
            $('.response_msg1').html("*Please enter OTP");
            $('.response_msg1').show();
            $('.response_msg1').addClass('error_msg');
            //window.scrollTo(0 ,450), !1;
            return false;
        }
        $.ajax({
              url: '/api/v1/forgot-password/',
              dataType: 'json',
              data: {
              'mobile': rmail,
              'token': token, 
              },
              async: false,
              type: "POST",
              success: function(data) {
                    status = data.status;
                    message = data.message;
                    usertoken = data.token;
                    if (status == "Error"){

                        $('.response_msg1').removeClass('success_msg');
                        $('.response_msg1').show();
                        $('.response_msg1').html(message);
                        $('.response_msg1').addClass('error_msg');
                        //window.scrollTo(0 ,450), !1;
                    }
                    if (status == "Success"){
                      $('#otppop').hide();
                      $('.response_msg1').show();
                      $('.response_msg1').addClass('success_msg');
                      $('.response_msg1').html(message);
                      $('#cpasspop').show();
                      document.getElementById('modalreset3').reset();
                      $('#ctoken').val(usertoken);
                      //window.scrollTo(0 ,0), !1;

                    }
              },
            error: function(edata) {
                    status = edata.responseJSON.status;
                    message = edata.responseJSON.message;
                    if (status == "Error"){

                        $('.response_msg1').removeClass('success_msg');
                        $('.response_msg1').show();
                        $('.response_msg1').html(message);
                        $('.response_msg1').addClass('error_msg');
                        window.scrollTo(0 ,0), !1;
                    } 
                  }
        });
    return false;
}

function changepass(){ 
    var password = $("#cpassword").val();
    var password1 = $("#cpassword1").val();
    var token = $("#ctoken").val();

        if(password == "" || password1 == "" ) {
            $('.response_msg').removeClass('success_msg');
            $('.response_msg').html("*Please enter valid email or mobile");
            $('.response_msg').show();
            $('.response_msg').addClass('error_msg');
            //window.scrollTo(0 ,450), !1;
            return false;
        }
        if(password != password1) {
            $('.response_msg').removeClass('success_msg');
            $('.response_msg1').html("*The passwords field are not matching");
            $('.response_msg').show();
            $('.response_msg').addClass('error_msg');
            //window.scrollTo(0 ,450), !1;
            return false;
        }
        $.ajax({
              url: '/api/v1/change-password/',
              dataType: 'json',
              data: {
              'password': password,
              'password1': password1,
              'pwd_token': token,
              },
              async: false,
              type: "POST",
              success: function(data) {
                    status = data.status;
                    message = data.message;
                    if (status == "Error"){

                        $('.response_msg1').removeClass('success_msg');
                        $('.response_msg1').show();
                        $('.response_msg1').html(message);
                        $('.response_msg1').addClass('error_msg');
                        //window.scrollTo(0 ,450), !1;
                    }
                    if (status == "Success"){
                      $('#cpasspop').hide();
                      $('.response_msg1').show();
                      $('.response_msg1').addClass('success_msg');
                      $('.response_msg1').html(message);
                      resendOTP=true;
                      //window.scrollTo(0 ,0), !1;

                    }
              },
            error: function(edata) {
                    status = edata.responseJSON.status;
                    message = edata.responseJSON.message;
                    if (status == "Error"){

                        $('.response_msg1').removeClass('success_msg');
                        $('.response_msg1').show();
                        $('.response_msg1').html(message);
                        $('.response_msg1').addClass('error_msg');
                        window.scrollTo(0 ,0), !1;
                    } 
                  }
        });
    return false;
}

//end of forgot password //




//popdisplay//

 function fppage(){
    if(resendOTP){
      $('#reset-password').modal('show');
      $('.response_msg1').hide();
      $('#cpasspop').hide();
        $('#otppop').hide();
      $('#formdiv').show();
      $('#otpsend').g;
        $('#otpresend').show();
        $('.response_msg1').show();
        $('.response_msg1').html("You can request for resend or contact Support if you face problem");
        }
    else{
      $('#reset-password').modal('show');
      $('#cpasspop').hide();
      $('#otppop').hide();
      $('#formdiv').show();
      $('#otpsend').show();
        $('#otpresend').hide();
      $('.response_msg1').hide();
      //window.scrollTo(0 ,0), !1;
    }
    
  
  }
  function showpopform(e){
    
      $(e).modal('show');
      $('#response_msg1').hide();
      $('#response_msg').hide();
      $('.popmessage_div').hide();
      //window.scrollTo(0 ,0), !1;
    
  
  }

//endpopup//