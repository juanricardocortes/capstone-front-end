angular.module("app").controller("addProjectCtrl", function ($scope, $rootScope, $http, queue) {

    var functions = {
        initialize: function () {
            console.log("Add project controller");
            functions.getInitialValues();
        },
        getInitialValues: function () {
            // alert(moment());
            $scope.startDateSet = true;
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
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        },
        resetForm: function () {
            $("#addProject_name").val(undefined);
            $("#addProject_name").blur();
            $("#addProject_startDate").val(undefined);
            $("#addProject_startDate").blur();
        },
        resetMinMax: function () {
            $('#addProject_startDate').pickadate('picker').set('min', moment());
        }
    }

    functions.initialize();

    $scope.functions = {
        getMinimumStart: function () {
            return moment();
        },
        startLocalJS: function () {
            $('.datepicker').pickadate({
                selectMonths: true, // Creates a dropdown to control month
                selectYears: 15,
                format: 'yyyy-mm-dd',
                min: moment(),
                closeOnSelect: 
                true
            });
            return true;
        },
        hideAddProjectModal: function () {
            $rootScope.showAddProject = false;
        },
        addProject: function () {
            var errors = 0;
            if ($scope.addProject_name === undefined ||
                $scope.addProject_startDate === undefined) {
                errors = 1;
            }
            if (errors === 0) {
                queue({
                    url: $rootScope.baseURL + "secure-api/addProject",
                    method: "POST",
                    cache : true,
                    data: {
                        signature: JSON.stringify($rootScope.userlogged),
                        token: localStorage.getItem("token"),
                        project: {
                            name: $scope.addProject_name
                        },
                        dates: {
                            startDate: $scope.addProject_startDate
                        }
                    }
                }).then(function (response) {
                    $rootScope.showAddProject = false;
                    functions.resetForm();
                    functions.resetMinMax();
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