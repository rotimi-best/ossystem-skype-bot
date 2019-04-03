const rq = require('request-promise');
const { API_KEY, CHAT_ID } = process.env;

/**
 * Send Message to admin on telegram
 * 
 * @param {String} msg Message to send to admin
 */
const sendMsgToAdminOnTelegram = msg => {
  return new Promise(async resolve => {
      try {
          const intro = '<b>Hello Best</b>\n';
          const text = msg.length ? `${intro}${msg}` : 'No message to send';
          
          const options = {
              uri: `https://api.telegram.org/bot${API_KEY}/sendMessage`,
              qs: {
                  text,
                  chat_id: CHAT_ID,
                  parse_mode: 'HTML'
              },
              headers: {
                  'User-Agent': 'Request-Promise'
              },
              json: true
          };
          
          const result = await rq(options);

          console.log("TELEGRAM-BOT-MESSAGE: ", result.ok);

          resolve('');
      } catch (error) {
          console.error(error);
          
          resolve('');
      }
  });
};

module.exports = {
  sendMsgToAdminOnTelegram
}