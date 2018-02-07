angular.module("app").controller("addApplicantCtrl", function ($scope, $rootScope, $http) {

    initialize();

    function initialize() {
        console.log("Add applicant controller");
        listeners();
        $rootScope.allApplicantsToBeAdded = [];
    }

    function checkEmail(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (obj === list[i].email) {
                return true;
            }
        }
        return false;
    }

    function listeners() {
        $('#file').on("change", function (event) {
            $scope.selectedFile = event.target.files[0];
        });
    }

    function confirmAddApplicant() {
        var storageRef = firebase.storage().ref('/images/' + $scope.filename);
        var uploadTask = storageRef.put($scope.selectedFile);
        var newUserKey = firebase.database().ref().push().key;
        uploadTask.on('state_changed', function (snapshot) {}, function (error) {}, function () {
            var downloadURL = uploadTask.snapshot.downloadURL;
            $http({
                url: "http://127.0.0.1:9001/secure-api/uploadImage",
                method: "POST",
                data: {
                    token: localStorage.getItem("token"),
                    userkey: newUserKey,
                    email: $scope.addApplicant_email,
                    downloadURL: downloadURL
                }
            }).then(function (response) {
                Materialize.toast(response.data.message, 4000);
            })
        });

        $rootScope.allApplicantsToBeAdded.push({
            firstname: $scope.addApplicant_firstname,
            lastname: $scope.addApplicant_lastname,
            email: $scope.addApplicant_email,
            userkey: newUserKey
        });
    }

    $scope.hideAddApplicantModal = function () {
        $rootScope.showAddApplicant = false;
    }

    $scope.viewApplicants = function () {
        $rootScope.showAllAddApplicants = true;
        $rootScope.showAddApplicant = false;
    }

    $scope.addApplicant = function () {
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
            if (checkEmail($scope.addApplicant_email, $rootScope.allApplicantsToBeAdded)) {
                Materialize.toast("<i class='small material-icons'>priority_high</i>Email already listed.", 4000);
            } else {
                confirmAddApplicant();
                $("#addApplicant_firstname").val(undefined);
                $("#addApplicant_firstname").blur();
                $("#addApplicant_lastname").val(undefined);
                $("#addApplicant_lastname").blur();
                $("#addApplicant_email").val(undefined);
                $("#addApplicant_email").blur();
                Materialize.toast("Applicant listed.", 4000);
            }
        } else {
            Materialize.toast("<i class='small material-icons'>priority_high</i>Please fill out the form.", 4000);
        }
    }
});