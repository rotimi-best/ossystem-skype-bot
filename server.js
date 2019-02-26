require('dotenv').config();
const restify = require('restify');
const { BotFrameworkAdapter, TurnContext } = require('botbuilder');

const server = restify.createServer();

server.use(restify.plugins.queryParser());

server.use(restify.plugins.bodyParser({
  mapParams: true
}));

const PORT = process.env.PORT || 3978;

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

const adapter = new BotFrameworkAdapter({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_PASSWORD
});

const { MyBot } = require('./bot');
let reference;

const myBot = new MyBot();

// Respond to call on skype
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
      reference = JSON.stringify(TurnContext.getConversationReference(context.activity));

      await myBot.onTurn(context);
    });
});

// Get reference
server.get('/api/reference', async (req, res) => {
  if (reference) {
    console.log("Got the reference");

    res.send(200, `Here is the reference =: ${reference}`);

  } else {
    res.send(200, `No refrence yet`);
  }
});

// Send links to a group
server.post('/api/links', async (req, res) => {
  const { reference, data } = req.body;

  if (reference) {
    await adapter.continueConversation(JSON.parse(reference), async (context) => {
       await context.sendActivity(data);
    });
  } else {
    console.log("Dont have the reference");
  }

  res.send(200);
});
