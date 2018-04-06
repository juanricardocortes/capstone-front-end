angular.module("app").controller("addShiftModalCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        initialize: function () {
            console.log("Add shift modal controller");
            
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
            $("#addShift_endTime").val(undefined);
            $("#addShift_endTime").blur();
            $("#addShift_startTime").val(undefined);
            $("#addShift_startTime").blur();
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        }
    }

    functions.initialize();

    $scope.functions = {
        hideAddShiftModal: function () {
            $rootScope.showAddShift = false;
        },
        addShift: function () {
            var errors = 0;
            if ($scope.addShift_startTime === undefined) {
                errors = 1;
            }
            if ($scope.addShift_endTime === undefined) {
                errors = 2;
            }
            if (errors === 0) {
                $http({
                    url: $rootScope.baseURL + "secure-api/addShift",
                    method: "POST",
                    data: {
                        token: localStorage.getItem("token"),
                        projectkey: $rootScope.selectedProject.projectkey,
                        time: $scope.addShift_startTime + " - " + $scope.addShift_endTime
                    }
                }).then(function (response) {
                    $rootScope.showAddShift = false;
                    functions.resetForm();
                    functions.refresh();
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