let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000;
let messageHistory = [];

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    const currentTime = Date.now();

    if (message === '') return;

    if (currentTime - lastRequestTime < MIN_REQUEST_INTERVAL) {
        appendMessage('bot', 'Please wait a few seconds before sending another message.');
        return;
    }

    appendMessage('user', message);
    
    try {
        showTypingIndicator();
        lastRequestTime = currentTime;

        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        hideTypingIndicator();
        
        if (!response.ok || data.error) {
            throw new Error(data.error || 'Server responded with an error');
        }
        
        const botResponse = data.response || 'I apologize, but I could not generate a response.';
        appendMessage('bot', botResponse);
        messageHistory.push({ user: message, bot: botResponse });

    } catch (error) {
        hideTypingIndicator();
        appendMessage('bot', 'Sorry, I encountered an error. Please try again.');
        console.error('Error:', error);
    }

    userInput.value = '';
}

function formatHistoricalResponse(response) {
    return response.replace(/(\d{4})/g, '<strong>$1</strong>')
                  .replace(/([A-Z][a-z]+ [A-Z][a-z]+)/g, '<em>$1</em>');
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'typingIndicator';
    loadingDiv.className = 'message bot';
    loadingDiv.innerHTML = '<p>Typing...</p>';
    chatMessages.appendChild(loadingDiv);
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function appendMessage(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});