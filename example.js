const { setAuth, loadChatId, clearContext, sendMessage, getMessage } = require('poe-npm');
const readlineSync = require('readline-sync');

const formkey = "YOUR_FORMKEY";
const cookie = "M_B_COOKIE_VALUE";

setAuth('Quora-Formkey', formkey);
setAuth('Cookie', `m-b=${cookie}`);

console.log("Who do you want to talk to?");
console.log("1. Sage (capybara)");
console.log("2. GPT-4 (beaver)");
console.log("3. Claude+ (a2_2)");
console.log("4. Claude (a2)");
console.log("5. ChatGPT (chinchilla)");
console.log("6. Dragonfly (nutria)");
console.log("7. Other (Enter Username)");

let option = readlineSync.question("Please enter your choice: ");

if (!option) {
  option = 5;
  console.log("Defaulting to ChatGPT");
}

let bot;

if (option < 7) {
  const bots = {
    1: 'capybara',
    2: 'beaver',
    3: 'a2_2',
    4: 'a2',
    5: 'chinchilla',
    6: 'nutria'
  };
  bot = bots[parseInt(option)];
} else {
  bot = readlineSync.question("Enter username of bot: ");
}

async function runPoeBot() {
  let chatId = await loadChatId(bot);
  await clearContext(chatId);

  while (true) {
    const text = readlineSync.question("You: ");

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