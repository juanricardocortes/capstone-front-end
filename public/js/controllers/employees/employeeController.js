angular.module("app").controller("employeeCtrl", function ($scope, $rootScope, $http) {

    if(localStorage.getItem("token")) {
        $rootScope.isLogged = true;
        initialize();
    } else {
        console.log("BREACH");
        window.location.href = "#!/login";
        $rootScope.isLogged = false;
    }

    function initialize() {
        $scope.allEmployees = [];
        console.log("Employee controller");
        $http({
            url: "http://127.0.0.1:9001/secure-api/getEmployees",
            method: "POST",
            data: {
                token: localStorage.getItem("token")
            }
        }).then(function (response) {
            setTimeout(function () {
                $scope.allEmployees = response.data;
                console.log("Get employees complete: " + JSON.stringify(response.data));
                $scope.$apply();
            });
        });
    }
});