angular.module('app')
    .constant('appConfig', {
        APP_VERSION: '0.1',
        API_URL: '//10.4.1.145/api',
        AUTH_URL: '//10.4.1.145/auth/user',
        FP_URL: '//10.4.1.145/forgetpassword/user',
        UM_URL: '//10.4.1.198/req/api/usermgmt',
        MIN_PASSWORD_LENGTH: 8,
        MAX_PASSWORD_LENGTH: 24
    });