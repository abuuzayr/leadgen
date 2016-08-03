angular.module('app')
    .constant('appConfig', {
        APP_VERSION: '0.1',
        API_URL: '//10.4.1.213/api',
        AUTH_URL: '//app.bulletsuite.com/api/auth/user',
        FP_URL: '//app.bulletsuite.com/api/forgetpassword/user',
        UM_URL: '//app.bulletsuite.com/api/usermgmt',
        MIN_PASSWORD_LENGTH: 8,
        MAX_PASSWORD_LENGTH: 24
    });
