angular.module("app").controller("multipleAddEmployeeCtrl", function ($scope, $rootScope, $http) {

    initialize();

    function initialize() {
        console.log("Multiple add employee controller");
    }

    $scope.hideMultipleAddEmployee= function () {
        $rootScope.showMultipleArchiveEmployeeModal = false;
    }

    $scope.removeEmployee = function (employee) {
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
        refresh();
    }

    $scope.archiveEmployees = function () {
        alert(JSON.stringify($rootScope.multipleArchiveEmployee));
        for (var outerindex = 0; outerindex < $rootScope.multipleArchiveEmployee.length; outerindex++) {
            for (var index = 0; index < $rootScope.allEmployees.length; index++) {
                if ($rootScope.multipleArchiveEmployee[outerindex].userkey === $rootScope.allEmployees[index].userkey &&
                    $rootScope.allEmployees[index].isArchived === $rootScope.archiveEmployeeToggle) {
                    $rootScope.multipleArchiveEmployee.splice($rootScope.multipleArchiveEmployee.indexOf($rootScope.allEmployees[index]), 1);
                    $rootScope.allEmployees[index].isArchived = !($rootScope.allEmployees[index].isArchived);
                    $rootScope.allEmployees[index].archive = false;
                    refresh();
                }
            }
        }
        $http({
            url: "http://127.0.0.1:9001/secure-api/archiveEmployee",
            method: "POST",
            data: {
                employees: $rootScope.multipleArchiveEmployee,
                token: localStorage.getItem("token")
            }
        }).then(function (response) {
            $rootScope.showMultipleAddEmployeeModal = false;
            refresh();
            Materialize.toast(response.data.message, 4000);
        });

        $rootScope.unarchiveAllEmployees = false;
        $rootScope.archiveAllEmployees = false;
        event.stopPropagation();
    }


    function refresh() {
        setTimeout(function () {
            $scope.$apply();
        });
    }
})