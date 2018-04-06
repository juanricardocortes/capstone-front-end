angular.module("app").controller("addPLModalCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        initialize: function () {
            console.log("Add PL modal controller");
        },
        checkEmail: function (obj, list) {
            var i;
            for (i = 0; i < list.length; i++) {
                if (obj === list[i].email) {
                    return true;
                }
            }
            return false;
        },
        resetForm: function () {
            $("#addPL_employee").val(undefined);
            $("#addPL_employee").blur();
        }
    }

    functions.initialize();

    $scope.functions = {
        hideAddPLModal: function () {
            $rootScope.showAddPL = false;
        },
        makeProjectLead: function (employee) {
            var errors = 0;
            if (employee === undefined) {
                errors = 1;
            }
            if (errors === 0) {
                $http({
                    url: $rootScope.baseURL + "secure-api/updateProjectLead",
                    method: "POST",
                    data: {
                        token: localStorage.getItem("token"),
                        projectkey: $rootScope.selectedProject.projectkey,
                        employee: employee
                    }
                }).then(function (response) {
                    $rootScope.showAddPL = false;
                    functions.resetForm();
                    swal({
                        type: response.data.success,
                        title: response.data.message,
                        showConfirmButton: false,
                        timer: 1000
                    });
                });
            } else {
                M.toast({
                    html: "<i data-feather='alert-triangle'></i>&nbsp;&nbsp;Please fill out the form.",
                    displayLength: 2500
                });
            }
        }
    }
});