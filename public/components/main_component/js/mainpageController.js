angular.module("app").controller("mainpageCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        initialize: function () {
            console.log("Main page controller");
        }
    }

    functions.initialize();

    $scope.functions = {
        checkIfProjectLead: function () {
            var isPL = 0;
            var userlogged = $rootScope.userlogged;
            try {
                for (project in userlogged.files.projects) {
                    if (userlogged.files.projects[project].isProjectLead) {
                        isPL++;
                    }
                }
            } catch (err) {}
            if (isPL) {
                return true;
            } else {
                return false;
            }
        },
        gotoDashboard: function () {
            $rootScope.dashboardactive = true;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
            window.location.href = "#!/dashboard"
        },
        gotoEmployees: function () {
            $rootScope.dashboardactive = false;
            $rootScope.employeeactive = true;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
            window.location.href = "#!/employees"
        },
        gotoProjects: function () {
            $rootScope.dashboardactive = false;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = true;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
            window.location.href = "#!/projects"
        },
        gotoApplicants: function () {
            $rootScope.dashboardactive = false;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = true;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
            window.location.href = "#!/applicants"
        },
        gotoLeaveRequests: function () {
            $rootScope.dashboardactive = false;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = true;
            $rootScope.profileactive = false;
            window.location.href = "#!/leaverequests"
        },
        gotoProfile: function () {
            $rootScope.dashboardactive = false;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = true;
            window.location.href = "#!/profile"
        },
        logout: function () {
            window.location.href = "#!/login"
            $rootScope.token = undefined;
            $rootScope.isLogged = false;
            localStorage.removeItem("token");
            firebase.auth().signOut().then(function () {
                // invalidate token
            }).catch(function (error) {});
        }
    }
});