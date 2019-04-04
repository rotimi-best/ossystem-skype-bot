require('dotenv').config();
const cron = require('node-cron');
const restify = require('restify');
const { BotFrameworkAdapter, TurnContext } = require('botbuilder');
const { sendMsgToAdminOnTelegram } = require('./module');
const { GROUP_REF } = process.env;

// Restify server setup
const server = restify.createServer();

server.use(restify.plugins.queryParser());

server.use(restify.plugins.bodyParser({
  mapParams: true
}));

const PORT = process.env.PORT || 3978;

// Listening to port
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// Azure Credentials
const adapter = new BotFrameworkAdapter({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_PASSWORD
});

// Bot Abstraction
const { MyBot } = require('./bot');
let REFERENCE = null;

const myBot = new MyBot();

// Respond to call on skype
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
      const conversationId = context.activity.conversation.id;

      if (conversationId === process.env.UPWORK) {
        console.log('From upwork group');

        REFERENCE = JSON.stringify(TurnContext.getConversationReference(context.activity));

        await myBot.onTurn(context, 'upwork');
  
        console.log('Got ref & stored in memory', REFERENCE);
      } else if (conversationId == process.env.LEADGEN) {
        console.log('From leadgen group');

        await myBot.onTurn(context, 'leadgen');
      } else {
        // const myRef
        console.log('From Ossystem group');

        await myBot.onTurn(context, 'something');
      }
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

function howBotWorks() {
  // First I store the reference from the first inbox
  server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
      const reference = TurnContext.getConversationReference(context.activity);


      // Call the function that sends message within an interval
      sendMessageNow(reference);
    })
  })

  // Secondly I use the reference to continue the conversation
  function sendMessageNow(reference) {
    setInterval(async () => {
      await adapter.continueConversation(JSON.parse(reference), async (context) => {
        await context.sendActivity("Sending a new message");
      });
    }, 5000);
  }
}

async function BreakTimeNotifier(time) {
  const breakTime = `Проветривание) перерыв 10 мин`;

  await sendMsgToAdminOnTelegram(`Sending ${time} message to the group`);

/**
 * Проветривание) перерыв 10 мин
 * Проветривание) перерыв 10 мин
 * Проветривание) перерыв 10 мин
 * Проветривание) перерыв 10 мин
 * Проветривание) перерыв 10 мин
 * Проветривание) перерыв 10 мин
 * Проветривание) перерыв 10 мин
 * Проветривание) перерыв 10 мин
 * Проветривание) перерыв 10 мин
 * Проветривание) перерыв 10 мин
 */

  try {
    await adapter.continueConversation(JSON.parse(GROUP_REF), async (context) => {
      await context.sendActivity(breakTime);
    });
  } catch (error) {
    await sendMsgToAdminOnTelegram(`Couldn't send message to Ossystem group`);
  }
};

cron.schedule('15 08 * * *', async () => {
  console.log('Sending to group notification');
  
  await BreakTimeNotifier('11:15');
});

cron.schedule('30 12 * * *', async () => {
  console.log('Sending to group notification');
  
  await BreakTimeNotifier('3:30');
});
