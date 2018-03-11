angular.module("app").controller("mainpageCtrl", function ($scope, $rootScope, $http) {

    initialize();

    function initialize() {
        console.log("Main page controller");
        feather.replace();
    }

    $scope.gotoDashboard = function () {
        $rootScope.dashboardactive = true;
        $rootScope.employeeactive = false;
        $rootScope.projectsactive = false;
        $rootScope.applicantsactive = false;
        $rootScope.leavesactive = false;
        $rootScope.profileactive = false;
        window.location.href = "#!/dashboard"
    }

    $scope.gotoEmployees = function () {
        $rootScope.dashboardactive = false;
        $rootScope.employeeactive = true;
        $rootScope.projectsactive = false;
        $rootScope.applicantsactive = false;
        $rootScope.leavesactive = false;
        $rootScope.profileactive = false;
        window.location.href = "#!/employees"
    }

    $scope.gotoProjects = function () {
        $rootScope.dashboardactive = false;
        $rootScope.employeeactive = false;
        $rootScope.projectsactive = true;
        $rootScope.applicantsactive = false;
        $rootScope.leavesactive = false;
        $rootScope.profileactive = false;
        window.location.href = "#!/projects"
    }

    $scope.gotoApplicants = function () {
        $rootScope.dashboardactive = false;
        $rootScope.employeeactive = false;
        $rootScope.projectsactive = false;
        $rootScope.applicantsactive = true;
        $rootScope.leavesactive = false;
        $rootScope.profileactive = false;
        window.location.href = "#!/applicants"
    }

    $scope.gotoLeaveRequests = function () {
        $rootScope.dashboardactive = false;
        $rootScope.employeeactive = false;
        $rootScope.projectsactive = false;
        $rootScope.applicantsactive = false;
        $rootScope.leavesactive = true;
        $rootScope.profileactive = false;
        window.location.href = "#!/leaverequests"
    }

    $scope.gotoProfile = function () {
        $rootScope.dashboardactive = false;
        $rootScope.employeeactive = false;
        $rootScope.projectsactive = false;
        $rootScope.applicantsactive = false;
        $rootScope.leavesactive = false;
        $rootScope.profileactive = true;
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