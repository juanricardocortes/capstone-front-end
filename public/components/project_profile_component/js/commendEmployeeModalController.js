angular.module("app").controller("commendEmployeeModalCtrl", function ($scope, $rootScope, $http, queue) {

    var functions = {
        initialize: function () {

        }
    }

    functions.initialize();

    $scope.functions = {
        hideCommendEmployeeModal: function () {
            $rootScope.showCommendEmployee = false;
        },
        commendEmployee: function () {
            if ($scope.commend_text === undefined) {
                M.toast({
                    html: "<i data-feather='alert-triangle'></i>&nbsp;&nbsp;Please fill out the form.",
                    displayLength: 1500
                });
            } else {
                queue({
                    url: $rootScope.baseURL + "secure-api/flagMember",
                    method: "POST",
                    cache : true,
                    data: {
                        token: localStorage.getItem("token"),
                        signature: JSON.stringify($rootScope.userlogged),
                        user: $rootScope.userlogged,
                        commend: $rootScope.slotToCommend.currentholder,
                        project: $rootScope.selectedProject,
                        remarks: $scope.commend_text
                    }
                }).then(function (response) {
                    $rootScope.showCommendEmployee = false;
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