angular.module("app").controller("dashboardCtrl", function ($scope, $rootScope, $http) {

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
        },
        getActiveSideBarLink: function () {
            $rootScope.dashboardactive = true;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
        },
        getInitialValues: function () {
            $rootScope.showPrintModal = false;
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        },
        getLogBody: function (logArray, logtype) {
            var arrayBody = [];
            arrayBody.push(["Message", "Time"]);
            if (logtype === 'projectslots') {
                for (var index = logArray.length - 1; index >= 0; index--) {
                    if (functions.checkIfAddRoleNotif(logArray[index])) {
                        arrayBody.push([logArray[index].message, logArray[index].time]);
                    }
                }
            } else if (logtype === 'leaverequests') {
                for (var index = logArray.length - 1; index >= 0; index--) {
                    if (functions.checkIfLeaveNotif(logArray[index])) {
                        arrayBody.push([logArray[index].message, logArray[index].time]);
                    }
                }
            } else {
                for (var index = logArray.length - 1; index >= 0; index--) {
                    arrayBody.push([logArray[index].message, logArray[index].time]);
                }
            }
            return arrayBody;
        },
        getLogReport: function (logArray, logtype, reportTitle) {
            var docDefinition = {
                content: [{
                        text: "Weltanchaung Corporation",
                        style: "header"
                    },
                    {
                        text: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
                        style: "subtitle"
                    },
                    {
                        text: reportTitle,
                        style: "subheader"
                    },
                    {
                        style: "tableExample",
                        table: {
                            widths: ['*', '*'],
                            body: functions.getLogBody(logArray, logtype)
                        }
                    },
                ],
                styles: $rootScope.reportStyles

            };
            pdfMake.createPdf(docDefinition).download("all_" + logtype + ".pdf");
        },
        checkIfLeaveNotif: function (notif) {
            if ((notif.message).indexOf("to HR") !== -1) {
                return true;
            } else {
                return false;
            }
        },
        checkIfAddRoleNotif: function (notif) {
            if ((notif.message).indexOf("role in") !== -1) {
                return true;
            } else {
                return false;
            }
        }
    }
    functions.onInit();

    $scope.functions = {
        printAllLogs: function (logtype) {
            $(document).ready(function () {
                var logArray = [];
                var reportTitle;
                var isLogs = false;
                if (logtype === 'employeelogs') {
                    reportTitle = "Employee logs";
                    logArray = $rootScope.employeeNotifications;
                    isLogs = true;
                } else if (logtype === 'applicantlogs') {
                    reportTitle = "Applicant logs";
                    logArray = $rootScope.applicantNotifications;
                    isLogs = true;
                } else if (logtype === 'projectlogs') {
                    reportTitle = "Project logs";
                    logArray = $rootScope.projectNotifications;
                    isLogs = true;
                } else if (logtype === 'leavelogs') {
                    reportTitle = "Leave logs";
                    logArray = $rootScope.leaveNotifications;
                    isLogs = true;
                } else if (logtype === 'projectslots') {
                    reportTitle = "Project slots logs";
                    logArray = $rootScope.projectNotifications;
                } else if (logtype === 'leaverequests') {
                    reportTitle = "Leave requests logs";
                    logArray = $rootScope.leaveNotifications;
                }
                functions.getLogReport(logArray, logtype, reportTitle);
            });
        },
        openPrintModal: function (from) {
            $rootScope.showPrintModal = true;
            $rootScope.logsFrom = from;
        },
        printEmployeeChart: function () {
            $(document).ready(function () {
                html2canvas(document.getElementById("hiredemployeespermonth"), {
                    onrendered: function (canvas) {
                        var data = canvas.toDataURL("image/png");
                        var docDefinition = {
                            content: [{
                                    text: "Weltanchaung Corporation",
                                    style: "header"
                                },
                                {
                                    text: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
                                    style: "subtitle"
                                },
                                {
                                    image: data,
                                    width: 500
                                }
                            ],
                            styles: $rootScope.reportStyles
                        };
                        pdfMake.createPdf(docDefinition).download("hired_employees_per_month.pdf");
                    }
                });
            });
        },
        printApplicantChart: function () {
            $(document).ready(function () {
                html2canvas(document.getElementById("applicantspermonth"), {
                    onrendered: function (canvas) {
                        var data = canvas.toDataURL("image/png");
                        var docDefinition = {
                            content: [{
                                    text: "Weltanchaung Corporation",
                                    style: "header"
                                },
                                {
                                    text: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
                                    style: "subtitle"
                                },
                                {
                                    image: data,
                                    width: 500
                                }
                            ],
                            styles: $rootScope.reportStyles
                        };
                        pdfMake.createPdf(docDefinition).download("applicants_per_month.pdf");
                    }
                });
            });
        },
        checkAvailableApplicants: function () {
            try {
                var availableApplicants = 0;
                for (var index = 0; index < $rootScope.allApplicants.length; index++) {
                    if ($rootScope.allApplicants[index].completion === 100) {
                        availableApplicants++;
                    }
                }

                if (availableApplicants === 0) {
                    return false;
                } else {
                    return true;
                }
            } catch (err) {}
        },
        checkIfAllHasProjects: function () {
            try {
                var employeesWhoHaveProjects = 0;
                for (var index = 0; index < $rootScope.allEmployees; index++) {
                    if ($rootScope.allEmployees[index].files.assigned.isAssigned) {
                        employeesWhoHaveProjects++;
                    }
                }
                if (employeesWhoHaveProjects === $rootScope.allEmployees.length) {
                    return true;
                } else {
                    return false;
                }
            } catch (err) {}
        },
        checkIfLeaveNotif: function (notif) {
            if ((notif.message).indexOf("to HR") !== -1) {
                return true;
            } else {
                return false;
            }
        },
        checkIfAddRoleNotif: function (notif) {
            if ((notif.message).indexOf("role in") !== -1) {
                return true;
            } else {
                return false;
            }
        },
        startEmployeeBarGraph: function () {
            $scope.emplabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $scope.empseries = ['Hired employees'];
            $scope.empdata = [$rootScope.janCountEmp, $rootScope.febCountEmp, $rootScope.marCountEmp,
                $rootScope.aprCountEmp, $rootScope.mayCountEmp, $rootScope.junCountEmp,
                $rootScope.julCountEmp, $rootScope.augCountEmp, $rootScope.sepCountEmp,
                $rootScope.octCountEmp, $rootScope.novCountEmp, $rootScope.decCountEmp
            ];
            $scope.empoptions = {
                scales: {
                    yAxes: [{
                        stacked: true,
                        gridLines: {
                            display: true
                        },
                        ticks: {
                            min: 0,
                            callback: function (value, index, values) {
                                if (Math.floor(value) === value) {
                                    return value;
                                }
                            }
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        }
                    }]
                }
            };
        },
        startApplicantBarGraph: function () {
            $scope.applabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $scope.appseries = ['Hired applicants'];
            $scope.appdata = [$rootScope.janCountApp, $rootScope.febCountApp, $rootScope.marCountApp,
                $rootScope.aprCountApp, $rootScope.mayCountApp, $rootScope.junCountApp,
                $rootScope.julCountApp, $rootScope.augCountApp, $rootScope.sepCountApp,
                $rootScope.octCountApp, $rootScope.novCountApp, $rootScope.decCountApp
            ];
            $scope.appoptions = {
                scales: {
                    yAxes: [{
                        stacked: true,
                        gridLines: {
                            display: true
                        },
                        ticks: {
                            min: 0,
                            callback: function (value, index, values) {
                                if (Math.floor(value) === value) {
                                    return value;
                                }
                            }
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        }
                    }]
                }
            };
        }
    }
});