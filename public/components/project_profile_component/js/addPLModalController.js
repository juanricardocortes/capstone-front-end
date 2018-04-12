angular.module("app").controller("addPLModalCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        initialize: function () {
            console.log("Add PL modal controller");
            console.log(moment().format());
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
        },
        isMember: function (userkey) {
            for (var key in $rootScope.selectedProject.members) {
                if (key === userkey) {
                    return true;
                }
            }
            return false;
        }
    }

    functions.initialize();

    $scope.functions = {
        checkIfAllDeployed: function () {
            var checker = 0;
            for (var index = 0; index < $rootScope.allEmployees.length; index++) {
                for (project in $rootScope.allEmployees[index].files.projects) {
                    if (moment(moment()).isSameOrAfter($rootScope.allEmployees[index].files.projects[project].dates.startDate) &&
                        moment(moment()).isSameOrBefore($rootScope.allEmployees[index].files.projects[project].dates.endDate)) {
                        checker += 1;
                        break;
                    }
                }
            }
            if (checker === $rootScope.allEmployees.length) {
                return true;
            } else {
                return false;
            }
        },
        checkIfHasProject: function (employee) {
            var hasProject = false;
            for (project in employee.files.projects) {
                try {
                    if (moment($rootScope.selectedProject.schedule.dates.startDate).isSameOrAfter(employee.files.projects[project].dates.startDate) &&
                        moment($rootScope.selectedProject.schedule.dates.startDate).isSameOrBefore(employee.files.projects[project].dates.endDate) ||
                        moment($rootScope.selectedProject.schedule.dates.endDate).isSameOrAfter(employee.files.projects[project].dates.startDate) &&
                        moment($rootScope.selectedProject.schedule.dates.endDate).isSameOrBefore(employee.files.projects[project].dates.endDate) ||
                        $rootScope.selectedProject.projectlead.userkey === employee.userkey ||
                        functions.isMember(employee.userkey)) {
                        hasProject = true;
                        break;
                    }
                } catch (err) {
                    var hasProject = false;
                }
            }
            return hasProject;
        },
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
                        employee: employee,
                        project: $rootScope.selectedProject
                    }
                }).then(function (response) {
                    $rootScope.showAddPL = false;
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