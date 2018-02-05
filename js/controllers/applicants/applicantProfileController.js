angular.module("app").controller("applicantProfileCtrl", function ($scope, $rootScope, $http) {

    if (localStorage.getItem("token")) {
        $rootScope.isLogged = true;
        initialize();
    } else {
        console.log("BREACH");
        window.location.href = "#!/login";
        $rootScope.isLogged = false;
    }

    function initialize(){
        console.log("Applicant profile controller");
        console.log("Selected applicant: " + JSON.stringify($rootScope.selectedApplicant));
    }
});