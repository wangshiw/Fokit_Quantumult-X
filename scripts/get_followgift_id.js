/**
 *
 * [rewrite_local]
 * ^https\:\/\/api\.m\.jd\.com\/client\.action\?functionId\=drawShopGift url script-request-body followShopInfo.js
 */
const $ = new Env("关注有礼抓取ID");
const quotation=[
  '只要我够努力，老板很快就会过上他想要的生活，该起床奋斗了，打工人!',
  '靠别人，是公主，靠你叽哇，是日本人，靠自己，我是光荣的打工人!',
  '打工赚不了几个钱，但是多打几份工，可以让你没有时间花钱!',
  '打工累吗？累，但是我不能哭，因为骑电动车的时候，擦眼泪不安全!',
  '这么不努力，怎么做打工人啊你!',
  '打工人 打工魂 打工人都是人上人！',
  '应对失眠的最好办法就是通宵 晚安 打工人！',
  '打工可能会少活十年，不打工你一天也活不下去。早点睡，打工人。',
  '冷吗？冷就对了，温暖是留给开小轿车的人。早安，共享单车人！',
  '难吗？难就对了，只要我们不努力，总有一天没饭吃。早安，打工人！',
  '累吗？累就对了，舒服是留给有钱人的。早安，打工人！！',
  '没有困难的工作，只有勇敢的打工人！',
  '在天愿作比翼鸟 在地怨为打工人',
  '打工可能会少活十年，不打工你一天也活不下去。早点睡，打工人!',
  '有人相爱，有人夜里看海，有人七八个闹钟起不来，早安打工人!',
  '爱情不是生活的全部，打工才是。早安，打工人!',
  '我带上了头盔，就无法吻你;摘下了头灰被交警罚款 50。早安，打工人!',
  '每天对着空气挥一拳，不为别的，就为干这个世界！早安，打工人!',
  '不是工作需要我，而是我需要工作，我打工，我快乐。早安，打工人！',
  '不拼爹，不拼娘，不拼工作，不拼钱，我们打工人只拼命。努力！打工人！',
  '天气变冷不像夏天的砖那么烫手了，就是总下雨滑不溜丢的。加油，打工人！',
  '世上有两种最耀眼的光芒，一种是太阳，一种是打工人努力的模样。早上好，打工人！',
  '说起打工就流泪；打工烦，打工难，真的好想把家还！',
  '年年打工年年愁，天天加班像只猴，加班加点无报酬，天天挨骂无理由！',
  '属于我的天堂只有一个打工天堂！',
  '有人夜夜笙歌，有人一大早为生活奔波，早安打工人！'
]
const quotationIndex = Math.floor((Math.random()*quotation.length));
const quotationStr = quotation[quotationIndex];
let TG_BOT_TOKEN = `1814918753:AAHgOQVK6vya9UnI_4hTiFfVlyRMIExTsAY`;
let TG_USER_ID = `-1001589058412`;

var jUrl = $request.url;
var jBody = $request.body;
var queryStr = jUrl.split("?")[1];
console.log(jUrl);
console.log(jBody);
var reqBody = getQueryString(jBody, "body");
var clientVersion = getQueryString(jBody, "clientVersion");
var openudid = getQueryString(jBody, "openudid");
var reqSign = getQueryString(jBody, "sign");
var reqSt = getQueryString(jBody, "st");
var reqSv = getQueryString(jBody, "sv");

reqBody = JSON.parse(reqBody);

var notifyText = `/env FOLLOW_SHOP_ID="${reqBody.shopId}"\n/env FOLLOW_VENDER_ID="${reqBody.venderId}"\n/env FOLLOW_ACT_ID="${reqBody.activityId}"\n/env FOLLOW_SIGN="clientVersion=${clientVersion}|openudid=${openudid}|sign=${reqSign}|st=${reqSt}|sv=${reqSv}"\n\n${quotationStr}`;

!(async () => {
  if (reqBody.shopId) {
    try {
      await update(notifyText, TG_BOT_TOKEN, TG_USER_ID);
      $.msg(`关注有礼`, `获取活动信息成功🎉`, `${notifyText}`);
    } catch (error) {
      $.logErr(error);
    } finally {
      $.done();
    }
  }
})()
  .catch((e) => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

function getQueryString(qStr, name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = qStr.match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

function update(body, tgBotToken, tgUserID) {
  text = `${body}`;
  let opt = {
    url: `https://api.telegram.org/bot${tgBotToken}/sendMessage`,
    body: `chat_id=${tgUserID}&text=${text}&disable_web_page_preview=true`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    timeout: 10000,
  };
  return new Promise((resolve) => {
    $.post(opt, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
        } else {
          data = JSON.parse(data);
          if (data.ok) {
            console.log("Telegram发送通知消息成功🎉。\n");
          } else if (data.error_code === 400) {
            console.log("请主动给bot发送一条消息并检查接收用户ID是否正确。\n");
          } else if (data.error_code === 401) {
            console.log("Telegram bot token 填写错误。\n");
          }
        }
      } catch (error) {
        $.logErr(error);
      } finally {
        resolve();
      }
    });
  });
}

// prettier-ignore
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
