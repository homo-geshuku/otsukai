const config = require('config');
const client = require('@slack/client');
const {RtmClient} = client;
const {RTM_EVENTS} = client;
const RTM_CLIENT_EVENTS = client.CLIENT_EVENTS.RTM;

const misdoKita = new RegExp("ミス(ター)?ド(ーナ(ッ)?ツ)?.*(来|き)た");

const rtm = new RtmClient(config.token);
rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, (m) => {
    //対象チャンネル外、またはmisudoKitaに一致しない時にreturn
    if(!m.text) var misdoKitaFlag = !m.text.match(misdoKita);
    if(!m.text || m.channel != config.otsukaiChannel || misdoKitaFlag) return;

    console.log("Start otsukai!");
    rtm.sendMessage(`お使いシーケンスを開始しました。 <@${m.user}> さん、待機時間を指定してください。1分以内に回答が無ければ、デフォルトの30分が適用されます。`, m.channel);
});
