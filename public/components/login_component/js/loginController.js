angular.module("app").controller("loginCtrl", function ($scope, $rootScope, $http, queue) {

    var functions = {
        initialize: function () {
            console.log("Login controller");
            functions.getInitialValues();
        },
        authenticate: function () {
            firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password)
                .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorMessage);
                    functions.createUser();
                });
        },
        createUser: function () {
            firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password)
                .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorMessage);
                });
        },
        resetForm: function () {
            $("#email").val(undefined);
            $("#email").blur();
            $("#password").val(undefined);
            $("#password").blur();
            $("#pin").val(undefined);
            $("#pin").blur();
        },
        getInitialValues: function () {
            $scope.auth = false;
            $rootScope.showForgotPassword = false;
        },
        initFirebase: function (token, user) {
            queue({
                url: $rootScope.baseURL + "secure-api/initFirebase",
                method: "POST",
                cache : true,
                data: {
                    signature: JSON.stringify(user),
                    token: token
                }
            }).then(function (response) {
                $(document).ready(function () {
                    console.log(response.data.config);
                    localStorage.setItem("firebaseconfig", JSON.stringify(response.data.config));
                    firebase.initializeApp(response.data.config);
                    $rootScope.isAuthenticated = true;
                    functions.authenticate();
                });
            });
        }
    }

    functions.initialize();

    $scope.functions = {
        logExam: function () {
            $rootScope.logExam = true;
        },
        login: function () {
            queue({
                url: $rootScope.baseURL + "api/authOne",
                method: "POST",
                cache : true,
                data: {
                    user: {
                        email: $scope.email,
                        password: $scope.password
                    }
                }
            }).then(function (response) {
                console.log(JSON.stringify(response.data));
                M.toast({
                    html: response.data.message,
                    displayLength: 2500
                });
                if (response.data.valid) {
                    $scope.user = response.data.user;
                    $scope.auth = true;
                }
            });
        },
        cancel: function () {
            queue({
                url: $rootScope.baseURL + "api/cancelAuth",
                method: "POST",
                cache : true,
                data: {
                    user: $scope.user
                }
            }).then(function (response) {
                console.log(response.data);
                $scope.auth = false;
                functions.resetForm();
            })
        },
        authTwo: function () {
            queue({
                url: $rootScope.baseURL + "api/authTwo",
                method: "POST",
                cache : true,
                data: {
                    pin: $scope.pin,
                    user: $scope.user
                }
            }).then(function (response) {
                // console.log(response.data);
                if (response.data.valid) {
                    functions.initFirebase(response.data.token, response.data.user);
                    $scope.auth = false;
                    functions.resetForm();
                    $rootScope.token = response.data.token;
                    $rootScope.isLogged = true;
                    $rootScope.userlogged = response.data.user;
                    localStorage.setItem("userlogged", JSON.stringify($rootScope.userlogged));
                    localStorage.setItem("token", response.data.token);
                    window.location.href = "#!/";
                } else {
                    M.toast({
                        html: "Invalid code",
                        displayLength: 2500
                    });
                    $scope.functions.cancel();
                }
            });
        },
        showForget: function () {
            $rootScope.showForgotPassword = true;
        }
    }
});