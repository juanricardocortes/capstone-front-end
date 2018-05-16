angular.module("app").controller("updateEmployeeCtrl", function ($scope, $rootScope, $http, queue) {

    $scope.functions = {
        hideUpdateEmployeeModal: function () {
            $rootScope.showUpdateEmployeeModal = false;
        },
        updateEmployee: function () {
            queue({
                url: $rootScope.baseURL + "secure-api/updateEmployee",
                method: "POST",
                cache : true,
                data: {
                    token: localStorage.getItem("token"),
                    signature: JSON.stringify($rootScope.userlogged),
                    employee: $rootScope.selectedEmployee
                }
            }).then(function (response) {
                $rootScope.showUpdateEmployeeModal = false;
                swal({
                    type: response.data.success,
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            });
        }
    }
})