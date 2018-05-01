angular.module("app").controller("mainpageCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        initialize: function () {
            console.log("Main page controller");
        },
        emptyRootscope: function () {
            console.log("CLEARING ROOTSCOPE");
            for (var prop in $rootScope) {
                if (typeof $rootScope[prop] !== 'function' && prop.indexOf('$') == -1 && prop.indexOf('$$') == -1) {
                    delete $rootScope[prop];
                }
            }
        },
        emptyLocalStorage: function () {
            console.log("CLEARING LOCAL STORAGE");
            localStorage.clear();
        },
        restartInitValues: function () {
            $rootScope.baseURL = "http://127.0.0.1:9001/";
            // $rootScope.baseURL = "https://us-central1-hrmsbot.cloudfunctions.net/venus/";
            $rootScope.currentPage = "Weltanchaung";
            $rootScope.dashboardactive = true;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
            $rootScope.isAuthenticated = false;
            $rootScope.unseenNotifications = {};
            $rootScope.dateToday = moment();
            $rootScope.logExam = false;
            $rootScope.inExamMain = (false || localStorage.getItem("inExamMain"));
            $rootScope.userlogged = JSON.parse(localStorage.getItem("userlogged"));
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
                functions.emptyRootscope();
                functions.emptyLocalStorage();
                functions.restartInitValues();
                firebase.app().delete()
            }).catch(function (error) {});
        }
    }
});