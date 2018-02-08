angular.module("app").controller("allAddApplicantsCtrl", function ($scope, $rootScope, $http) {

    initialize();

    function initialize() {
        $('.collapsible').collapsible();
        console.log("All add applicants controller");
    }

    $scope.hideAllAddApplicantModal = function () {
        $rootScope.showAllAddApplicants = false;
        $rootScope.showAddApplicant = true;
    }

    $scope.addApplicants = function () {
        $http({
            url: "http://127.0.0.1:9001/secure-api/addApplicant",
            method: "POST",
            data: {
                token: localStorage.getItem("token"),
                allApplicants: $rootScope.allApplicantsToBeAdded
            }
        }).then(function (response) {
            uploadApplicantImages();
            setTimeout(function () {
                $rootScope.showAllAddApplicants = false;
                $rootScope.showAddApplicant = false
                $scope.$apply();
            });
        });
    }

    function uploadApplicantImages() {
        for (var index = 0; index < $rootScope.allApplicantsToBeAdded.length; index++) {
            uploadImageAsPromise($rootScope.allApplicantsToBeAdded[index]);
        }
    }

    function uploadImageAsPromise(applicant) {
        return new Promise(function (resolve, reject) {
            var storageRef = firebase.storage().ref(applicant.storageRef);
            var task = storageRef.put(applicant.applicantImageFile);
            task.on('state_changed',
                function progress(snapshot) {
                    // var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                    // uploader.value = percentage;
                },
                function error(err) {
                    console.log("ERROR: " + err.message);
                },
                function complete() {
                    var downloadURL = task.snapshot.downloadURL;
                    $http({
                        url: "http://127.0.0.1:9001/secure-api/uploadImage",
                        method: "POST",
                        data: {
                            token: localStorage.getItem("token"),
                            userkey: applicant.userkey,
                            email: applicant.email,
                            downloadURL: downloadURL
                        }
                    }).then(function (response) {
                        Materialize.toast(response.data.message, 4000);
                    });
                }
            );
        });
    }
});