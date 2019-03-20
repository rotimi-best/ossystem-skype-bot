const { ActivityTypes } = require('botbuilder');

class MyBot {
    /**
     *
     * @param {TurnContext} on turn context object.
     */
    async onTurn(turnContext, src) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            const inbox = turnContext.activity.text.replace('ossystem ', '');

            console.log(inbox);

            if (src === 'leadgen') {
              // From Leadgen group

              
            } else {
              await turnContext.sendActivity(`Okay, I've heard you. You said ${inbox}`);
            }
        } else {
            await turnContext.sendActivity(`[${turnContext.activity.type} event detected]`);
        }
    }
}

module.exports.MyBot = MyBot;
