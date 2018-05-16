angular.module("app").controller("changePassCtrl", function ($scope, $rootScope, $http, queue) {

    var functions = {
        resetForm: function () {
            $("#oldPassword").val(undefined);
            $("#oldPassword").blur();
            $("#newPassword").val(undefined);
            $("#newPassword").blur();
            $("#cnewPassword").val(undefined);
            $("#cnewPassword").blur();
        }
    }

    $scope.functions = {
        hideChangePassModal: function () {
            $rootScope.showChangePass = false;
        },
        changePassword: function () {
            if ($scope.oldPassword === undefined ||
                $scope.newPassword === undefined ||
                $scope.cnewPassword === undefined) {
                M.toast({
                    html: "<i class='small material-icons'>priority_high</i>Please fill out the form.",
                    displayLength: 2500
                });
            } else if ($scope.newPassword != $scope.cnewPassword) {
                M.toast({
                    html: "<i class='small material-icons'>priority_high</i>New password does not match.",
                    displayLength: 2500
                });
            } else if ($scope.oldPassword != $rootScope.userlogged.password) {
                M.toast({
                    html: "<i class='small material-icons'>priority_high</i>Old password incorrect.",
                    displayLength: 2500
                });
            } else {
                queue({
                    url: $rootScope.baseURL + "secure-api/changePassword",
                    method: "POST",
                    cache : true,
                    data: {
                        token: localStorage.getItem("token"),
                        signature: JSON.stringify($rootScope.userlogged),
                        user: $rootScope.userlogged,
                        oldPassword: $scope.oldPassword,
                        newPassword: $scope.newPassword,
                        cnewPassword: $scope.cnewPassword,
                        firebaseUser: $rootScope.firebaseuser
                    }
                }).then(function (response) {
                    functions.resetForm();
                    $rootScope.showChangePass = false;
                    swal({
                        type: response.data.success,
                        title: response.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                })
            }
        }
    }
});