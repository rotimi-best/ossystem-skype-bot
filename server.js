require('dotenv').config();
const restify = require('restify');
const { BotFrameworkAdapter, TurnContext } = require('botbuilder');

const server = restify.createServer();

server.use(restify.plugins.queryParser());

const PORT = process.env.PORT || 3978;

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

    // reference = JSON.parse(reference);

    await adapter.continueConversation(JSON.parse(reference), async (context) => {
       await context.sendActivity("I can now send messages dynamically");
    });
  } else {
    console.log("Dont have the reference");
  }
  // const query = JSON.stringify(req.query) || 'Empty query';

  res.send(200, `Okay here is your query=>: ${reference}`);
});
