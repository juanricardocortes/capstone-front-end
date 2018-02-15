angular.module("app").controller("mainpageCtrl", function ($scope, $rootScope, $http) {

    initialize();

    function initialize() {
        console.log("Main page controller");
    }

    $scope.gotoDashboard = function () {
        window.location.href = "#!/dashboard"
    }

    $scope.gotoEmployees = function () {
        window.location.href = "#!/employees"
    }

    $scope.gotoProjects = function () {
        window.location.href = "#!/projects"
    }

    $scope.gotoApplicants = function () {
        window.location.href = "#!/applicants"
    }

    $scope.gotoLeaveRequests = function () {
        window.location.href = "#!/leaverequests"
    }

    $scope.gotoProfile = function () {
        window.location.href = "#!/profile"
    }

    $scope.logout = function () {
        window.location.href = "#!/login"
        $rootScope.token = undefined;
        $rootScope.isLogged = false;
        localStorage.removeItem("token");
        firebase.auth().signOut().then(function () {
            // invalidate token
        }).catch(function (error) {});
    }
});