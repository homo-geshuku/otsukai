const config = require('config');
const client = require('@slack/client');
const {RtmClient} = client;
const {RTM_EVENTS} = client;
const RTM_CLIENT_EVENTS = client.CLIENT_EVENTS.RTM;

const rtm = new RtmClient(config.token);
rtm.start();

var stage = 0;
var master = ""; // :doughnut: を募集した人

rtm.on(RTM_EVENTS.MESSAGE, (m) => {
    if(!m.text || m.channel != config.otsukaiChannel) return;

    switch(stage) {
    case 0:
        let misdoKita = new RegExp("ミス(ター)?ド(ーナ(ッ)?ツ)?.*(来|き)た");
        if(!m.text.match(misdoKita)) return;
        console.log("Start otsukai!");
        master = m.user;
        rtm.sendMessage(`お使いシーケンスを開始しました。欲しい :doughnut: と個数をココに投げてください。 <@${master}> さんが「締め切り」と発言すると締め切ります。`, m.channel);
        stage++;
        break;
    case 1:
        if(m.user == master && m.text.match(/締め切り/)) {
            rtm.sendMessage(`受付を締め切りました。結果は以下の通りです。では <@${master}> さん、よろしくお願いします！`, m.channel);
            stage = 0;
        } else {
            console.log(m.text);
        }
        break;
    }
});
