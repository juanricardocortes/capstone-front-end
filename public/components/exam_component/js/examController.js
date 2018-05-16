angular.module("app").controller("examCtrl", function ($scope, $rootScope, $http, queue) {

    var functions = {
        onInit: function () {
            functions.getInitialValues();
            console.log("TAKE EXAM");
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        },
        getInitialValues: function () {
            $rootScope.takeExam = true;
            $rootScope.hasChoices = false;
        }
    }

    functions.onInit();

    $scope.functions = {
        gotoLoginForm: function () {
            $rootScope.logExam = false;
        },
        gotoExam: function () {
            if ($scope.exam_email === undefined || $scope.exam_refnum === undefined) {
                M.toast({
                    html: "<i class='small material-icons'>priority_high</i>Please fill out the form.",
                    displayLength: 2500
                });
            } else {
                queue({
                    url: $rootScope.baseURL + "api/logApplicant",
                    method: "POST",
                    cache : true,
                    data: {
                        email: $scope.exam_email,
                        refnum: $scope.exam_refnum
                    }
                }).then(function (response) {
                    console.log(response.data.applicant);
                    localStorage.setItem("inExamMain", response.data.isValid);
                    localStorage.setItem("applicantExam", $scope.exam_email);
                    localStorage.setItem("takingApplicant", JSON.stringify(response.data.applicant));
                    $rootScope.logExam = !response.data.isValid;
                    $rootScope.inExamMain = response.data.isValid;
                    $rootScope.takingApplicant = response.data.applicant;
                    
                    functions.refresh();
                    swal({
                        type: response.data.success,
                        title: response.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                })
            }
        }
    }
});