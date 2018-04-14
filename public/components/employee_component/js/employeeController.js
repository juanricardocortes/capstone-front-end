angular.module("app").controller("employeeCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        onInit: function () {
            $rootScope.isLogged = true;
            $http({
                url: $rootScope.baseURL + "api/validateToken",
                method: "POST",
                data: {
                    token: localStorage.getItem("token"),
                    signature: JSON.stringify($rootScope.userlogged)
                }
            }).then(function (response) {
                if (response.data.valid) {
                    functions.onCreate();
                } else {
                    console.log("BREACH");
                    window.location.href = "#!/login";
                    $rootScope.isLogged = false;
                }
            });
        },
        onCreate: function () {
            functions.getActiveSideBarLink();
            functions.getInitialValues();
            console.log("Employee controller");
        },
        getActiveSideBarLink: function () {
            $rootScope.dashboardactive = false;
            $rootScope.employeeactive = true;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
        },
        getInitialValues: function () {
            $scope.employeeTableSorter = null;
            $rootScope.multipleArchiveEmployee = [];
            $rootScope.archiveEmployeeToggle = false;
            $rootScope.currentPage = "Weltanchaung > Employees"
            $rootScope.employeeTableSwitch = "Active employees"
            $rootScope.archiveEmployeeText = "Archive"
            $rootScope.archiveEmployeeModalText = "Archive employees?"
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        },
        containsObject: function (obj, list) {
            var i;
            for (i = 0; i < list.length; i++) {
                if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
                    return true;
                }
            }
            return false;
        }
    }

    functions.onInit();

    $scope.functions = {
        toggleArchiveEmployees: function () {
            if ($rootScope.archiveEmployeeToggle) {
                $rootScope.employeeTableSwitch = "Archived employees"
                $rootScope.archiveEmployeeText = "Unarchive"
                $rootScope.archiveEmployeeModalText = "Unarchive employees?"
            } else {
                $rootScope.employeeTableSwitch = "Active employees"
                $rootScope.archiveEmployeeText = "Archive"
                $rootScope.archiveEmployeeModalText = "Archive employees?"
            }
        },
        gotoEmployeeProfile: function (employee) {
            $rootScope.selectedEmployee = employee;
            localStorage.setItem("selectedEmployee", JSON.stringify(employee));
            window.location.href = "#!/employees/profile";
        },
        showAddEmployeeModal: function () {
            $rootScope.showAddEmployee = true;
        },
        showArchiveEmployeeModal: function () {
            $rootScope.showMultipleArchiveEmployeeModal = true;
        },
        archiveEmployee: function (employee, event) {
            employee.isArchived = !employee.isArchived;
            functions.refresh();
            $http({
                url: $rootScope.baseURL + "secure-api/archiveEmployee",
                method: "POST",
                data: {
                    employees: [employee],
                    signature: JSON.stringify($rootScope.userlogged),
                    token: localStorage.getItem("token")
                }
            }).then(function (response) {
                if (response.data.message === "Success") {
                    var message;
                    if (employee.isArchived) {
                        message = " archived";
                    } else {
                        message = " unarchived";
                    }
                    swal({
                        type: 'success',
                        title: employee.files.lastname + message,
                        showConfirmButton: false,
                        timer: 1000
                    });
                }
            });
            event.stopPropagation();
        },
        addEmployeeToMultipleArchive: function (employee) {
            if (employee.archive) {
                $rootScope.multipleArchiveEmployee.push(employee);
            } else {
                $rootScope.multipleArchiveEmployee.splice($rootScope.multipleArchiveEmployee.indexOf(employee), 1);
                if (employee.isArchived) {
                    $rootScope.unarchiveAllEmployees = false;
                } else {
                    $rootScope.archiveAllEmployees = false;
                }
            }
        },
        archiveAll: function () {
            var toggle;
            if ($rootScope.archiveAllEmployees) {
                toggle = true;
            } else {
                toggle = false;
            }
            for (var index = 0; index < $rootScope.allEmployees.length; index++) {
                if ($rootScope.allEmployees[index].isArchived === $rootScope.archiveEmployeeToggle) {
                    $rootScope.allEmployees[index].archive = toggle;
                    if ($rootScope.allEmployees[index].archive && !($rootScope.allEmployees[index].hired) && !(functions.containsObject($rootScope.allEmployees[index], $rootScope.multipleArchiveEmployee))) {
                        $rootScope.multipleArchiveEmployee.push($rootScope.allEmployees[index]);
                    } else if (!$rootScope.allEmployees[index].archive && !($rootScope.allEmployees[index].hired)) {
                        $rootScope.multipleArchiveEmployee.splice($rootScope.multipleArchiveEmployee.indexOf($rootScope.allEmployees[index]), 1);
                    }
                }
            }
        },
        unarchiveAll: function () {
            var toggle;
            if ($rootScope.unarchiveAllEmployees) {
                toggle = true;
            } else {
                toggle = false;
            }
            for (var index = 0; index < $rootScope.allEmployees.length; index++) {
                if ($rootScope.allEmployees[index].isArchived === $rootScope.archiveEmployeeToggle) {
                    $rootScope.allEmployees[index].archive = toggle;
                    if ($rootScope.allEmployees[index].archive && !(functions.containsObject($rootScope.allEmployees[index], $rootScope.multipleArchiveEmployee))) {
                        $rootScope.multipleArchiveEmployee.push($rootScope.allEmployees[index]);
                    } else if (!$rootScope.allEmployees[index].archive) {
                        $rootScope.multipleArchiveEmployee.splice($rootScope.multipleArchiveEmployee.indexOf($rootScope.allEmployees[index]), 1);
                    }
                }
            }
        },
        sortByKey: function () {
            $scope.employeeTableSorter = "userkey";
        },
        sortByEmail: function () {
            $scope.employeeTableSorter = "email";
        },
        sortByLastname: function () {
            $scope.employeeTableSorter = "files.lastname";
        },
        sortByFirstname: function () {
            $scope.employeeTableSorter = "files.firstname";
        }
    }
});