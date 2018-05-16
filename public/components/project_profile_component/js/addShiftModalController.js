angular.module("app").controller("addShiftModalCtrl", function ($scope, $rootScope, $http, queue) {

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
            // $("#addShift_endTime").val(undefined);
            // $("#addShift_endTime").blur();
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
        startLocalJS: function () {
            console.log("STARTING");
            $(document).ready(function () {
                $('.timepicker').pickatime();
            });
        },
        hideAddShiftModal: function () {
            $rootScope.showAddShift = false;
        },
        addShift: function () {
            var errors = 0;
            if ($scope.addShift_startTime === undefined) {
                errors = 1;
            }
            if (errors === 0) {
                var startTime = moment($scope.addShift_startTime, "h:mm a");
                var endTime = moment(startTime).add(9, 'hours');
                var startMoment = moment(startTime).format("h:mm a");
                var endMoment = moment(endTime).format("h:mm a");
                queue({
                    url: $rootScope.baseURL + "secure-api/addShift",
                    method: "POST",
                    cache : true,
                    data: {
                        signature: JSON.stringify($rootScope.userlogged),
                        token: localStorage.getItem("token"),
                        project: $rootScope.selectedProject,
                        employee: $rootScope.userlogged,
                        time: startMoment + " - " + endMoment
                    }
                }).then(function (response) {
                    $rootScope.showAddShift = false;
                    functions.resetForm();
                    functions.refresh();
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