angular.module("app").controller("leaveRequestsCtrl", function ($scope, $http, $rootScope) {

    var functions = {
        onInit: function () {
            $rootScope.isLogged = true;
            $http({
                url: $rootScope.baseURL + "api/validateToken",
                method: "POST",
                data: {
                    token: localStorage.getItem("token"),
                    signature: JSON.stringify($rootScope.userlogged)
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
                $('#calendar').fullCalendar('option', 'height', "auto");
            });
        },
        getInitialValues: function () {
            $rootScope.leaveToggle = false;
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
        acknowledgeLeave: function (leave, isAccepted) {
            $http({
                url: $rootScope.baseURL + "secure-api/acknowledgeLeave",
                method: "POST",
                data: {
                    token: localStorage.getItem("token"),
                    leave: leave,
                    isAccepted: isAccepted
                }
            }).then(function (response) {
                swal({
                    type: response.data.success,
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                functions.refresh();
            })
        },
        forwardLeave: function (name, projectkey, request, isAccepted) {
            $http({
                url: $rootScope.baseURL + "secure-api/forwardLeave",
                method: "POST",
                data: {
                    token: localStorage.getItem("token"),
                    name: name,
                    projectkey: projectkey,
                    request: request,
                    isAccepted: isAccepted
                }
            }).then(function (response) {
                swal({
                    type: response.data.success,
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                functions.refresh();
            });
        },
        hasCurrentProject: function () {
            var hasProject = false;
            for (var index = 0; index < $rootScope.allProjects.length; index++) {
                if (moment(moment()).isSameOrAfter($rootScope.allProjects[index].schedule.dates.startDate) &&
                    moment(moment()).isSameOrBefore($rootScope.allProjects[index].schedule.dates.endDate) &&
                    $rootScope.userlogged.userkey === $rootScope.allProjects[index].projectlead.userkey) {
                    hasProject = true;
                    break;
                }
            }
            return hasProject;
        },
        isCurrentProject: function (project) {
            if (moment(moment()).isSameOrAfter(project.schedule.dates.startDate) &&
                moment(moment()).isSameOrBefore(project.schedule.dates.endDate)) {
                return true;
            } else {
                return false;
            }
        },
        checkIfAllAck: function (requests) {
            var checker = 0;
            var size = 0;
            for (request in requests) {
                size += 1;
                if (requests[request].isAcknowledgedByPL) {
                    checker += 1;
                }
            }
            if (checker === size) {
                return true;
            } else {
                return false;
            }
        },
        checkIfNoAck: function (requests) {
            var checker = 0;
            var size = 0;
            for (request in requests) {
                size += 1;
                if ((requests[request].isAcknowledgedByPL)) {
                    checker += 1;
                }
            }
            if (checker === 0) {
                return true;
            } else {
                return false;
            }
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
        showRequests: function () {
            $rootScope.requestsShown = true;
        }
    }
});