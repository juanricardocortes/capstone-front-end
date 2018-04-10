angular.module("app").controller("leaveRequestsCtrl", function ($scope, $http, $rootScope) {

    var functions = {
        onInit: function () {
            $rootScope.isLogged = true;
            $http({
                url: $rootScope.baseURL + "api/validateToken",
                method: "POST",
                data: {
                    token: localStorage.getItem("token")
                }
            }).then(function (response) {
                if (response.data.valid) {
                    functions.onCreate();
                } else {
                    console.log("BREACH");
                    window.location.href = "#!/login";
                    $rootScope.isLogged = false;
                }
            });
        },
        onCreate: function () {
            functions.getInitialValues();
            functions.getActiveSideBarLink();
            functions.createCalendar();
        },
        createCalendar: function () {
            $('#calendar').fullCalendar({
                schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
                navLinks: true,
                header: {
                    left: 'title'
                },
                dayClick: function (date, jsEvent, view) {
                    $scope.functions.viewByDay(date.format());
                }
            });
            setTimeout(function () {
                $scope.$apply();
                $('#calendar').fullCalendar('option', 'contentHeight', 700);
                $('#calendar').fullCalendar('option', 'height', 700);
            });
        },
        getInitialValues: function () {
            $rootScope.calendarAttributes = {};
            $scope.calendarShown = true;
            $scope.employeesShown = false;
            $scope.membersShown = false;
            $rootScope.requestsShown = false;
        },
        getActiveSideBarLink: function () {
            $rootScope.dashboardactive = false;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = true;
            $rootScope.profileactive = false;
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        },
    }
    functions.onInit();

    $scope.functions = {
        viewByDay: function (date) {
            if (date) {
                $('#calendar').fullCalendar('changeView', 'agendaDay', date);
            } else {
                $('#calendar').fullCalendar('changeView', 'agendaDay');
            }
        },
        viewByWeek: function () {
            $('#calendar').fullCalendar('changeView', 'agendaWeek');
        },
        viewByMonth: function () {
            $('#calendar').fullCalendar('changeView', 'month');
        },
        navigateNext: function () {
            $('#calendar').fullCalendar('next');
        },
        navigatePrevious: function () {
            $('#calendar').fullCalendar('prev');
        },
        navigateToday: function () {
            $('#calendar').fullCalendar('today');
        },
        showCalendar: function () {
            $scope.calendarShown = true;
            $scope.employeesShown = false;
            $scope.membersShown = false;
            $rootScope.requestsShown = false;
            setTimeout(function () {
                $scope.$apply();
                $('#calendar').fullCalendar('option', 'contentHeight', 700);
                $('#calendar').fullCalendar('option', 'height', 700);
            });
        },
        showEmployees: function () {
            $scope.calendarShown = false;
            $scope.employeesShown = true;
            $scope.membersShown = false;
            $rootScope.requestsShown = false;
        },
        showMembers: function () {
            $scope.calendarShown = false;
            $scope.employeesShown = false;
            $scope.membersShown = true;
            $rootScope.requestsShown = false;
        },
        showRequests: function(){
            $rootScope.requestsShown = true;
        }
    }
});