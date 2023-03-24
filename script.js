const chatMessages = document.getElementById('chat-messages');
function addBotTypingMessage() {
  const botTypingMessage = document.createElement('li');
  botTypingMessage.classList.add('chat-message', 'chat-message-bot', 'typing');
  botTypingMessage.textContent = 'Typing...';
  chatMessages.appendChild(botTypingMessage);
  return botTypingMessage;
}

const apiKey = "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";
const modelId = "gpt-3.5-turbo";

const messagesContainer = document.getElementById("chat-messages");
const inputField = document.getElementById("chat-input");
const submitButton = document.getElementById("chat-submit");

async function sendMessage(message) {
  try {
    if (!message) {
      return;
    }
  
    const userMessage = addMessage(message, "user");
    const botTypingMessage = addBotTypingMessage();

    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        "model": modelId,
        "messages": [
          {
            "role": "user",
            "content": message
          }
        ],
        "temperature": 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const botMessageContent = data.choices[0].message.content.replace(/\n/g, '');
    addMessage(botMessageContent, "bot");
    chatMessages.removeChild(botTypingMessage);
  } catch (error) {
    console.error(error);
  }
}

function addMessage(message, sender) {
  const messageElement = document.createElement("li");
  messageElement.innerText = message;
  messageElement.classList.add("chat-message");
  messageElement.classList.add("chat-message-" + sender);
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return messageElement;
}

submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  const message = inputField.value.trim();
  inputField.value = "";
  sendMessage(message);
});

inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const message = inputField.value.trim();
    inputField.value = "";
    sendMessage(message);
  }
});