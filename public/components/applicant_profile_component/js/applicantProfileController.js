angular.module("app").controller("applicantProfileCtrl", function ($scope, $rootScope, $http, queue) {
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
                window.location.href = "#!/applicants"
            }
            console.log("Applicant profile controller");
        },
        getInitialValues: function () {
            $rootScope.selectedApplicant = JSON.parse(localStorage.getItem("selectedApplicant"));
            $scope.age = moment(moment()).diff($rootScope.selectedApplicant.birthdate, 'years');
            functions.getScorePercent();
        },
        getActiveSideBarLink: function () {
            $rootScope.dashboardactive = false;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = true;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
        },
        checkIfSelected: function () {
            if (localStorage.getItem("selectedApplicant")) {
                return true;
            } else {
                return false;
            }
        },
        completeRequirement: function (key, requirement) {
            swal({
                title: "Are you sure?",
                text: "Complete " + requirement.name + "?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4ff783',
                cancelButtonColor: '#f74f6f',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                reverseButtons: true
            }).then(function (result) {
                if (result.value) {
                    // $rootScope.selectedApplicant.requirements[key].status = "complete";
                    // requirement.status = "complete";
                    functions.updateRequirement(key, requirement);
                } else if (
                    result.dismiss === swal.DismissReason.cancel
                ) {
                    swal({
                        title: "Cancelled",
                        text: "Action cancelled",
                        type: "error",
                        confirmButtonColor: "#4fc3f7"
                    })
                }
            })
        },
        updateRequirement: function (key, requirement) {
            // var totalRequirements = Object.keys($rootScope.selectedApplicant.requirements).length;
            // $rootScope.selectedApplicant.completion = Math.ceil($rootScope.selectedApplicant.completion + ((1 / (totalRequirements)) * 100));
            // if($rootScope.selectedApplicant.completion > 100) {
            //     $rootScope.selectedApplicant.completion = 100;
            // }
            try{
                queue({
                    url: $rootScope.baseURL + "secure-api/updateRequirements",
                    method: "POST",
                    cache : true,
                    data: {
                        status: "complete",
                        signature: JSON.stringify($rootScope.userlogged),
                        token: localStorage.getItem("token"),
                        requirementKey: key,
                        completion: $rootScope.selectedApplicant.completion,
                        requirementName: requirement.name,
                        applicant: $rootScope.selectedApplicant,
                        applicantKey: $rootScope.selectedApplicant.userkey,
                        totalRequirements: Object.keys($rootScope.selectedApplicant.requirements).length
                    }
                }).then(function (response) {
                    setTimeout(function(){
                        swal({
                            type: response.data.success,
                            title: response.data.message,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    });
                });
            } catch (err) {
                console.log("THIS IS AN ERROR 429");
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
                                ['Email', $rootScope.selectedApplicant.email],
                                ['First name', $rootScope.selectedApplicant.firstname],
                                ['Last name', $rootScope.selectedApplicant.lastname],
                                ['Address', $rootScope.selectedApplicant.address],
                                ['Contact number', $rootScope.selectedApplicant.contactNumber],
                                ['Birth date', $rootScope.selectedApplicant.birthdate],
                                ['Status', $rootScope.selectedApplicant.completion + "%"],
                                ['Exam score', $rootScope.selectedApplicant.exam]
                            ]
                        }
                    },
                    {
                        text: "Requirements",
                        style: "subheader"
                    },
                    {
                        style: "tableExample",
                        table: {
                            widths: ['*', '*'],
                            body: functions.getRequirementsStatus()
                        }
                    }
                ],
                styles: $rootScope.reportStyles

            };
            pdfMake.createPdf(docDefinition).download("applicant_" + $rootScope.selectedApplicant.email + "_profile.pdf");
        },
        getRequirementsStatus: function () {
            var requirements = [];
            requirements.push(["Requirement", "Status"]);
            for (req in $rootScope.selectedApplicant.requirements) {
                requirements.push([$rootScope.selectedApplicant.requirements[req].name, $rootScope.selectedApplicant.requirements[req].status]);
            }
            return requirements;
        },
        getScorePercent: function () {
            $scope.score = ($rootScope.selectedApplicant.exam / 16) * 100;
            if($scope.score) {
                $scope.score += "%";
            } else {
                $scope.score = "-";
            }          
        }
    }

    functions.onInit();

    $scope.functions = {
        displayInformation: function (title, message) {
            swal(title, message);
        },
        toggleRequirement: function (key, requirement) {
            if (requirement.status === "incomplete") {
                functions.completeRequirement(key, requirement);
            } else {
                swal({
                    title: "Error",
                    text: "Requirement already completed!",
                    type: "error",
                    confirmButtonColor: "#4fc3f7"
                })
            }
        },
        printMyProfile: function () {
            $(document).ready(function () {
                var canvas = document.getElementById("applicantCanvas");
                var ctx = canvas.getContext("2d");
                var img = document.getElementById("applicantImage");
                $rootScope.rootfunctions.fitImageOn(canvas, img, ctx);
                console.log(canvas.toDataURL());
                functions.getProfileReport(canvas.toDataURL());
            });
        }
    }
});