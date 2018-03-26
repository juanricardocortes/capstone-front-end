angular.module("app").controller("addApplicantCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        initialize: function () {
            console.log("Add applicant controller");
            functions.onListeners();
            functions.getInitialValues();
        },
        getInitialValues: function () {
            $rootScope.allApplicantsToBeAdded = [];
            $rootScope.databaseConnection = [];
        },
        onListeners: function () {
            $('#file').on("change", function (event) {
                $scope.selectedFile = event.target.files[0];
            });
        },
        checkEmail: function (obj, list) {
            var i;
            for (i = 0; i < list.length; i++) {
                if (obj === list[i].email) {
                    return true;
                }
            }
            return false;
        },
        confirmAddApplicant: function () {
            var storageRef = "/images/applicantImages/" + $scope.addApplicant_email + "_" + $scope.addApplicant_lastname + ", " + $scope.addApplicant_firstname;
            var newUserKey = firebase.database().ref().push().key;
            $rootScope.allApplicantsToBeAdded.push({
                firstname: $scope.addApplicant_firstname,
                lastname: $scope.addApplicant_lastname,
                email: $scope.addApplicant_email,
                position: $scope.addApplicant_position,
                userkey: newUserKey,
                applicantImageFile: $scope.selectedFile,
                storageRef: storageRef
            });
        },
        resetForm: function () {
            $("#addApplicant_firstname").val(undefined);
            $("#addApplicant_firstname").blur();
            $("#addApplicant_lastname").val(undefined);
            $("#addApplicant_lastname").blur();
            $("#addApplicant_email").val(undefined);
            $("#addApplicant_email").blur();
            $("#file").val(undefined);
            $("#file").blur();
            $("#filename").val(undefined);
            $("#filename").blur();
        }
    }

    functions.initialize();

    $scope.functions = {
        hideAddApplicantModal: function () {
            $rootScope.showAddApplicant = false;
        },
        viewApplicants: function () {
            $rootScope.showAllAddApplicants = true;
            $rootScope.showAddApplicant = false;
        },
        addApplicant: function () {
            var errors = 0;
            if ($scope.addApplicant_firstname === undefined) {
                errors = 1;
            }
            if ($scope.addApplicant_lastname === undefined) {
                errors = 2;
            }
            if ($scope.addApplicant_email === undefined) {
                errors = 3;
            }
            if (errors === 0) {
                if (functions.checkEmail($scope.addApplicant_email, $rootScope.allApplicantsToBeAdded)) {
                    M.toast({
                        html: "<i class='small material-icons'>priority_high</i>Email already listed.",
                        displayLength: 2500
                    });
                } else {
                    functions.confirmAddApplicant();
                    functions.resetForm();
                    M.toast({
                        html: "Applicant listed",
                        displayLength: 2500
                    });
                }
            } else {
                M.toast({
                    html: "<i class='small material-icons'>priority_high</i>Please fill out the form.",
                    displayLength: 2500
                });
            }
        }
    }
});