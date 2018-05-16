angular.module("app").controller("examMainCtrl", function ($scope, $rootScope, $http, queue) {

    var functions = {
        onInit: function () {
            functions.getInitialValues();
            functions.getQuestions();
        },
        getInitialValues: function () {
            $rootScope.myScore = 0;
            $rootScope.applicantExam = localStorage.getItem("applicantExam");
            $rootScope.takingApplicant = JSON.parse(localStorage.getItem("takingApplicant"));
            setTimeout(function () {
                $scope.$apply();
            })
        },
        getQuestions: function () {
            $rootScope.allQuestions;
            queue({
                url: $rootScope.baseURL + "api/getQuestions",
                method: "POST",
                cache : true,
            }).then(function (response) {
                $rootScope.allQuestions = response.data.questions;
                for (var index = 0; index < $rootScope.allQuestions.length; index++) {
                    $rootScope.allQuestions[index].myanswer = "";
                    $rootScope.allQuestions[index].isAnswered = false;
                }
                setTimeout(function () {
                    $scope.$apply();
                })
            });
        },
        resetForm: function () {},
        decrypt: function (object, callback) {
            queue({
                url: $rootScope.baseURL + "secure-api/decrypt",
                method: "POST",
                cache : true,
                data: {
                    token: localStorage.getItem("token"),
                    signature: JSON.stringify($rootScope.userlogged),
                    object: object
                }
            }).then(function (response) {
                callback(response.data.object);
            });
        },
        clearStorage: function(){
            $rootScope.inExamMain = false;
            $rootScope.logExam = false;
            localStorage.removeItem("inExamMain");
            localStorage.removeItem("takingApplicant");
            localStorage.removeItem("applicantExam");
        }
    }

    functions.onInit();

    $scope.functions = {
        setAnswer: function (question, value) {
            console.log(question);
            console.log(value);
            if (value === question.answer && !question.isAnswered) {
                $rootScope.myScore++;
                question.isAnswered = true;
            }
            if (value != question.answer && question.isAnswered) {
                $rootScope.myScore--;
                question.isAnswered = false;
            }
            console.log($rootScope.myScore);
        },
        submit: function () {
            queue({
                url: $rootScope.baseURL + "api/submitExam",
                method: "POST",
                cache : true,
                data: {
                    score: $rootScope.myScore,
                    applicant: $rootScope.takingApplicant
                }
            }).then(function (response) {
                swal({
                    type: response.data.success,
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                functions.clearStorage();
            })
        }
    }
})