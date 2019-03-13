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
let REFERENCE = null;

const myBot = new MyBot();

// Respond to call on skype
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
      REFERENCE = JSON.stringify(TurnContext.getConversationReference(context.activity));

      await myBot.onTurn(context);

      console.log('Getting the reference of chat and storing it in memory', REFERENCE);
    });
});

// Get reference
server.get('/api/reference', async (req, res) => {
  if (REFERENCE) {
    console.log("Got the reference");

    res.send(200, JSON.stringify({ REFERENCE }));
    
    REFERENCE = null;
  } else {
    console.log('No refrence yet')

    res.send(400, 'No refrence yet');
  }
});

// Send links to a group
server.post('/api/links', async (req, res) => {
  try {
    const { reference, data } = req.body;
  
    console.log('Ref\n\n', reference)
    console.log('\nData', data)
    
    let response = '';
    
    if (reference) {
      response = "sending links to group";
      try {
        await adapter.continueConversation(JSON.parse(reference), async (context) => {
           await context.sendActivity(data);
        });
      } catch (error) {
        await adapter.continueConversation(JSON.parse(REFERENCE), async (context) => {
           await context.sendActivity(data);
        });
      }
    } else {
      response = "Dont have the reference";
    }
    
    console.log(response);
    
    res.send(200, response);
  } catch (error) {
    res.send(400, `Request error ${error}`);
  }
});
