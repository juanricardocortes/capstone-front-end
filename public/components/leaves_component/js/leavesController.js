angular.module("app").controller("leaveRequestsCtrl", function ($scope, $http, $rootScope, queue) {

    var functions = {
        onInit: function () {
            $rootScope.isLogged = true;
            queue({
                url: $rootScope.baseURL + "api/validateToken",
                method: "POST",
                cache : true,
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
                eventLimit: true,
                views: {
                    basic: {
                        displayEventEnd: true
                    },
                    agenda: {
                        displayEventEnd: true
                    },
                    week: {
                        displayEventEnd: true
                    },
                    day: {
                        displayEventEnd: true
                    }
                },
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
            $rootScope.toggleAllLeaveEvents = true;
            $scope.leaveStatusSwitchText = "Requested leaves";
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
        }
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
        },
        toggleAllLeaveEvents: function () {
            console.log("GETTING EVENTS");
            console.log($rootScope.allLeaveEvents);
            setTimeout(function () {
                $scope.$apply();
                try {
                    $('#calendar').fullCalendar('removeEventSource', $rootScope.allLeaveEvents);
                } catch (err) {
                    console.log(err.message);
                }
                $('#calendar').fullCalendar('addEventSource', $rootScope.allLeaveEvents);
            });
            setTimeout(function () {
                $rootScope.toggleAllLeaveEvents = false;
                $scope.$apply();
            });
        },
        acknowledgeLeave: function (leave, isAccepted) {
            queue({
                url: $rootScope.baseURL + "secure-api/acknowledgeLeave",
                method: "POST",
                cache : true,
                data: {
                    signature: JSON.stringify($rootScope.userlogged),
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
            queue({
                url: $rootScope.baseURL + "secure-api/forwardLeave",
                method: "POST",
                cache : true,
                data: {
                    signature: JSON.stringify($rootScope.userlogged),
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
        toggleLeaveStatus: function () {
            if ($rootScope.leaveStatusToggle) {
                $scope.leaveStatusSwitchText = "Requested leaves";
            } else {
                $scope.leaveStatusSwitchText = "Acknowledged leaves";
            }
            $rootScope.leaveStatusToggle = !$rootScope.leaveStatusToggle;
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
        hasProject: function () {
            var isTrue = true;
            for (var index = 0; index < $rootScope.allProjects.length; index++) {
                if ($rootScope.userlogged.userkey === $rootScope.allProjects[index].projectlead.userkey) {
                    isTrue = false;
                }
            }
            return isTrue;
        },
        hasForwardedLeaves: function () {
            var hasFLeaves = false;
            var index;
            for (index = 0; index < $rootScope.allLeaves.length; index++) {
                if ($rootScope.allLeaves[index].request.isAcknowledgedByPL && !$rootScope.allLeaves[index].request.isAcknowledgedByHR) {
                    hasFLeaves = !hasFLeaves;
                    break;
                }
            }
            index++;
            if (index === $rootScope.allLeaves.length) {
                hasFLeaves = true;
            }
            return hasFLeaves;
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
            } else if (checker === 0) {
                return false;
            } else {
                return false;
            }
        },
        checkIfSomeAckHR: function () {
            var checker = 0;
            var index;
            for (index = 0; index < $rootScope.allLeaves.length; index++) {
                if ($rootScope.allLeaves[index].request.isAcknowledgedByHR) {
                    checker += 1;
                }
            }
            if (checker === 0) {
                return false;
            } else {
                return true;
            }
        },
        hasRequests: function (project) {
            var hasRequests = false;
            for (request in project.requests) {
                hasRequests = true;
            }
            return hasRequests;

        },
        switchProjectToggle: function (project) {
            project.leaveToggle = !project.leaveToggle;
            functions.refresh();
        },
        initProjectToggle: function (project) {
            project.leaveToggle = false;
            functions.refresh();
            return true;
        },
        initLeaveStatusToggle: function () {
            $rootScope.leaveStatusToggle = false;
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