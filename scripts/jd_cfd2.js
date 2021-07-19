/*
京喜财富岛-常规任务
crontab="11 0,7,12,19,23 * * *"
11 0,7,12,19,23 * * * 青龙cron - test
*/

const _ = require('lodash');
const format = require('date-fns/format');
const CryptoJS = require('crypto-js');
let common = require('./utils/common');
let $ = new common.env('京喜财富岛');

$.appId = 10028;
// 4栋🏠
$.strBuildIndexs = _.shuffle(['food', 'fun', 'shop', 'sea']);

const isDeveloper = process.env.id77 === '1' || false;
if (isDeveloper) {
  console.log(`🕖开发进行时...`);
}

$.shareCodes = [];

eval(common.eval.mainEval($));
async function prepare() {
  $.thread = 1;
}
async function main(id) {
  // 点击气球次数
  $.seatsTotal = 0;
  // 最多雇佣导游数量
  $.CanEmployTourGuide = 3;
  // 已雇佣导游数量
  $.EmployTourGuideNum = 0;
  // 有导游的房子
  $.EmployTourGuideIndex = [];
  // 没有导游的房子
  $.NoEmployTourGuideIndex = [];
  // 收垃圾执行控制(小时)
  $.QueryRubbishInfoTime = [8, 9, 18];

  try {
    await requestAlgo();

    await getUserInfo(true);

    await medal();

    const funs = [sign, game, buildLvUp, task];

    for (const f of _.shuffle(funs)) {
      await f();
    }
  } catch (e) {
    console.log(`运行出错:\n${e}`);
  }
}

async function extra() {
  if ([0, 23].includes(new Date().getHours())) {
    // 🤺击剑
    for (let i = 0; i < cookies.length; i++) {
      for (let j = 0; j < $.shareCodes.length; j++) {
        if (i === j) {
          console.log('🤺不能与自己击剑');
          continue;
        }

        console.log('🤺去助力:', $.shareCodes[j]);

        $.shareCodes[j] &&
          (await getData(
            'story/helpbystage',
            '_cfd_t,bizCode,dwEnv,ptag,source,strShareId,strZone',
            { strShareId: $.shareCodes[j] },
            cookies[i]
          ));

        if ($.source.iRet !== 0) {
          console.log('🤺', $.source.sErrMsg);
          if ($.source.iRet === 2232) {
            break;
          }
        } else {
          console.log('🤺', $.source);
        }
        await $.wait(3000);
      }

      console.log('------------');
    }

    if ($.shareCodes.length >= cookies.length) {
      console.log(
        '🤺击剑员编号汇总：',
        $.shareCodes.slice(0, cookies.length).join('&')
      );
    }
  }
}

function sign() {
  return new Promise(async (resolve) => {
    // 📝签到
    await getData(
      'story/GetTakeAggrPage',
      '_cfd_t,bizCode,dwEnv,ptag,source,strZone'
    );

    $.TakeAggrPage = $.source;

    for (let s of $.source.Data.Sign.SignList) {
      const {
        ddwCoin,
        ddwMoney,
        dwPrizeType,
        strPrizePool,
        dwBingoLevel,
        dwDayId,
        dwStatus,
      } = s;
      if ($.TakeAggrPage.iRet === 0) {
        if (dwDayId === $.TakeAggrPage.Data.Sign.dwTodayId) {
          if (dwStatus !== 1) {
            await getData(
              'story/RewardSign',
              '_cfd_t,bizCode,ddwCoin,ddwMoney,dwEnv,dwPrizeLv,dwPrizeType,ptag,source,strPrizePool,strZone',
              {
                ddwCoin,
                ddwMoney,
                dwPrizeType,
                strPrizePool,
                dwPrizeLv: dwBingoLevel || 2,
              }
            );

            if ($.source.iRet === 0) {
              console.log(`📝签到成功`);
            }

            await $.wait(1000);
          } else {
            console.log(`📝今日已签到`);
            break;
          }
        }
      } else {
        console.log('📝', $.source.sErrMsg);
      }
    }

    resolve();
  });
}

// 🎡游戏城
function game() {
  return new Promise(async (resolve) => {
    await getData('user/ComposeGameState');

    for (let n = $.source.dwCurProgress; n < 8; n++) {
      await getData('user/ComposeGameState');

      $.gameInfo = $.source;

      const { strMyShareId, strDT } = $.gameInfo;

      let index = 0;

      if (n === 0) {
        index = 0;
      } else if (0 < n < 4) {
        index = 1;
      } else {
        index = 2;
      }

      if (strDT) {
        for (let k = 0; k < _.random(26, 30); k++) {
          await getData('user/RealTmReport', '', {
            strMyShareId,
          });
          await $.wait(1000, 1777);
        }

        await getData('user/ComposeGameAddProcess', '__t,strBT,strZone', {
          strBT: strDT,
        });

        if (n + 1 === $.source.dwCurProgress) {
          console.log(`🎡已合成${$.source.dwCurProgress}个珍珠`);
        }
        await $.wait(1000);
      }
    }

    await getData('user/ComposeGameState');
    $.gameInfo = $.source;

    for (let i of Object.keys($.gameInfo.stagelist)) {
      let s = $.gameInfo.stagelist[i];
      if ($.gameInfo.dwCurProgress >= s.dwCurStageEndCnt && s.dwIsAward === 0) {
        await $.wait(1000);
        await getData('user/ComposeGameAward', '__t,dwCurStageEndCnt,strZone', {
          dwCurStageEndCnt: s.dwCurStageEndCnt,
        });

        if ($.source.iRet === 0) {
          for (const t in $.source) {
            let type = '';
            switch (t) {
              case 'ddwCoin':
                type = '京币';
                break;
              case 'ddwMoney':
                type = '财富';
                break;

              default:
                break;
            }
            if ($.source[t] > 0 && type) {
              if (t === 'ddwCoin')
                $.userInfo.StoryInfo.Mermaid.ddwCoin += $.source[t];
              console.log(
                `🎡领取第${s.dwCurStageEndCnt}颗珍珠奖励：${type} ${$.source[t]}`
              );
            }
          }
        } else {
          console.log('🎡', $.source.sErrMsg);
        }
      }
    }
    resolve();
  });
}

// 🏡房子升级
function buildLvUp() {
  return new Promise(async (resolve) => {
    for (let building of _.shuffle($.buildings)) {
      if (building.dwCanLvlUp === 1) {
        // 🏡升级京币查询
        await getData(
          'user/GetBuildInfo',
          '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strBuildIndex,strZone',
          { strBuildIndex: building.strBuildIndex }
        );
        console.log(
          `🏡${$.source.strBuildIndex}升级需要:`,
          $.source.ddwNextLvlCostCoin
        );
        await $.wait(1000);

        if ($.source.ddwNextLvlCostCoin > $.userInfo.ddwCoinBalance) {
          // 京币不够，先领币
          await collectCoin();
          await $.wait(777);
        }

        if ($.source.dwCanLvlUp === 1) {
          // 🏡升级
          await getData(
            'user/BuildLvlUp',
            '_cfd_t,bizCode,ddwCostCoin,dwEnv,ptag,source,strBuildIndex,strZone',
            {
              ddwCostCoin: $.source.ddwNextLvlCostCoin,
              strBuildIndex: $.source.strBuildIndex,
            }
          );
          if ($.source.iRet === 0) {
            console.log(`🏡升级成功`);
            $.userInfo.ddwCoinBalance -= $.source.ddwNextLvlCostCoin;
            await $.wait(2000);
          }
        }
      }
    }
    resolve();
  });
}

function collectCoin() {
  return new Promise(async (resolve) => {
    // 💰收京币
    for (const i in _.shuffle($.buildings)) {
      const { strBuildIndex } = $.buildings[i];
      await collectOneCoin(strBuildIndex);
      await $.wait(1000);
    }
    resolve();
  });
}

function collectOneCoin(strBuildIndex, dwType = 1) {
  return new Promise(async (resolve) => {
    await getData(
      'user/CollectCoin',
      '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strBuildIndex,strZone',
      { strBuildIndex: strBuildIndex, dwType }
    );
    if ($.source.iRet === 0) {
      console.log(`💰${strBuildIndex}收京币:`, $.source.ddwCoin);
      $.userInfo.ddwCoinBalance += $.source.ddwCoin;
    } else {
      console.log('💰', $.source.sErrMsg);
    }

    resolve();
  });
}

function medal() {
  return new Promise(async (resolve) => {
    // 每天23时处理，应该收益较高
    if (
      new Date().getHours() === 23 ||
      // 1 ||
      isDeveloper
    ) {
      await getData(
        'story/QueryMedalList',
        '_cfd_t,bizCode,dwEnv,ptag,source,strZone'
      );

      $.MedalList = _.pick($.source.Data.MedalList, ['Love', 'Env', 'Shop']);

      for (const medalType of Object.keys($.MedalList)) {
        const Medal = $.MedalList[medalType].filter(
          (i) => i.dwHasRatio === 100 && i.dwStatus === 2
        );
        // 避免浪费宣章，一次一个种类值使用一次;
        const o = Medal[0];
        if (!o) continue;
        // for (const o of Medal) {
        // 筛选可用成就勋章加成进行使用
        await getData(
          'story/UserMedal',
          '_cfd_t,bizCode,dwEnv,dwLevel,dwType,ptag,source,strZone',
          { dwType: o.dwType, dwLevel: o.dwLevel }
        );

        if ($.source.iRet === 0) {
          console.log(
            `🎖使用「${o.strMedalName}」成就勋章加成中，需要等待${o.dwEffectTime}秒`
          );
          await $.wait((o.dwEffectTime * 1000) / 2);

          switch (medalType) {
            case 'Love':
              await collectOneCoin(o.strBuildType);
              break;
            case 'Env':
              await collectOneCoin(o.strBuildType);
              break;
            case 'Shop':
              await getUserInfo();
              await sceneGame();
              break;

            default:
              break;
          }

          console.log(`🎖使用「${o.strMedalName}」成就宣章完成~`);
        } else {
          console.log(
            `🎖使用「${o.strMedalName}」成就勋章错误，${$.source.sErrMsg}`
          );

          if ($.source.iRet === 5111) {
            await sceneGame();
          } else {
            await $.wait((o.dwEffectTime * 1000) / 2);
          }
        }

        await $.wait((o.dwEffectTime * 1000) / 2);
        // }
      }
    }

    resolve();
  });
}

// 场景游戏
function sceneGame() {
  return new Promise(async (resolve) => {
    if ($.userInfo.StoryInfo.Mermaid || $.userInfo.StoryInfo.StoryList) {
      let sceneType;
      let storyInfo = {};
      let dwType;

      if ($.userInfo.StoryInfo.Mermaid && !$.userInfo.StoryInfo.StoryList) {
        // 美人鱼沙滩拾取京币条件
        storyInfo = $.userInfo.StoryInfo.Mermaid;
        sceneType = 2;
      }

      if (
        $.userInfo.StoryInfo.StoryList &&
        $.userInfo.StoryInfo.StoryList.length > 0
      ) {
        storyInfo = $.userInfo.StoryInfo.StoryList[0];
        sceneType = storyInfo.dwType;
      }

      let { strStoryId, ddwTriggerDay, dwRewardType, dwStatus, dwIsToday } =
        storyInfo;
      dwType = storyInfo.dwType;
      $.Special = storyInfo.Special || {};
      $.Collector = storyInfo.Collector || {};
      $.Mermaid = storyInfo.Mermaid || {};

      let body = {};
      switch (sceneType) {
        case 1:
          // ⛴船
          dwType = dwStatus ? dwStatus + 1 : 2;

          body = {
            strStoryId,
            dwType,
            ddwTriggerDay,
            triggerType: $.Special.dwTriggerType,
          };

          await getData(
            'story/SpecialUserOper',
            '_cfd_t,bizCode,ddwTriggerDay,dwEnv,dwType,ptag,source,strStoryId,strZone,triggerType',
            body
          );

          if ($.source.iRet === 0) {
            switch (dwType) {
              case 2:
                console.log(`⛴${$.Special.strName}：`, $.Special.strTalk);
                console.log(`⛴接待`, $.Special.strName);
                $.userInfo.StoryInfo.StoryList[0].dwStatus += 1;
                await $.wait($.Special.dwWaitTime * 1000 + 200);
                await sceneGame();
                break;
              case 3:
                console.log(
                  `⛴成功接待轮船旅客：${$.Special.strName}，获得${$.Special.ddwCoin}京币`
                );
                $.userInfo.ddwCoinBalance += $.Special.ddwCoin;
                await $.wait(1000);
                await getUserInfo();
                await sceneGame();
                break;
              default:
                break;
            }
          } else {
            console.log('⛴', $.source.sErrMsg);
          }
          break;
        case 2:
          // 🧜‍♀️美人鱼
          if ($.userInfo.StoryInfo.Mermaid && !$.userInfo.StoryInfo.StoryList) {
            // 美人鱼沙滩拾取京币条件
            dwType = 2;
          } else {
            dwType = $.Mermaid.dwIsToday === 1 ? 1 : 4;
          }

          // if (dwIsToday === 0) {
          //   dwType = 4;
          // }

          body = {
            strStoryId,
            dwType,
            ddwTriggerDay,
          };

          await getData(
            'story/MermaidOper',
            '_cfd_t,bizCode,ddwTriggerDay,dwEnv,dwType,ptag,source,strStoryId,strZone',
            body
          );

          if ($.source.iRet === 0 || $.source.iRet === 5202 || dwType === 1) {
            // strTalk: '终于有人来了！我在沙滩等了好久，快帮帮我~';
            // strTalk2: '快速点击爱心帮我恢复体力吧';
            // strTalk3: '感谢岛主大人的搭救之恩，等我重新回到大海，要把海底最珍贵的礼物送给你，{crossDay}还在这里见，记得等我哦~';
            // strTalk4: '岛主大人，还记得我吗？谢谢你昨天救了我，这是我的谢礼，快收下吧~';

            switch (dwType) {
              case 1:
                console.log(`🧜‍♀️美人鱼：`, $.Mermaid.strTalk);
                console.log(`🧜‍♀️美人鱼：`, $.Mermaid.strTalk2);
                console.log(
                  `🧜‍♀️美人鱼：`,
                  $.Mermaid.strTalk3.replace(
                    '{crossDay}',
                    $.Mermaid.dwIsAcrossDay === 1 ? '明天' : '今天'
                  )
                );
                await $.wait(1000);
                await getUserInfo();
                await sceneGame();
                break;
              case 2:
                console.log(
                  `🧜‍♀️美人鱼沙滩拾得京币：`,
                  $.userInfo.StoryInfo.Mermaid.ddwCoin
                );
                $.userInfo.ddwCoinBalance +=
                  $.userInfo.StoryInfo.Mermaid.ddwCoin;

                break;
              case 4:
                console.log(`🧜‍♀️美人鱼：`, $.Mermaid.strTalk4);
                console.log(
                  `🧜‍♀️昨日解救美人鱼成功：获得${$.source.Data.Prize.strPrizeName}`
                );
                await $.wait(1000);
                await getUserInfo();
                await sceneGame();
                break;
              default:
                break;
            }
          } else {
            console.log('🧜‍♀️', $.source.sErrMsg);
          }
          break;
        case 4:
          // 🕵️‍♂️贝壳商人
          dwType = dwStatus;

          if (dwType > 1) {
            await getData(
              'story/CollectorOper',
              '_cfd_t,bizCode,ddwTriggerDay,dwEnv,dwType,ptag,source,strStoryId,strZone',
              {
                strStoryId,
                dwType,
                ddwTriggerDay,
              }
            );
          }

          if ($.source.iRet === 0 || dwType === 1) {
            switch (dwType) {
              case 1:
                // strRecvDesc: '听说岛上有很多贝壳，可以捡一些卖给我吗？我在岛上只停留⏰5分钟哦~';
                // strSellDesc: '哇~捡到了这么多贝壳，快点卖给我吧~';
                console.log(`🕵️‍♂️偶遇`, $.Collector.strRecvDesc);
                $.userInfo.StoryInfo.StoryList[0].dwStatus += 1;
                await sceneGame();
                break;
              case 2:
                await getData(
                  'story/querystorageroom',
                  '_cfd_t,bizCode,dwEnv,ptag,source,strZone'
                );

                $.source.iRet !== 0 &&
                  console.log(`🕵️‍♂️querystorageroom：`, $.source);

                $.wait(600);
                const _shell =
                  $.source.Data.Office[
                    _.random($.source.Data.Office.length - 1)
                  ];
                const strTypeCnt = `${_shell.dwType}:${_shell.dwCount}`;

                await getData(
                  'story/sellgoods',
                  '_cfd_t,bizCode,dwEnv,dwSceneId,ptag,source,strTypeCnt,strZone',
                  {
                    strTypeCnt,
                    dwSceneId: 2,
                  }
                );
                console.log(`🕵️‍♂️卖贝壳给商人,获得京币：`, $.source.Data.ddwCoin);
                $.userInfo.ddwCoinBalance += $.source.Data.ddwCoin;
                $.wait(3000);

                $.userInfo.StoryInfo.StoryList[0].dwStatus = 4;
                await sceneGame();

                break;
              case 4:
                // console.log(`🕵️‍♂️卖贝壳给商人结果：`, $.source);
                // TODO；成就-经商待完成
                await $.wait(1000);
                await getUserInfo();
                await sceneGame();
                break;
              default:
                break;
            }
          } else {
            console.log('🕵️‍♂️', $.source.sErrMsg);
          }
          break;
        default:
          break;
      }
    }

    resolve();
  });
}

function task() {
  return new Promise(async (resolve) => {
    // 📒获取任务
    await getData(
      'GetUserTaskStatusList',
      '_cfd_t,bizCode,dwEnv,ptag,source,strZone,taskId'
    );

    // 📒查任务
    $.tasks = $.source.data.userTaskStatusList || [];
    let tasks1 = _.shuffle(
      $.tasks.filter((t) => t.awardStatus !== 1 && t.taskCaller === 1)
    );

    if (tasks1.length === 0) {
      console.log(`📆日常任务-已做完`);
    } else {
      console.log(`📆日常任务-列表，总共${tasks1.length}个任务！`);
    }

    let tasks2 = _.shuffle(
      $.tasks.filter(
        (t) =>
          t.completedTimes >= t.targetTimes &&
          t.awardStatus !== 1 &&
          t.taskCaller === 2
      )
    );

    if (tasks2.length === 0) {
      console.log(`🎖成就任务-没有完成的成就任务`);
    } else {
      console.log(`🎖成就任务-列表，总共${tasks2.length}个成就奖励可领！`);
    }

    // 📒做日常任务
    for (let i = 0; i < tasks1.length; i++) {
      const { completedTimes, targetTimes, taskName, taskId } = tasks1[i];
      console.log(`\n📆开始第${i + 1}个日常任务-${taskName}`);
      for (let i = completedTimes; i < targetTimes; i++) {
        //做任务
        console.log(`📆日常任务-${taskName} 进度：${i + 1}/${targetTimes}`);
        await getData(
          'DoTask',
          '_cfd_t,bizCode,configExtra,dwEnv,ptag,source,strZone,taskId',
          { taskId: taskId, configExtra: '' }
        );
        await $.wait(_.random(1500, 2000));
      }
      //领取奖励
      await getData(
        'Award',
        '_cfd_t,bizCode,dwEnv,ptag,source,strZone,taskId',
        { taskId: taskId }
      );

      if ($.source.ret === 0 && $.source.data.prizeInfo) {
        $.logText = `获得京币 ¥ ${JSON.parse($.source.data.prizeInfo).ddwCoin}`;
        $.userInfo.ddwCoinBalance += JSON.parse(
          $.source.data.prizeInfo
        ).ddwCoin;
      } else {
        $.logText = $.source.msg;
      }
      console.log(`📆日常奖励-${taskName} ${$.logText}`);
    }

    // 查询是否领取完毕
    await getData(
      'story/DelayBizReq',
      '_cfd_t,bizCode,dwEnv,ptag,source,strZone'
    );

    const { dwStatus } = $.source.Data.ActiveTask;

    if ($.source.iRet === 0 && dwStatus !== 4) {
      // 📒领取每日任务奖励
      await getData(
        'story/GetActTask',
        '_cfd_t,bizCode,dwEnv,ptag,source,strZone'
      );

      if ($.source.iRet === 0) {
        for (let t of $.source.Data.TaskList) {
          const {
            dwCompleteNum,
            dwTargetNum,
            dwAwardStatus,
            strTaskName,
            ddwTaskId,
          } = t;
          // 单独处理领京币次数任务
          if (
            (strTaskName === '收8次京币' || ddwTaskId === 1628) &&
            dwStatus < 3
          ) {
            for (let index = 0; index < 2; index++) {
              // 4*2
              await collectCoin();
            }
          }
          if (dwCompleteNum >= dwTargetNum && dwAwardStatus !== 1) {
            //领取奖励
            await getData(
              'Award',
              '_cfd_t,bizCode,dwEnv,ptag,source,strZone,taskId',
              { taskId: ddwTaskId, bizCode: 'jxbfddch' }
            );

            if ($.source.ret === 0 && $.source.data.prizeInfo) {
              $.logText = `获得京币 ¥ ${
                JSON.parse($.source.data.prizeInfo).ddwCoin
              }`;
              $.userInfo.ddwCoinBalance += JSON.parse(
                $.source.data.prizeInfo
              ).ddwCoin;
            } else {
              $.logText = $.source.msg;
            }
            console.log(`📆日常奖励-${strTaskName} ${$.logText}`);
            await $.wait(2000);
          }
        }
      } else {
        console.log('📆', $.source.sErrMsg);
      }

      // 🐂牛头领奖励
      if (dwStatus === 3) {
        await getData(
          'story/ActTaskAward',
          '_cfd_t,bizCode,dwEnv,ptag,source,strZone'
        );

        if ($.source.iRet === 0) {
          $.logText = `获得财富 ¥ ${$.source.Data.ddwBigReward}`;
        } else {
          $.logText = $.source.sErrMsg;
        }
        console.log(`🐂每日任务开宝箱- ${$.logText}`);
      }
    }

    // 📒成就任务奖励领取
    for (let i = 0; i < tasks2.length; i++) {
      const { completedTimes, targetTimes, taskName, taskId } = tasks2[i];
      console.log(`\n🎖开始第${i + 1}个成就任务-${taskName}\n`);

      if (completedTimes < targetTimes) {
        console.log(`🎖成就奖励-${taskName} 该成就任务未达到门槛\n`);
      } else {
        //领取奖励
        await getData(
          'Award',
          '_cfd_t,bizCode,dwEnv,ptag,source,strZone,taskId',
          { taskId }
        );
        await $.wait(1000);

        if ($.source.ret === 0 && $.source.data.prizeInfo) {
          $.logText = `获得财富值 ¥ ${
            JSON.parse($.source.data.prizeInfo).ddwMoney
          }`;
        } else {
          $.logText = $.source.msg;
        }
        console.log(`🎖成就奖励-${taskName} ${$.logText}`);
      }
    }

    // 👭领取助力奖励
    if ($.TakeAggrPage) {
      const EmployeeList = $.TakeAggrPage.Data.Employee.EmployeeList || [];
      for (let f = 0; f < EmployeeList.length; f++) {
        const Employee = EmployeeList[f];
        const { dwId, dwStatus } = Employee;

        if (dwStatus !== 1) {
          await getData(
            'story/helpdraw',
            '_cfd_t,bizCode,dwEnv,dwUserId,ptag,source,strZone',
            { dwUserId: dwId }
          );
          if ($.source.iRet === 0) {
            console.log('👬助力奖励-领取成功', $.source.Data.ddwCoin);
          } else if ($.source.iRet === 1000) break;
          else {
            console.log('👭助力奖励-领取其他错误:', $.source);
            break;
          }
          await $.wait(2000);
        }
      }
    }

    resolve();
  });
}

function getUserInfo(showUserInfo = false) {
  return new Promise(async (resolve) => {
    await getData(
      'user/QueryUserInfo',
      '_cfd_t,bizCode,ddwTaskId,dwEnv,ptag,source,strMarkList,strShareId,strZone',
      { ddwTaskId: '', strShareId: '', strMarkList: 'undefined' }
    );

    if ($.source.iRet !== 0) {
      console.log('查询财富岛信息失败：', $.source);
      resolve($.source);
    }

    if (showUserInfo) {
      const { dwLandLvl, ddwCoinBalance, ddwRichBalance } = $.source;
      console.log(
        `当前等级:${dwLandLvl}\n京币:${ddwCoinBalance}\n财富值:${ddwRichBalance}\n`
      );
    }

    if (!$.shareCodes) {
      $.shareCodes = [];
    }

    // 🤺保存击剑码
    if (!$.shareCodes.includes($.source.strMyShareId)) {
      $.shareCodes.push($.source.strMyShareId);
    }

    $.source.buildInfo &&
      ($.buildings = _.shuffle(
        $.source.buildInfo.buildList.map((i) => {
          if (i.dwHaveTourGuide === 1) {
            // 有导游的时候
            $.EmployTourGuideNum += 1;
            $.EmployTourGuideIndex.push(i.strBuildIndex);
          } else {
            // 没有导游
            $.NoEmployTourGuideIndex.push(i.strBuildIndex);
          }
          !$.strBuildIndexs.includes(i.strBuildIndex) &&
            $.strBuildIndexs.push(i.strBuildIndex);
          $.seatsTotal += i.dwContain;
          return i;
        })
      ));

    $.userInfo = $.source;

    resolve($.source);
  });
}

function getData(fn, stk, params = {}, cookie) {
  return new Promise(async (resolve) => {
    let _otherHeaders = {};
    let _params = {
      headers: {
        'user-agent':
          'jdpingou;iPhone;4.11.0;14.5;;network/wifi;model/iPhone11,8;appBuild/100591;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/22;pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        Host: 'm.jingxi.com',
        Referer:
          'https://st.jingxi.com/fortune_island/index2.html?ptag=138631.26.55&trace=',
        cookie: cookie || $.cookie,
      },
      console: process.env.JD_DEBUG == 'true',
    };

    if (
      [
        'user/QueryUserInfo',
        'user/GetBuildInfo',
        'user/CollectCoin',
        'user/BuildLvlUp',
        'user/EmployTourGuideInfo',
        'user/EmployTourGuide',
        'user/SpeedUp',
        'user/ComposeGameState',
        'user/ComposeGameAddProcess',
        'user/ComposeGameAward',
        'story/QueryMedalList',
        'story/UserMedal',
        'story/QueryUserStory',
        'story/DelayBizReq',
        'story/GetTakeAggrPage',
        'story/RewardSign',
        'story/GetActTask',
        'story/ActTaskAward',
        'story/queryshell',
        'story/pickshell',
        'story/SpecialUserOper',
        'story/CollectorOper',
        'story/sellgoods',
        'story/helpbystage',
        'story/helpdraw',
        'user/ExchangeState',
        'user/ExchangePrize',
      ].includes(fn)
    ) {
      _params.url = `https://m.jingxi.com/jxbfd/${fn}?strZone=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&_ste=1&_=${Date.now()}&sceneval=2&_stk=${encodeURIComponent(
        stk
      )}`;
    }

    if (
      [
        'story/QueryRubbishInfo',
        'story/RubbishOper',
        'story/querystorageroom',
        'story/MermaidOper',
      ].includes(fn)
    ) {
      _params.url = `https://m.jingxi.com/jxbfd/${fn}?strZone=jxbfd&source=jxbfd&dwEnv=4&_cfd_t=${Date.now()}&ptag=&_ste=1&_=${Date.now()}&sceneval=2&_stk=${encodeURIComponent(
        stk
      )}`;
    }

    if (['GetUserTaskStatusList', 'Award', 'DoTask'].includes(fn)) {
      _params.url = `https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?strZone=jxbfd&&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&_stk=${encodeURIComponent(
        stk
      )}&_ste=1&_=${Date.now()}&sceneval=2`;

      _otherHeaders = {
        'Sec-Fetch-Dest': 'script',
        'X-Proxyman-Repeated-ID': '09920498',
        'X-Requested-With': 'com.jd.pingou',
        'Sec-Fetch-Site': 'same-site',
        Connection: 'close',
        'Sec-Fetch-Mode': 'no-cors',
      };
    }

    if (['user/ComposeGameState'].includes(fn)) {
      _params.url = `https://m.jingxi.com/jxbfd/${fn}?__t=${Date.now()}&strZone=jxbfd&dwFirst=1&_=${Date.now()}&sceneval=2`;
    }

    if (['user/RealTmReport'].includes(fn)) {
      _params.url = `https://m.jingxi.com/jxbfd/${fn}?__t=${Date.now()}&dwIdentityType=0&strBussKey=composegame&ddwCount=5&_=${Date.now()}&sceneval=2`;
    }

    _params.headers = Object.assign({ ..._params.headers }, _otherHeaders);

    if (Object.keys(params).length !== 0) {
      for (let key in params) {
        if (params.hasOwnProperty(key)) _params.url += `&${key}=${params[key]}`;
      }
    }
    if (!_params.url.includes('bizCode=')) {
      _params.url += `&bizCode=jxbfd`;
    }

    if (stk) {
      _params.url += '&h5st=' + decrypt(stk, _params.url);
    }

    await $.curl(_params);

    resolve($.source);
  });
}

async function requestAlgo() {
  $.fingerprint = await generateFp();
  return new Promise(async (resolve) => {
    let _params = {
      url: `https://cactus.jd.com/request_algo?g_ty=ajax`,
      body: `{"version":"1.0","fp":"${$.fingerprint}","appId":${
        $.appId
      },"timestamp":${Date.now()},"platform":"web","expandParams":""}`,
      headers: {
        Authority: 'cactus.jd.com',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        Accept: 'application/json',
        Origin: 'https://st.jingxi.com',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        'user-agent':
          'jdpingou;iPhone;4.11.0;14.5;;network/wifi;model/iPhone11,8;appBuild/100591;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/22;pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        referer: 'https://st.jingxi.com',
        cookie: $.cookie,
      },
      //   console: true,
    };

    await $.curl(_params);
    const data = $.source;
    if (data['status'] === 200) {
      $.token = data.data.result.tk;
      let enCryptMethodJDString = data.data.result.algo;
      if (enCryptMethodJDString)
        $.enCryptMethodJD = new Function(`return ${enCryptMethodJDString}`)();
    } else {
      console.log(`fp: ${$.fingerprint}`);
      console.log('request_algo 签名参数API请求失败:');
    }
    resolve(200);
  });
}

function decrypt(stk, url) {
  const timestamp = format(new Date(), 'yyyyMMddhhmmssSSS');
  let hash1;
  let { fingerprint, token, enCryptMethodJD, appId } = $;
  if (fingerprint && token && enCryptMethodJD) {
    hash1 = enCryptMethodJD(
      token,
      fingerprint.toString(),
      timestamp.toString(),
      appId.toString(),
      CryptoJS
    ).toString(CryptoJS.enc.Hex);
  } else {
    const random = '5gkjB6SpmC9s';
    token = `tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc`;
    fingerprint = 9686767825751161;
    // $.fingerprint = 7811850938414161;
    const str = `${token}${fingerprint}${timestamp}${appId}${random}`;
    hash1 = CryptoJS.SHA512(str, token).toString(CryptoJS.enc.Hex);
  }
  let st = '';
  stk.split(',').map((item, index) => {
    st += `${item}:${getQueryString(url, item)}${
      index === stk.split(',').length - 1 ? '' : '&'
    }`;
  });
  const hash2 = CryptoJS.HmacSHA256(st, hash1.toString()).toString(
    CryptoJS.enc.Hex
  );
  return encodeURIComponent(
    [
      ''.concat(timestamp.toString()),
      ''.concat(fingerprint.toString()),
      ''.concat(appId.toString()),
      ''.concat(token),
      ''.concat(hash2),
    ].join(';')
  );
}

function generateFp() {
  let e = '0123456789';
  let a = 13;
  let i = '';
  for (; a--; ) i += e[(Math.random() * e.length) | 0];
  return (i + Date.now()).slice(0, 16);
}

function getQueryString(url, name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = url.split('?')[1].match(reg);
  if (r != null) return unescape(r[2]);
  return '';
}
