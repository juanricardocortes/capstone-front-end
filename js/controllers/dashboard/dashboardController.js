angular.module("app").controller("dashboardCtrl", function ($scope, $rootScope, $http) {
    
    if(localStorage.getItem("token")) {
        $rootScope.isLogged = true;
        initialize();
    } else {
        console.log("BREACH");
        window.location.href = "#!/login";
        $rootScope.isLogged = false;
    }

    function initialize(){
        console.log("Dashboard controller");
    }
});