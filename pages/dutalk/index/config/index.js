const envVersion = process.env.NODE_ENV;
let SERVER_URL = '';
let SECRET_KEY = '';
let app_RY_KEY = '';
let UPLOAD_URL = '';
let SCOKET_URL = '';
let SING_URL = '';
switch (envVersion) {
    case 'development'://开发版
        SERVER_URL = 'https://talk-api.omwchat.com';
        SECRET_KEY = 'UEtQo8Gk3';
        app_RY_KEY = '8brlm7uf8i5j3';
        SING_URL =  'https://tx.rutty.top/comm';
        UPLOAD_URL = 'https://tx.rutty.top/comm';
		SCOKET_URL = '124.90.43.2';
    break;
    
    default:
		
		SERVER_URL = 'https://talk-api.omwchat.com';
		SECRET_KEY = 'UEtQo8Gk3';
		app_RY_KEY = '8brlm7uf8i5j3';
		SING_URL =  'https://tx.rutty.top/comm';
		UPLOAD_URL = 'https://tx.rutty.top/comm';
		SCOKET_URL = '121.36.204.94';
        break;
}
export { SERVER_URL,SECRET_KEY,app_RY_KEY,UPLOAD_URL,SING_URL,SCOKET_URL };