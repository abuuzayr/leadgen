angular.module('app')
	.constant('appConfig', {
		APP_VERSION: '0.1',
		API_URL: '//192.168.1.14/api',
		AUTH_URL:'//10.4.1.204/auth/user',
		FP_URL: '//10.4.1.204/forgetpassword/user',
		MIN_PASSWORD_LENGTH:8,
		MAX_PASSWORD_LENGTH:24
	});
