angular.module("app").controller("forgotPasswordCtrl", function ($scope, $rootScope, $http) {
    var functions = {
        initialize: function () {
            functions.getInitialValues();
        },
        getInitialValues: function () {

        },
        resetForm: function() {
            $("#forgotPass_email").val(undefined);
            $("#forgotPass_email").blur();
        }
    }

    functions.initialize();

    $scope.functions = {
        hideForgotPasswordModal: function () {
            $rootScope.showForgotPassword = false;
        },
        sendPassword: function () {
            if ($scope.forgotPass_email === undefined) {
                M.toast({
                    html: "<i class='small material-icons'>priority_high</i>Please fill out the form.",
                    displayLength: 1000
                });
            } else {
                $http({
                    url: $rootScope.baseURL + "api/forgotPassword",
                    method: "POST",
                    data: {
                        email:$scope.forgotPass_email
                    }
                }).then(function (response) {
                    $rootScope.showForgotPassword = false;
                    functions.resetForm();
                    swal({
                        type: response.data.success,
                        title: response.data.message,
                        text: response.data.text,
                        showConfirmButton: false,
                        timer: 2500 
                    });
                })
            }
        }
    }
});