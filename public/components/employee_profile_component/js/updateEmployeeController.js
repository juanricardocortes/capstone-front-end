angular.module("app").controller("updateEmployeeCtrl", function ($scope, $rootScope, $http) {

    $scope.functions = {
        hideUpdateEmployeeModal: function () {
            $rootScope.showUpdateEmployeeModal = false;
        },
        updateEmployee: function () {
            $http({
                url: $rootScope.baseURL + "secure-api/updateEmployee",
                method: "POST",
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