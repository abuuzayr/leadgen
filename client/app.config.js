angular.module('app')
    .constant('appConfig', {
        APP_VERSION: '0.1',
        API_URL: '//10.4.1.213/api',
        AUTH_URL: '//10.4.1.213/auth/user',
        FP_URL: '//10.4.1.213/forgetpassword/user',
        UM_URL: '//10.4.1.213/usermgmt',
        MIN_PASSWORD_LENGTH: 8,
        MAX_PASSWORD_LENGTH: 24
    });
