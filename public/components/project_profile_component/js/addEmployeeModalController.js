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
                    slotkey: $rootScope.selectedSlot.slotkey,
                    projectkey: $rootScope.selectedProject.projectkey,
                    userkey: employee.userkey,
                    dates: $rootScope.selectedProject.schedule.dates
                }
            }).then(function (response) {
                $rootScope.showAddEmployee = false;
                swal({
                    type: response.data.success,
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1000
                });
            });
        }
    }
});