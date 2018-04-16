angular.module("app").controller("addRequestCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        initialize: function () {
            console.log("Add Request controller");
            functions.getInitialValues();
        },
        getInitialValues: function () {
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
            $("#addRequest_type").val(undefined);
            $("#addRequest_type").blur();
            $("#addRequest_reason").val(undefined);
            $("#addRequest_reason").blur();
            $("#addRequest_startDate").val(undefined);
            $("#addRequest_startDate").blur();
            $("#addRequest_endDate").val(undefined);
            $("#addRequest_endDate").blur();
        },
        resetMinMax: function () {
            $('#addRequest_startDate').pickadate('picker').set('min', moment());
            $('#addRequest_endDate').pickadate('picker').set('min', moment());
            $('#addRequest_startDate').pickadate('picker').set('max', false);
            $('#addRequest_endDate').pickadate('picker').set('max', false);
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
                format: 'yyyy-mm-dd',
                selectYears: 15,
                min: moment(),
                closeOnSelect: true
            });
            $('.datepicker').on('change', function () {
                if ($(this).attr('id') === 'addRequest_startDate') {
                    if($(this).val()===""){
                        $('#addRequest_endDate').pickadate('picker').set('min', moment());
                    } else {
                        $('#addRequest_endDate').pickadate('picker').set('min', $(this).val());
                    }
                }
                if ($(this).attr('id') === 'addRequest_endDate') {
                    $('#addRequest_startDate').pickadate('picker').set('max', $(this).val());
                }
            });
            return true;
        },
        hideAddRequestModal: function () {
            $rootScope.requestsShown = false;
        },
        addRequest: function () {
            var errors = 0;
            if ($scope.addRequest_type === null || 
                $scope.addRequest_startDate === undefined ||
                $scope.addRequest_endDate === undefined ||
                $scope.addRequest_reason === undefined){
                errors = 1;
            }
            if (errors === 0) {
                $http({
                    url: $rootScope.baseURL + "secure-api/requestLeave",
                    method: "POST",
                    data: {
                        signature: JSON.stringify($rootScope.userlogged),
                        token: localStorage.getItem("token"),
                        employee: $rootScope.userlogged,
                        projects: $rootScope.allProjects,
                        leaves: $rootScope.allLeaves,
                        request: {
                            startDate: $scope.addRequest_startDate,
                            endDate: $scope.addRequest_endDate,
                            type: $scope.addRequest_type,
                            reason: $scope.addRequest_reason,
                        }
                    }
                }).then(function (response) {
                    $rootScope.requestsShown = false;
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