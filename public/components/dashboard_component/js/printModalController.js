angular.module("app").controller("printModalCtrl", function ($scope, $rootScope, $http) {
    var functions = {
        initialize: function () {},
        getLogBody: function (logArray) {
            var arrayBody = [];
            var startDate = moment($scope.printmodal_startDate).format("MM-DD-YYYY");
            var endDate = moment($scope.printmodal_endDate).format("MM-DD-YYYY");
            arrayBody.push(["Message", "Time"]);
            for (var index = logArray.length - 1; index >= 0; index--) {
                var logTime = moment(logArray[index].time, "dddd, MMMM Do YYYY, h:mm:ss a").format("MM-DD-YYYY")
                if (moment(logTime).isSameOrAfter(startDate) &&
                    moment(logTime).isSameOrBefore(endDate)) {
                    arrayBody.push([logArray[index].message, logArray[index].time]);
                }
            }
            return arrayBody;
        },
        getSpecificLogBody: function (logArray, logtype) {
            var arrayBody = [];
            var startDate = moment($scope.printmodal_startDate).format("MM-DD-YYYY");
            var endDate = moment($scope.printmodal_endDate).format("MM-DD-YYYY");
            arrayBody.push(["Message", "Time"]);
            if (logtype === 'projectslots') {
                for (var index = logArray.length - 1; index >= 0; index--) {
                    var logTime = moment(logArray[index].time, "dddd, MMMM Do YYYY, h:mm:ss a").format("MM-DD-YYYY")
                    if (moment(logTime).isSameOrAfter(startDate) &&
                        moment(logTime).isSameOrBefore(endDate) &&
                        functions.checkIfAddRoleNotif(logArray[index])) {
                        arrayBody.push([logArray[index].message, logArray[index].time]);
                    }
                }
            } else if (logtype === 'leaverequests') {
                for (var index = logArray.length - 1; index >= 0; index--) {
                    var logTime = moment(logArray[index].time, "dddd, MMMM Do YYYY, h:mm:ss a").format("MM-DD-YYYY")
                    if (moment(logTime).isSameOrAfter(startDate) &&
                        moment(logTime).isSameOrBefore(endDate) &&
                        functions.checkIfLeaveNotif(logArray[index])) { 
                        arrayBody.push([logArray[index].message, logArray[index].time]);
                    }
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
                            body: functions.getLogBody(logArray)
                        }
                    },
                ],
                styles: $rootScope.reportStyles

            };
            pdfMake.createPdf(docDefinition).download(moment($scope.printmodal_startDate).format("MM-DD-YYYY") + "_to_" + moment($scope.printmodal_endDate).format("MM-DD-YYYY") + "_" + logtype + ".pdf");
        },
        getSpecificLogReport: function (logArray, logtype, reportTitle) {
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
                            body: functions.getSpecificLogBody(logArray, logtype)
                        }
                    },
                ],
                styles: $rootScope.reportStyles

            };
            pdfMake.createPdf(docDefinition).download(moment($scope.printmodal_startDate).format("MM-DD-YYYY") + "_to_" + moment($scope.printmodal_endDate).format("MM-DD-YYYY") + "_" + logtype + ".pdf");
        },
        resetMinMax: function () {
            $('#printmodal_startDate').pickadate('picker').set('max', moment());
            $('#printmodal_endDate').pickadate('picker').set('max', moment());
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
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

    functions.initialize();

    $scope.functions = {
        hidePrintModal: function () {
            $rootScope.showPrintModal = false;
        },
        startLocalJS: function () {
            $('.datepicker').pickadate({
                selectMonths: true, // Creates a dropdown to control month
                selectYears: 15,
                format: 'yyyy-mm-dd',
                max: moment(),
                closeOnSelect: true
            });
            $('.datepicker').on('change', function () {
                if ($(this).attr('id') === 'printmodal_startDate') {
                    if ($(this).val() === "") {
                        $('#printmodal_endDate').pickadate('picker').set('max', moment());
                    } else {
                        $('#printmodal_endDate').pickadate('picker').set('min', $(this).val());
                    }
                }
                if ($(this).attr('id') === 'printmodal_endDate') {
                    $('#printmodal_startDate').pickadate('picker').set('max', $(this).val());
                }
            });
            return true;
        },
        printReport: function () {
            var error = 0;
            if ($scope.printmodal_startDate === undefined ||
                $scope.printmodal_endDate === undefined) {
                error = 1;
            }
            if (error === 0) {
                $(document).ready(function () {
                    var logArray = [];
                    var reportTitle;
                    var isLogs = false;
                    if ($rootScope.logsFrom === 'employeelogs') {
                        reportTitle = "Employee logs";
                        logArray = $rootScope.employeeNotifications;
                        isLogs = true;
                    } else if ($rootScope.logsFrom === 'applicantlogs') {
                        reportTitle = "Applicant logs";
                        logArray = $rootScope.applicantNotifications;
                        isLogs = true;
                    } else if ($rootScope.logsFrom === 'projectlogs') {
                        reportTitle = "Project logs";
                        logArray = $rootScope.projectNotifications;
                        isLogs = true;
                    } else if ($rootScope.logsFrom === 'leavelogs') {
                        reportTitle = "Leave logs";
                        logArray = $rootScope.leaveNotifications;
                        isLogs = true;
                    }
                    if (isLogs) {
                        functions.getLogReport(logArray, $rootScope.logsFrom, reportTitle);
                        functions.resetMinMax();
                        $rootScope.showPrintModal = false;
                        functions.refresh();
                    } else {
                        if ($rootScope.logsFrom === 'projectslots') {
                            reportTitle = "Project slot logs";
                            logArray = $rootScope.projectNotifications;
                        } else if ($rootScope.logsFrom === 'leaverequests') {
                            reportTitle = "Leave request logs";
                            logArray = $rootScope.leaveNotifications;
                        }
                        functions.getSpecificLogReport(logArray, $rootScope.logsFrom, reportTitle);
                    }
                });
            }
        }
    }
});