angular.module('app.core')
	.constant('appConfig', {
		APP_VERSION: '0.1',
		API_URL: 'https://10.4.1.145/api',
		AUTH_URL:'https://10.4.1.204/auth/user',
		FP_URL: 'https://10.4.1.204/forgetpassword/user',
		MIN_PASSWORD_LENGTH:8,
		MAX_PASSWORD_LENGTH:24
	});