# **Poe-NPM**

[![npm version](https://badge.fury.io/js/poe-npm.svg)](https://badge.fury.io/js/poe-npm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Node.js package for Interacting with Poe Chatbots using Reverse Engineering

## **Installation**

```bash
npm install poe-npm
```

## **Usage**

```javascript
const { setAuth, loadChatId, clearContext, sendMessage, getMessage} = require("poe-npm");
```

## **Authentication**

Before using the package, you need to set up the authentication by providing the `Quora-Formkey` and `Cookie` values. Here's how you can obtain them:

### **How to get `Quora-Formkey` and `Cookie`**

1. Log in to quora.com.
2. Open the browser console.
3. Paste the following code to get the value of `Quora-Formkey`:
   ```javascript
   window.ansFrontendGlobals.earlySettings["formkey"];
   ```
4. Go to the Application tab.
5. Navigate to Cookies > quora.com.
6. Look for the "`m-b`" cookie and use its value as `Cookie`.

### **Setting the Authentication**

```javascript
const formkey = "YOUR_FORMKEY";
const cookie = "M_B_COOKIE_VALUE";

setAuth("Quora-Formkey", formkey);
setAuth("Cookie", `m-b=${cookie}`);
```

## **Selecting a Bot**

Select the bot you want to interact with by specifying its username:

```javascript
const bot = "capybara"; // Example: 'Sage' bot
```

Refer to the table below to find the appropriate username for the desired bot.

| Bot       | Username        |
| --------- | --------------- |
| Sage      | capybara        |
| GPT-4     | beaver          |
| Claude+   | a2_2            |
| Claude    | a2              |
| ChatGPT   | chinchilla      |
| Dragonfly | nutria          |
| Other     | USERNAME_OF_BOT |

## **Functions**

### `loadChatId(bot)`

Load the chat ID associated with the selected bot.

```javascript
const chatId = await loadChatId(bot);
```

### `clearContext(chatId)`

Clear the context of the chat associated with the provided chat ID.

```javascript
await clearContext(chatId);
```

### `userQuestion(who)` (Optional)

Get the user's prompt.

```javascript
const text = userQuestion('You');
```

### `sendMessage(bot, chatId, text)`

Send a message (`text`) to the selected bot using the associated chat ID.

```javascript
const text = "Hello, Poe!";
sendMessage(bot, chatId, text);
```

### `getMessage(bot, chatId)`

Get the response message from the selected bot.

```javascript
const response = await getMessage(bot, chatId);
```

## **Disclaimer**

Please note that this is not an official package. Use it at your own discretion and adhere to Quora's terms of service and policies.

## **Contributing**

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request.

## **License**

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
