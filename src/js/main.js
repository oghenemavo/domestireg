// import { UserAuth } from "./modules/user_auth";

$(function() {


    $('#signup').validate({
        rules: {
            email: {
                required: {
                    depends: function() {
                        $(this).val($.trim($(this).val()));
                        return true;
                    }
                },
                email: true,
            },
            firstname: {
                required: {
                    depends: function() {
                        $(this).val($.trim($(this).val()));
                        return true;
                    }
                },
                lettersonly: true,
            },
            lastname: {
                required: {
                    depends: function() {
                        $(this).val($.trim($(this).val()));
                        return true;
                    }
                },
                lettersonly: true,
            },
            phone: {
                required: {
                    depends: function() {
                        $(this).val($.trim($(this).val()));
                        return true;
                    }
                },
                minlength: 7,
                integer: true,
            },
            address: {
                required: true
            }
        },
        submitHandler: function(form) {
            $(form).find('button').attr('disabled', true)
            $(form).ajaxSubmit(options);
        }
    });

    const options = {
        type: 'POST',
        url: "http://dregstage.herokuapp.com/api/v1/user/sign_up/",
        data: $(this).serialize(),
        dataType: 'json',
        clearForm: null,
        success: function(response) {
            console.log(response)
            // toastr.clear();
            // toastr.options = {
            //     "timeOut": "50000",
            // }
            // NioApp.Toast('User Created Successfully!', 'success', {position: 'top-left'});
            // $('#users_table').Datatable().ajax().reload();
            // setTimeout( () =>  window.location.replace(`${window.location.origin}${window.location.pathname}`), 3000);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status)
            console.log(XMLHttpRequest.statusText)
            console.log(textStatus)
            console.log(errorThrown)

            let errors = XMLHttpRequest.responseJSON;
            console.log(errors)
            // set up alert
    
            // $(user).find('button').attr('disabled', false);
    
            // // display toast alert
            // toastr.clear();
            // toastr.options = {
            //     "timeOut": "7000",
            // }
            // NioApp.Toast('Unable to process request now.', 'error', {position: 'top-right'});
        }
    };


    // $('#signup').on('submit', function(e) {
    //     e.preventDefault();


    //     $.post("", 
    //         {
    //             "email": "alabi@gmail.com",
    //             "firstname": "Emmanuel",
    //             "lastname": "doe",
    //             "phone": "08113921092",
    //             "address": "Lagos Island"
    //         },
    //         function (data, textStatus, jqXHR) {
    //             console.log(response)
    //         },
    //         "json"
    //     );
    // });
});
