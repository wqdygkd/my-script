const got = require('got');
// const path = require('path');
// const {CookieJar} = require('tough-cookie');
// const {promisify} = require('util');
// const qlDir = process.env.QL_DIR || '/ql';
// const authFile = path.join(qlDir, 'config/auth.json');

(async () => {
    let symbolList =  ['SHIB_USDT']

	try {
        const api = got.extend({
            retry: { limit: 0 },
            headers: {
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            },
            // responseType: 'json'
        });

		const response = await api('https://www.mexc.com/open/api/v2/market/ticker?symbol=SHIB_USDT');
		console.log(response.body);
	} catch (error) {
		console.log(error);
	}
})()
