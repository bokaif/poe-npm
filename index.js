const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const readlineSync = require('readline-sync');

const url = 'https://www.quora.com/poe_api/gql_POST';

const headers = {
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive',
  'Content-Type': 'application/json',
  'Origin': 'https://www.quora.com',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
};

function setAuth(key, value) {
  headers[key] = value;
}

async function loadChatId(bot) {
  try {
    const data = {
      'operationName': 'ChatViewQuery',
      'query': 'query ChatViewQuery($bot:String!){\n chatOfBot(bot:$bot){\n __typename\n...ChatFragment\n}\n}\nfragment ChatFragment on Chat{\n __typename\n id\n chatId\n defaultBotNickname\n shouldShowDisclaimer\n}',
      'variables': {
        'bot': bot
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.errors) {
      throw new Error(responseData.errors[0].message);
    }

    return responseData.data.chatOfBot.chatId;
  } catch (error) {
    throw new Error('Failed to load chat ID: ' + error.message);
  }
}

async function clearContext(chatId) {
  try {
    const data = {
      "operationName": "AddMessageBreakMutation",
      "query": "mutation AddMessageBreakMutation($chatId:BigInt!){\n messageBreakCreate(chatId:$chatId){\n __typename\n message{\n __typename\n...MessageFragment\n}\n}\n}\nfragment MessageFragment on Message{\n id\n __typename\n messageId\n text\n linkifiedText\n authorNickname\n state\n vote\n voteReason\n creationTime\n suggestedReplies\n}",
      "variables": {
        "chatId": chatId
      }
    };

    await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });
  } catch (error) {
    throw new Error('Failed to clear context: ' + error.message);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMessage(bot, chatId, message) {
  try {
    const data = {
      "operationName": "AddHumanMessageMutation",
      "query": "mutation AddHumanMessageMutation($chatId:BigInt!,$bot:String!,$query:String!,$source:MessageSource,$withChatBreak:Boolean!=false){\n messageCreate(\n chatId:$chatId\nbot:$bot\nquery:$query\nsource:$source\nwithChatBreak:$withChatBreak\n){\n __typename\n message{\n __typename\n...MessageFragment\n chat{\n __typename\n id\n shouldShowDisclaimer\n}\n}\n chatBreak{\n __typename\n...MessageFragment\n}\n}\n}\nfragment MessageFragment on Message{\n id\n __typename\n messageId\n text\n linkifiedText\n authorNickname\n state\n vote\n voteReason\n creationTime\n suggestedReplies\n}",
      "variables": {
        "bot": bot,
        "chatId": chatId,
        "query": message,
        "source": null,
        "withChatBreak": false
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.errors) {
      throw new Error(responseData.errors[0].message);
    }
  } catch (error) {
    throw new Error('Failed to send message: ' + error.message);
  }
}

async function getMessage(bot, chatId) {
  try {
    const data = {
      "operationName": "ChatPaginationQuery",
      "query": "query ChatPaginationQuery($bot:String!,$before:String,$last:Int!=10){\n chatOfBot(bot:$bot){\n id\n __typename\n messagesConnection(before:$before,last:$last){\n __typename\n pageInfo{\n __typename\n hasPreviousPage\n}\n edges{\n __typename\n node{\n __typename\n...MessageFragment\n}\n}\n}\n}\n}\nfragment MessageFragment on Message{\n id\n __typename\n messageId\n text\n linkifiedText\n authorNickname\n state\n vote\n voteReason\n creationTime\n}",
      "variables": {
        "before": null,
        "chatId": chatId,
        "bot": bot,
        "last": 1
      }
    };

    while (true) {
      await sleep(2000);

      try {
        const response = await fetch(url, {
          headers,
          method: 'POST',
          body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (responseData.errors) {
          throw new Error(responseData.errors[0].message);
        }

        const messages = responseData.data.chatOfBot.messagesConnection.edges;
        if (messages.length > 0) {
          const text = messages[0].node.text;
          const state = messages[0].node.state;

          if (state === 'complete') {
            return text;
          }
        }
      } catch (error) {
        console.log('Error while getting message:', error.message);
      }
    }
  } catch (error) {
    throw new Error('Failed to get message: ' + error.message);
  }
}

function userQuestion(who = 'You') {
  return readlineSync.question(who + ': ');
}


module.exports = {
  setAuth,
  loadChatId,
  clearContext,
  sendMessage,
  getMessage,
  userQuestion
};