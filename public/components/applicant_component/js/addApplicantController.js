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
                contact: $scope.addApplicant_contact,
                address: $scope.addApplicant_address,
                birthdate: $scope.addApplicant_birthdate,
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
            $("#addApplicant_position").val(undefined);
            $("#addApplicant_position").blur();
            $("#addApplicant_contact").val(undefined);
            $("#addApplicant_contact").blur();
            $("#addApplicant_address").val(undefined);
            $("#addApplicant_address").blur();
            $("#addApplicant_birthdate").val(undefined);
            $("#addApplicant_birthdate").blur();
            $("#file").val(undefined);
            $("#file").blur();
            $("#filename").val(undefined);
            $("#filename").blur();
        }
    }

    functions.initialize();

    $scope.functions = {
        startLocalJS: function () {
            $('.datepicker').pickadate({
                selectMonths: true, // Creates a dropdown to control month
                selectYears: 99,
                max: moment().year(moment().year() - 18).toDate(),
                closeOnSelect: true
            });
            return true;
        },
        hideAddApplicantModal: function () {
            $rootScope.showAddApplicant = false;
        },
        viewApplicants: function () {
            $rootScope.showAllAddApplicants = true;
            $rootScope.showAddApplicant = false;
        },
        addApplicant: function () {
            var errors = 0;
            if ($scope.addApplicant_firstname === undefined ||
                $scope.addApplicant_lastname === undefined ||
                $scope.addApplicant_email === undefined ||
                $scope.filename === undefined ||
                $scope.addApplicant_position === undefined ||
                $scope.addApplicant_contact === undefined ||
                $scope.addApplicant_address === undefined ||
                $scope.addApplicant_birthdate === undefined) {
                errors = 1;
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