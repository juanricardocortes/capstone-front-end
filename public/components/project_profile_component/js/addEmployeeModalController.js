angular.module("app").controller("addEmployeeModalCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        initialize: function () {
            console.log("Add employee modal controller");
        },
        resetForm: function () {
            $("#addEmployee_employee").val(undefined);
            $("#addEmployee_employee").blur();
        }
    }

    functions.initialize();

    $scope.functions = {
        hideAddEmployeeModal: function () {
            $rootScope.showAddEmployee = false;
        },
        assignEmployee: function (employee) {
            $http({
                url: $rootScope.baseURL + "secure-api/addMembers",
                method: "POST",
                data: {
                    token: localStorage.getItem("token"),
                    slot: $rootScope.selectedSlot,
                    project: $rootScope.selectedProject,
                    employee: employee,
                    user:  $rootScope.userlogged
                }
            }).then(function (response) {
                $rootScope.showAddEmployee = false;
                swal({
                    type: response.data.success,
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            });
        }
    }
});