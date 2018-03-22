angular.module("app", ["ngRoute", "blockUI"])

    .config(function ($routeProvider, blockUIConfig) {
        blockUIConfig.templateUrl = "common/views/blockui_spinner.html";
        $routeProvider
            .when("/", {
                templateUrl: "components/dashboard_component/views/dashboard.html",
                controller: "dashboardCtrl"
            })
            .when("/dashboard", {
                templateUrl: "components/dashboard_component/views/dashboard.html",
                controller: "dashboardCtrl"
            })
            .when("/employees", {
                templateUrl: "components/employee_component/views/employee.html",
                controller: "employeeCtrl"
            })
            .when("/projects", {
                templateUrl: "components/projects_component/views/projects.html",
                controller: "projectCtrl"
            })
            .when("/applicants", {
                templateUrl: "components/applicant_component/views/applicants.html",
                controller: "applicantCtrl"
            })
            .when("/applicants/profile", {
                templateUrl: "components/applicant_profile_component/views/applicantprofile.html",
                controller: "applicantProfileCtrl"
            })
            .when("/profile", {
                templateUrl: "components/profile_component/views/profile.html",
                controller: "profileCtrl"
            })
            .when("/leaverequests", {
                templateUrl: "components/leaves_component/views/leaverequests.html",
                controller: "leaveRequestsCtrl"
            });

    })

    .controller("mainCtrl", function ($rootScope, $scope, $http) {

        initialize();

        function initialize() {
            console.log("Main controller");
            getInitalValues();
            getUserLogged();
            onListeners();
        }

        function getInitalValues() {
            $rootScope.baseURL = "http://127.0.0.1:9001/";
            $rootScope.currentPage = "Weltanchaung";
            $rootScope.dashboardactive = true;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
            $rootScope.unseenNotifications = {};
        }

        function onListeners() {

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    applicantListeners();
                    projectListeners();
                } else {
                    // No user is signed in.
                }
            });
        }

        function getUserLogged() {
            $rootScope.userlogged = JSON.parse(localStorage.getItem("userlogged"));
        }

        function applicantListeners() {
            $rootScope.appNotifCounter = 0;
            $rootScope.applicantNotifications = [];
            $rootScope.allApplicants = [];

            firebase.database().ref("HRMS_Storage/Notifications/Applicants/").on("child_added", function (snapshot) {
                if (!(snapshot.val().seen)) {
                    $rootScope.appNotifCounter++;
                }
                $rootScope.unseenNotifications["applicants"] = $rootScope.appNotifCounter;
                $rootScope.applicantNotifications.push(snapshot.val());
                refresh();
            });

            firebase.database().ref("HRMS_Storage/Applicants/").on("child_added", function (snapshot) {
                $rootScope.allApplicants.push(snapshot.val());
                refresh();
            });

            firebase.database().ref("HRMS_Storage/Applicants/").on("child_removed", function (snapshot) {
                $rootScope.allApplicants.splice($rootScope.allApplicants.indexOf(snapshot.val()), 1);
                refresh();
            });

            firebase.database().ref("HRMS_Storage/Applicants/").on("child_changed", function (snapshot) {
                for (var index = 0; index < $rootScope.allApplicants.length; index++) {
                    if ($rootScope.allApplicants[index].userkey === snapshot.val().userkey) {
                        $rootScope.allApplicants[index] = snapshot.val();
                        try {
                            if ($rootScope.selectedApplicant.userkey === snapshot.val().userkey) {
                                $rootScope.selectedApplicant = snapshot.val();
                                localStorage.setItem("selectedApplicant", JSON.stringify($rootScope.selectedApplicant));
                            }
                        } catch (err) {
                            console.log("No selected applicant");
                        }
                        break;
                    }
                }
                refresh();
            });
        }

        function projectListeners() {
            $rootScope.projectNotifCounter = 0;
            $rootScope.projectNotifications = [];
            $rootScope.allProjects = [];

            firebase.database().ref("HRMS_Storage/Notifications/Projects/").on("child_added", function (snapshot) {
                if (!(snapshot.val().seen)) {
                    $rootScope.projectNotifCounter++;
                }
                $rootScope.unseenNotifications["projects"] = $rootScope.projectNotifCounter;
                $rootScope.projectNotifications.push(snapshot.val());
                setTimeout(function () {
                    $scope.$apply();
                });
            });

            firebase.database().ref("HRMS_Storage/Projects/").on("child_added", function (snapshot) {
                $rootScope.allProjects.push(snapshot.val());
                refresh();
            });

            firebase.database().ref("HRMS_Storage/Projects/").on("child_removed", function (snapshot) {
                $rootScope.allProjects.splice($rootScope.allProjects.indexOf(snapshot.val()), 1);
                refresh();
            });

            firebase.database().ref("HRMS_Storage/Projects/").on("child_changed", function (snapshot) {
                for (var index = 0; index < $rootScope.allProjects.length; index++) {
                    if ($rootScope.allProjects[index].projectkey === snapshot.val().projectkey) {
                        $rootScope.allProjects[index] = snapshot.val();
                        break;
                    }
                }
                refresh();
            });
        }

        $rootScope.startFeather = function () {
            feather.replace();
            $('.tooltipped').tooltip({
                delay: 1
            });
            return true;
        }

        function refresh() {
            setTimeout(function () {
                $scope.$apply();
            });
        }
    });