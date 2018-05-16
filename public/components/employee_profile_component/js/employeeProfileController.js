angular.module("app").controller("employeeProfileCtrl", function ($scope, $rootScope, $http, queue) {
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
            if (functions.checkIfSelected()) {
                functions.getInitialValues();
                functions.getActiveSideBarLink();
            } else {
                window.location.href = "#!/employees"
            }
            console.log("Employee profile controller");
        },
        getInitialValues: function () {
            $scope.showProfile = true;
            $scope.showLeaves = true;
            $scope.showProjects = true;
            $rootScope.showUpdateEmployeeModal = false;
            $rootScope.selectedEmployee = JSON.parse(localStorage.getItem("selectedEmployee"));
            $scope.age = moment(moment()).diff($rootScope.selectedEmployee.files.birthdate, 'years')
        },
        getActiveSideBarLink: function () {
            $rootScope.dashboardactive = false;
            $rootScope.employeeactive = true;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
        },
        checkIfSelected: function () {
            if (localStorage.getItem("selectedEmployee")) {
                return true;
            } else {
                return false;
            }
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        },
        getProfileReport: function (data) {
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
                        image: data
                    },
                    {
                        text: "Profile",
                        style: "subheader"
                    },
                    {
                        style: "tableExample",
                        table: {
                            widths: ['*', '*'],
                            body: [
                                ['Employee ID', $rootScope.selectedEmployee.files.employeeid],
                                ['Email', $rootScope.selectedEmployee.email],
                                ['First name', $rootScope.selectedEmployee.files.firstname],
                                ['Last name', $rootScope.selectedEmployee.files.lastname],
                                ['Address', $rootScope.selectedEmployee.files.address],
                                ['Contact number', $rootScope.selectedEmployee.files.contact],
                                ['Birth date', $rootScope.selectedEmployee.files.birthdate],
                                ['Date hired', $rootScope.selectedEmployee.files.datehired]
                            ]
                        }
                    },
                    {
                        text: "Projects",
                        style: "subheader"
                    },
                    {
                        style: "tableExample",
                        table: {
                            widths: ["*", "*", "*", "*", "*"],
                            body: functions.getProjects()
                        }
                    },
                    {
                        text: "Leaves",
                        style: "subheader"
                    },
                    {
                        style: "tableExample",
                        table: {
                            widths: ["*", "*", "*", "*", "*", "*"],
                            body: functions.getLeaves()
                        }
                    }
                ],
                styles: $rootScope.reportStyles

            };
            pdfMake.createPdf(docDefinition).download("employee_" + $rootScope.selectedEmployee.email + "_profile.pdf");
        },
        getProjects: function () {
            var hasProjects = false;
            var projects = [];
            projects.push(["Project name", "Position", "Start date", "Shift", "Remarks"]);
            for (project in $rootScope.selectedEmployee.files.projects) {
                hasProjects = true;
                projects.push([$rootScope.selectedEmployee.files.projects[project].projectName,
                    $rootScope.selectedEmployee.files.projects[project].role,
                    $rootScope.selectedEmployee.files.projects[project].dates.startDate,
                    $rootScope.selectedEmployee.files.projects[project].shiftdetails.time,
                    $rootScope.selectedEmployee.files.projects[project].remarks
                ])
            }
            if(!hasProjects) {
                projects.push(["No data found","No data found","No data found","No data found"]); 
            }
            return projects;
        },
        getLeaves: function () {
            var hasLeaves = false;
            var leaves = [];
            leaves.push(["Project name", "Type", "Status", "Time", "Start date", "End date"]);
            for (leave in $rootScope.allLeaves) {
                if ($rootScope.allLeaves[leave].request.employee.userkey === $rootScope.selectedEmployee.userkey) {
                    hasLeaves = true;
                    leaves.push([
                        $rootScope.allLeaves[leave].projectname,
                        $rootScope.allLeaves[leave].request.request.type,
                        $rootScope.allLeaves[leave].request.status,
                        $rootScope.allLeaves[leave].request.time,
                        $rootScope.allLeaves[leave].request.request.startDate,
                        $rootScope.allLeaves[leave].request.request.endDate
                    ])
                }
            }
            if(!hasLeaves) {
                leaves.push(["No data found","No data found","No data found","No data found","No data found","No data found"]);
            }
            return leaves;
        }
    }

    functions.onInit();

    $scope.functions = {
        editProfile: function () {
            $rootScope.showUpdateEmployeeModal = true;
        },
        printMyProfile: function () {
            $(document).ready(function () {
                var canvas = document.getElementById("employeeCanvas");
                var ctx = canvas.getContext("2d");
                var img = document.getElementById("employeeImage");
                $rootScope.rootfunctions.fitImageOn(canvas, img, ctx);
                console.log(canvas.toDataURL());
                functions.getProfileReport(canvas.toDataURL());
            });
        },
        displayInformation: function (title, message) {
            swal(title, message);
        },
        checkIfHasLeaves: function () {
            console.log($rootScope.leavesDataPopulated);
            $rootScope.selectedHasLeaves = false;
            for (var index = 0; index < $rootScope.allLeaves.length; index++) {
                if ($rootScope.allLeaves[index].request.employee.userkey === $rootScope.selectedEmployee.userkey) {
                    $rootScope.selectedHasLeaves = true;
                    break;
                }
            }
            functions.refresh();
        }
    }
});