angular.module("app").controller("addEmployeeModalCtrl", function ($scope, $rootScope, $http, queue) {

    var functions = {
        initialize: function () {
            console.log("Add employee modal controller");
        },
        resetForm: function () {
            $("#addEmployee_employee").val(undefined);
            $("#addEmployee_employee").blur();
        },
        isMember: function (userkey) {
            for(var key in $rootScope.selectedProject.members) {
                if(key === userkey){
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
                if($rootScope.allEmployees[index].files.assigned.isAssigned) {
                    checker += 1;
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
        hideAddEmployeeModal: function () {
            $rootScope.showAddEmployee = false;
        },
        assignEmployee: function (employee) {
            queue({
                url: $rootScope.baseURL + "secure-api/addMembers",
                method: "POST",
                cache : true,
                data: {
                    token: localStorage.getItem("token"),
                    slot: $rootScope.selectedSlot,
                    project: $rootScope.selectedProject,
                    signature: JSON.stringify($rootScope.userlogged),
                    employee: employee,
                    user: $rootScope.userlogged
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