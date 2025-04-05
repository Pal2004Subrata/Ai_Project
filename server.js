require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const API_KEY = 'nS5YE0yGt9JDczoPveQlGQ==rtSF890Uq4PE6NwP';
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

app.post('/chat', async (req, res) => {
    try {
        const response = await fetch(XAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                model: 'chat',
                messages: [{
                    role: 'user',
                    content: req.body.message
                }],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}: ${data.error?.message || 'Unknown error'}`);
        }

        const botResponse = data.choices?.[0]?.message?.content || 'No response generated';
        
        res.json({ response: botResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));