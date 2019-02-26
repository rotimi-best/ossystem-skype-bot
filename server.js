require('dotenv').config();
const restify = require('restify');
const { BotFrameworkAdapter, TurnContext } = require('botbuilder');

const server = restify.createServer();

const PORT = 3978;

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

const adapter = new BotFrameworkAdapter({
    appId: "fa712a30-a8a1-4e01-8365-183e9c596a84",
    appPassword: "oyOS$}06qS:D)s(@uCcjXY}(5nvJ#"
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

  } else {
    console.log("Dont have the reference");
  }
    res.send(200, "Okay");
});
