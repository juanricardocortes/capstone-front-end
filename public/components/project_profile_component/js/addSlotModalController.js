angular.module("app").controller("addSlotModalCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        initialize: function () {
            console.log("Add slot modal controller");
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
            $("#addSlot_position").val(undefined);
            $("#addSlot_position").blur();
            $("#addSlot_shift").val(undefined);
            $("#addSlot_shift").blur();
        }
    }

    functions.initialize();

    $scope.functions = {
        hideAddSlotModal: function () {
            $rootScope.showAddSlot = false;
        },
        addSlot: function () {
            var errors = 0;
            if ($scope.addSlot_position === undefined ||
                $scope.addSlot_shift === undefined) {
                errors = 1;
            }
            if (errors === 0) {
                $http({
                    url: $rootScope.baseURL + "secure-api/addSlot",
                    method: "POST",
                    data: {
                        token: localStorage.getItem("token"),
                        project: $rootScope.selectedProject,
                        employee: $rootScope.userlogged,
                        shift: JSON.parse($scope.addSlot_shift),
                        role: $scope.addSlot_position
                    }
                }).then(function (response) {
                    $rootScope.showAddSlot = false;
                    functions.resetForm();
                    swal({
                        type: response.data.success,
                        title: response.data.message,
                        showConfirmButton: false,
                        timer: 1500
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