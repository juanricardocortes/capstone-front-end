angular.module("app").controller("applicantProfileCtrl", function ($scope, $rootScope, $http) {

    if (localStorage.getItem("token")) {
        $rootScope.isLogged = true;
        if($rootScope.selectedApplicant === undefined) {
            window.location.href = "#!/applicants";
        } else {
            initialize();
        }
    } else {
        console.log("BREACH");
        window.location.href = "#!/login";
        $rootScope.isLogged = false;
    }

    function initialize(){
        $scope.informationActive = true;
        $scope.requirementsActive = false;
        console.log("Applicant profile controller");
        console.log("Selected applicant: " + JSON.stringify($rootScope.selectedApplicant));
        $rootScope.currentPage = "Weltanchaung > Applicants > " + $rootScope.selectedApplicant.lastname
    }

    $scope.toggleInfo = function(){
        $scope.informationActive = true;
        $scope.requirementsActive = false;
    }

    $scope.toggleReqs = function(){
        $scope.requirementsActive = true;
        $scope.informationActive = false;
    }
});