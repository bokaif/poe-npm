const { setAuth, loadChatId, clearContext, sendMessage, getMessage, userQuestion } = require('poe-npm');

const formkey = "YOUR_FORMKEY";
const cookie = "M_B_COOKIE_VALUE";

setAuth('Quora-Formkey', formkey);
setAuth('Cookie', `m-b=${cookie}`);

const bot = userQuestion('Enter Bot\'s Username');
console.log("The selected bot is: ", bot);

async function runPoeBot() {
  let chatId = await loadChatId(bot);
  await clearContext(chatId); // clearing context intially

  while (true) {
    const text = userQuestion("You");

    if (text === 'clear context') {
      await clearContext(chatId);
      console.log("Context cleared");
    }

    await sendMessage(bot, chatId, text);
    const response = await getMessage(bot, chatId);
    console.log(`${bot}: ${response}`);
  }
}

runPoeBot();