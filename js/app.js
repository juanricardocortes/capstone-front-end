angular.module("app", ["ngRoute", "blockUI"])

    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/dashboard/dashboard.html",
                controller: "dashboardCtrl"
            })
            .when("/dashboard", {
                templateUrl: "views/dashboard/dashboard.html",
                controller: "dashboardCtrl"
            })
            .when("/employees", {
                templateUrl: "views/employees/employee.html",
                controller: "employeeCtrl"
            })
            .when("/projects", {
                templateUrl: "views/projects/projects.html",
                controller: "projectCtrl"
            })
            .when("/applicants", {
                templateUrl: "views/applicants/applicants.html",
                controller: "applicantCtrl"
            })
            .when("/applicants/profile", {
                templateUrl: "views/applicants/profile/applicantprofile.html",
                controller: "applicantProfileCtrl"
            })
            .when("/profile", {
                templateUrl: "views/profile/profile.html",
                controller: "profileCtrl"
            })
            .when("/leaverequests", {
                templateUrl: "views/leaverequests/leaverequests.html",
                controller: "leaveRequestsCtrl"
            })

    })

    .controller("mainCtrl", function ($rootScope, $scope, $http) {

        initialize();

        function initialize() {
            $rootScope.currentPage = "Weltanchaung";
            console.log("Main controller");
        }
    });