angular.module("app").controller("employeeCtrl", function ($scope, $rootScope, $http) {

       onInit();

    function onInit() {
        $rootScope.isLogged = true;
        $http({
            url: $rootScope.baseURL + "api/validateToken",
            method: "POST",
            data: {
                token: localStorage.getItem("token")
            }
        }).then(function (response) {
            if (response.data.valid) {
                onCreate();
            } else {
                console.log("BREACH");
                window.location.href = "#!/login";
                $rootScope.isLogged = false;
            }
        });
    }

    function onCreate() {
        initializeJavascript();
        getActiveSideBarLink();
        getInitialValues();
        console.log("Employee controller");
    }

     function initializeJavascript() {
        $('.collapsible').collapsible();
    }

    function getActiveSideBarLink() {
        $rootScope.dashboardactive = false;
        $rootScope.employeeactive = true;
        $rootScope.projectsactive = false;
        $rootScope.applicantsactive = false;
        $rootScope.leavesactive = false;
        $rootScope.profileactive = false;
    }

    function getInitialValues() {
        $scope.employeeTableSorter = "userkey";
        $rootScope.multipleArchiveEmployee = [];
        $rootScope.selectAllEmployees = false;
        $rootScope.archiveEmployeeModalText = "Archive employees?"
        $scope.employeesSwitchText = "Active Employees";
        $scope.archiveButtonText = "Archive";
        $scope.employeeArchiveToggle = false;
        $rootScope.currentPage = "Weltanchaung > Employees"

    }

      $scope.showhideArchive = function () {
        $scope.activateToggle = $scope.employeeArchiveToggle;
    }

     $scope.toggleEmployeeArchive = function () {
        if ($scope.employeeArchiveToggle) {
            $scope.employeesSwitchText = "Archived Employees";
            $scope.archiveButtonText = "Unarchive";
            $rootScope.archiveEmployeeModalText = "Unarchive employees?"


        } else {
            $scope.employeesSwitchText = "Active Employees";
            $scope.archiveButtonText = "Archive";
            $rootScope.archiveEmployeeModalText = "Archive employees?"
        }
    }

    $scope.archiveEmployee = function (employee, event) {
    for (var index = 0; index < $rootScope.allEmployees.length; index++) {
        if (employee.userkey === $rootScope.allEmployees[index].userkey) {
            $rootScope.allEmployees[index].isArchived = !($rootScope.allEmployees[index].isArchived);
            refresh();
        }
    }
    $http({
        url: $rootScope.baseURL + "secure-api/archiveEmployee",
        method: "POST",
        data: {
            employees: [employee],
            token: localStorage.getItem("token")
        }
    }).then(function (response) {
        if (response.data.message === "Success") {
            var message;
            if(employee.isArchived) { 
                message = " archived";
            } else {
                message = " unarchived";
            }
            swal({
                type: 'success',
                title: employee.files.firstname + message,
                showConfirmButton: false,
                timer: 1000
            });
        }
            // Materialize.toast(response.data.message, 4000);
        });
    event.stopPropagation();
}

    $scope.showArchiveEmployeeModal = function (employee) {
        $rootScope.archiveEmployeeToggle = $scope.employeeArchiveToggle;
        $rootScope.showMultipleArchiveEmployeeModal = true;
    }

    $scope.addEmployeeToMultipleArchive = function (employee) {
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
    }

     $scope.archiveAll = function () {
        var toggle;
        if ($rootScope.archiveAllEmployees) {
            toggle = true;
        } else {
            toggle = false;
        }
        for (var index = 0; index < $rootScope.allEmployees.length; index++) {
            if ($rootScope.allEmployees[index].isArchived === $scope.employeeArchiveToggle) {
                $rootScope.allEmployees[index].archive = toggle;
                if ($rootScope.allEmployees[index].archive && !(containsObject($rootScope.allEmployees[index], $rootScope.multipleArchiveEmployee))) {
                    $rootScope.multipleArchiveEmployee.push($rootScope.allEmployees[index]);
                } else if (!$rootScope.allEmployees[index].archive) {
                    $rootScope.multipleArchiveEmployee.splice($rootScope.multipleArchiveEmployee.indexOf($rootScope.allEmployees[index]), 1);
                }
            }
        }
    }

    $scope.unarchiveAll = function () {
        var toggle;
        if ($rootScope.unarchiveAllEmployees) {
            toggle = true;
        } else {
            toggle = false;
        }
        for (var index = 0; index < $rootScope.allEmployees.length; index++) {
            if ($rootScope.allEmployees[index].isArchived === $scope.employeeArchiveToggle) {
                $rootScope.allEmployees[index].archive = toggle;
                if ($rootScope.allEmployees[index].archive && !(containsObject($rootScope.allEmployees[index], $rootScope.multipleArchiveEmployee))) {
                    $rootScope.multipleArchiveEmployee.push($rootScope.allEmployees[index]);
                } else if (!$rootScope.allEmployees[index].archive) {
                    $rootScope.multipleArchiveEmployee.splice($rootScope.multipleArchiveEmployee.indexOf($rootScope.allEmployees[index]), 1);
                }
            }
        }
    }

     $scope.showAddEmployeeModal = function () {
        $rootScope.showAddEmployee = true;
    }

    function refresh() {
        setTimeout(function () {
            $scope.$apply();
        });
    }

     function containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
                return true;
            }
        }
        return false;
    }

});