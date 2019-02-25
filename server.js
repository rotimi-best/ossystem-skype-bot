require('dotenv').config();
const restify = require('restify');
const { BotFrameworkAdapter, TurnContext } = require('botbuilder');

const server = restify.createServer();

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

// Create the main dialog.
const myBot = new MyBot();

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
      reference = JSON.stringify(TurnContext.getConversationReference(context.activity));

      await myBot.onTurn(context);
    });
});

server.get('/api/messages', async (req, res) => {
  if (reference) {
    console.log("Got the reference");

    reference = JSON.parse(reference);

    await adapter.continueConversation(reference, async (context) => {
       await context.sendActivity("Hi there, what do you think\n\n\nGreat");
    });

    res.send(200, "Okay");
  } else {
    console.log("Dont have the reference");
  }
});
