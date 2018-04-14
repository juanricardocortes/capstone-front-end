angular.module("app").controller("allAddApplicantsCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        initialize: function () {
            console.log("All add applicants controller");
        },
        uploadApplicantImages: function () {
            for (var index = 0; index < $rootScope.allApplicantsToBeAdded.length; index++) {
                console.log("Uploading images: " + $rootScope.allApplicantsToBeAdded[index].firstname);
                functions.uploadImageAsPromise($rootScope.allApplicantsToBeAdded[index]);
            }
            $rootScope.allApplicantsToBeAdded = [];
        },
        uploadImageAsPromise: function (applicant) {
            console.log("Uploading images step 2");
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
                            url: $rootScope.baseURL + "secure-api/uploadApplicantImage",
                            method: "POST",
                            data: {
                                signature: JSON.stringify($rootScope.userlogged),
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
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        }
    }

    functions.initialize();

    $scope.functions = {
        hideAllAddApplicantModal: function () {
            $rootScope.showAllAddApplicants = false;
            $rootScope.showAddApplicant = true;
        },
        addApplicants: function () {
            $http({
                url: "http://127.0.0.1:9001/secure-api/addApplicant",
                method: "POST",
                data: {
                    token: localStorage.getItem("token"),
                    signature: JSON.stringify($rootScope.userlogged),
                    allApplicants: $rootScope.allApplicantsToBeAdded
                }
            }).then(function (response) {
                functions.uploadApplicantImages();
                setTimeout(function () {
                    $rootScope.showAllAddApplicants = false;
                    $rootScope.showAddApplicant = false
                    $scope.$apply();
                });
            });
        },
        removeApplicant: function (applicant) {
            setTimeout(function () {
                $rootScope.allApplicantsToBeAdded.splice($rootScope.allApplicantsToBeAdded.indexOf(applicant, 1));
                $scope.$apply();
            });
        }
    }
});