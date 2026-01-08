// api/telegram.js
const axios = require('axios');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Verify webhook secret (optional)
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (webhookSecret && req.headers['x-telegram-webhook-secret'] !== webhookSecret) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Only handle POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const update = req.body;
        
        // Log for debugging
        console.log('Telegram update:', JSON.stringify(update, null, 2));
        
        // Handle different update types
        if (update.message) {
            await handleMessage(update.message);
        } else if (update.callback_query) {
            await handleCallbackQuery(update.callback_query);
        }
        
        // Always respond with OK
        return res.status(200).json({ ok: true });
        
    } catch (error) {
        console.error('Telegram webhook error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

async function handleMessage(message) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = message.chat.id;
    const text = message.text || '';
    
    // Handle commands
    if (text.startsWith('/')) {
        await handleCommand(chatId, text, message.from);
    }
}

async function handleCommand(chatId, command, from) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    
    switch (command) {
        case '/start':
            await sendMessage(chatId,
                `Welcome to IELTS Reading Master Bot! 📚\n\n` +
                `I'll notify you when students submit their practice tests.\n\n` +
                `Available commands:\n` +
                `/help - Show help message\n` +
                `/submissions - View recent submissions\n` +
                `/students - List all students\n` +
                `/stats - View class statistics`
            );
            break;
            
        case '/help':
            await sendMessage(chatId,
                `IELTS Reading Master Bot Help:\n\n` +
                `This bot automatically receives student submissions from the IELTS Reading practice platform.\n\n` +
                `Teachers can use:\n` +
                `/submissions - View recent submissions\n` +
                `/students - List all registered students\n` +
                `/stats - View class performance statistics\n` +
                `/broadcast - Send announcement to all students\n\n` +
                `Students will automatically receive feedback from teachers via this bot.`
            );
            break;
            
        case '/submissions':
            // In production, fetch from database
            const mockSubmissions = [
                { student: 'John Smith', test: 'Academic Test 1', score: '7.5/9.0', time: '2 hours ago' },
                { student: 'Sarah Lee', test: 'TFNG Practice', score: '8/10', time: '3 hours ago' },
                { student: 'Michael Chen', test: 'Matching Headings', score: '6/10', time: '5 hours ago' }
            ];
            
            let response = 'Recent Submissions:\n\n';
            mockSubmissions.forEach((sub, i) => {
                response += `${i + 1}. ${sub.student}\n   Test: ${sub.test}\n   Score: ${sub.score}\n   Time: ${sub.time}\n\n`;
            });
            
            await sendMessage(chatId, response);
            break;
            
        case '/stats':
            await sendMessage(chatId,
                `Class Statistics:\n\n` +
                `📊 Total Submissions: 156\n` +
                `👥 Active Students: 24\n` +
                `🎯 Average Score: 7.2/9.0\n` +
                `📈 Completion Rate: 78%\n` +
                `⏱️ Avg Time per Question: 1.3 minutes\n\n` +
                `Most practiced: Multiple Choice (45 times)\n` +
                `Least practiced: Matching Authors (12 times)`
            );
            break;
            
        default:
            await sendMessage(chatId, 'Unknown command. Use /help for available commands.');
    }
}

async function handleCallbackQuery(callbackQuery) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const callbackId = callbackQuery.id;
    
    // Answer callback to remove loading state
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
        callback_query_id: callbackId
    });
}

async function sendMessage(chatId, text) {
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
