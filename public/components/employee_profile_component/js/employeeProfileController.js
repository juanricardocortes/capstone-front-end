angular.module("app").controller("employeeProfileCtrl", function ($scope, $rootScope, $http) {
    var functions = {
        onInit: function () {
            $rootScope.isLogged = true;
            $http({
                url: $rootScope.baseURL + "api/validateToken",
                method: "POST",
                data: {
                    token: localStorage.getItem("token")
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
            if (functions.checkIfSelected()) {
                functions.getInitialValues();
                functions.getActiveSideBarLink();
            } else {
                window.location.href = "#!/employees"
            }
            console.log("Employee profile controller");
        },
        getInitialValues: function () {
            $rootScope.selectedEmployee = JSON.parse(localStorage.getItem("selectedEmployee"));
        },
        getActiveSideBarLink: function () {
            $rootScope.dashboardactive = false;
            $rootScope.employeeactive = true;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
        },
        checkIfSelected: function () {
            if (localStorage.getItem("selectedEmployee")) {
                return true;
            } else {
                return false;
            }
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        }
    }

    functions.onInit();

    $scope.functions = {
        displayInformation: function (title, message) {
            swal(title, message);
        }
    }
});