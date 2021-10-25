const got = require('got');
const { readFile } = require('fs/promises');
const path = require('path');
const {CookieJar} = require('tough-cookie');
const {promisify} = require('util');
// const qlDir = process.env.QL_DIR || '/ql';
// const authFile = path.join(qlDir, 'config/auth.json');



function gotInit() {
  const cookieJar = new CookieJar();
  const setCookie = promisify(cookieJar.setCookie.bind(cookieJar));
  await setCookie('foo=bar', 'https://api.bilibili.com');
  const api = got.extend({
    retry: { limit: 0 },
    headers: {
      'x-unicorn': 'rainbow',
      'user-agent': ''
    },
    responseType: 'json',
    ...cookieJar
  });
  return api
}

let api = gotInit()

(async () => {
	try {
		const response = await got('https://sindresorhus.com');
		console.log(response.body);
		//=> '<!doctype html> ...'
	} catch (error) {
		console.log(error.response.body);
		//=> 'Internal server error ...'
	}
})()

// 登录检查
function userCheck() {

}

function run() {

}

let apiList = {
  reward: "https://api.bilibili.com/x/member/web/exp/reward",
  // PushPlus = "http://www.pushplus.plus/send";
  // ServerPush = "https://sc.ftqq.com/";
  // ServerPushV2 = "https://sctapi.ftqq.com/";
  // ServerPushTelegram = "https://api.telegram.org/bot";
  // LOGIN = "https://api.bilibili.com/x/web-interface/nav";
  // Manga = "https://manga.bilibili.com/twirp/activity.v1.Activity/ClockIn";
  // AvShare = "https://api.bilibili.com/x/web-interface/share/add";
  // CoinAdd = "https://api.bilibili.com/x/web-interface/coin/add";
  // isCoin = "https://api.bilibili.com/x/web-interface/archive/coins";
  // getRegionRanking = "https://api.bilibili.com/x/web-interface/ranking/region";
  // reward = "https://api.bilibili.com/x/member/web/exp/reward";
}

function getDailyTaskStatus() {

}
