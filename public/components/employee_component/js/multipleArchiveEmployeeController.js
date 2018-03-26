angular.module("app").controller("multipleAddEmployeeCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        initialize: function () {
            console.log("Multiple add employee controller");
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        }
    }

    functions.initialize();

    $scope.functions = {
        hideMultipleArchiveEmployee: function () {
            $rootScope.showMultipleArchiveEmployeeModal = false;
        },
        removeEmployee: function (employee) {
            $rootScope.multipleArchiveEmployee.splice($rootScope.multipleArchiveEmployee.indexOf(employee), 1);
            for (var index = 0; index < $rootScope.allEmployees.length; index++) {
                if (employee.userkey === $rootScope.allEmployees[index].userkey) {
                    $rootScope.allEmployees[index].archive = false;
                    if ($rootScope.allEmployees[index].isArchived) {
                        $rootScope.unarchiveAllEmployees = false;
                    } else {
                        $rootScope.archiveAllEmployees = false;
                    }
                }
            }
            functions.refresh();
        },
        archiveEmployees: function () {
            for (var outerindex = 0; outerindex < $rootScope.multipleArchiveEmployee.length; outerindex++) {
                for (var index = 0; index < $rootScope.allEmployees.length; index++) {
                    if ($rootScope.multipleArchiveEmployee[outerindex].userkey === $rootScope.allEmployees[index].userkey &&
                        $rootScope.allEmployees[index].isArchived === $rootScope.archiveEmployeeToggle) {
                        // $rootScope.multipleArchiveEmployee.splice($rootScope.multipleArchiveEmployee.indexOf($rootScope.allEmployees[index]), 1);
                        $rootScope.allEmployees[index].isArchived = !($rootScope.allEmployees[index].isArchived);
                        $rootScope.allEmployees[index].archive = false;
                        functions.refresh();
                    }
                }
            }
            $http({
                url: $rootScope.baseURL + "secure-api/archiveEmployee",
                method: "POST",
                data: {
                    employees: $rootScope.multipleArchiveEmployee,
                    token: localStorage.getItem("token")
                }
            }).then(function (response) {
                $rootScope.showMultipleArchiveEmployeeModal = false;
                functions.refresh();
                M.toast({
                    html: response.data.message,
                    displayLength: 2500
                });
            });
            $rootScope.unarchiveAllEmployees = false;
            $rootScope.archiveAllEmployees = false;
            $rootScope.multipleArchiveEmployee = [];
            event.stopPropagation();
        }
    }
});