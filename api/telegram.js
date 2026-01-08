// api/telegram.js - For receiving Telegram messages (optional)
const axios = require('axios');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Only handle POST requests (Telegram sends updates via POST)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const update = req.body;
        
        // Log the update
        console.log('Telegram update received:', JSON.stringify(update, null, 2));
        
        // Handle different types of updates
        if (update.message) {
            await handleMessage(update.message);
        } else if (update.callback_query) {
            await handleCallbackQuery(update.callback_query);
        }
        
        // Always respond with OK to acknowledge receipt
        return res.status(200).json({ ok: true });
        
    } catch (error) {
        console.error('Error processing Telegram update:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

async function handleMessage(message) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = message.chat.id;
    const text = message.text || '';
    
    // Handle commands
    if (text.startsWith('/')) {
        await handleCommand(chatId, text);
    } else {
        // Echo non-command messages
        await sendTelegramMessage(chatId, `You said: "${text}"`);
    }
}

async function handleCommand(chatId, command) {
    switch (command) {
        case '/start':
            await sendTelegramMessage(chatId, 
                'Welcome to IELTS Reading Bot! 📚\n\n' +
                'Available commands:\n' +
                '/help - Show this help message\n' +
                '/submissions - View recent submissions\n' +
                '/stats - View class statistics\n' +
                '/broadcast - Send message to all students (teachers only)'
            );
            break;
            
        case '/help':
            await sendTelegramMessage(chatId,
                'IELTS Reading Bot Help:\n\n' +
                'This bot receives test submissions from students and notifies teachers.\n\n' +
                'Teachers can use:\n' +
                '/submissions - View recent submissions\n' +
                '/stats - View statistics\n' +
                '/broadcast - Send announcement\n\n' +
                'Students will automatically receive notifications when their tests are graded.'
            );
            break;
            
        case '/submissions':
            // In production, fetch from database
            await sendTelegramMessage(chatId,
                'Recent Submissions:\n\n' +
                '1. John - Test 1 (13/40) - 10:30 AM\n' +
                '2. Sarah - Test 2 (35/40) - 9:15 AM\n' +
                '3. Mike - Test 1 (22/40) - Yesterday\n\n' +
                'Use /stats for detailed analytics.'
            );
            break;
            
        default:
            await sendTelegramMessage(chatId, 'Unknown command. Use /help for available commands.');
    }
}

async function handleCallbackQuery(callbackQuery) {
    // Handle button clicks from inline keyboards
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const callbackId = callbackQuery.id;
    
    // Answer the callback query (removes loading state)
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
        callback_query_id: callbackId
    });
}

async function sendTelegramMessage(chatId, text) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    
    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
        });
    } catch (error) {
        console.error('Error sending Telegram message:', error);
    }
}
