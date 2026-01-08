// api/submit.js
const axios = require('axios');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const submission = req.body;
        
        // Validate submission data
        if (!submission.studentName || !submission.testId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Send to Telegram
        const telegramResponse = await sendToTelegram(submission);
        
        // Log the submission (in production, you might want to save to a database)
        console.log('Submission received:', {
            student: submission.studentName,
            test: submission.testId,
            timestamp: new Date().toISOString(),
            answersCount: Object.keys(submission.answers || {}).length
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Test submitted successfully',
            telegramSent: telegramResponse.success,
            submissionId: Date.now(),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error processing submission:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
};

async function sendToTelegram(submission) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('Telegram credentials not configured');
        return { success: false, reason: 'Telegram not configured' };
    }

    try {
        // Format the message for Telegram
        const message = formatTelegramMessage(submission);
        
        // Send to Telegram
        const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            }
        );

        return { success: true, messageId: response.data.result.message_id };
        
    } catch (error) {
        console.error('Error sending to Telegram:', error.response?.data || error.message);
        return { 
            success: false, 
            error: error.response?.data || error.message 
        };
    }
}

function formatTelegramMessage(submission) {
    const timestamp = new Date(submission.timestamp).toLocaleString();
    const answered = submission.answeredQuestions || Object.keys(submission.answers || {}).length;
    const total = submission.totalQuestions || 40;
    
    let message = `
<b>📚 IELTS READING SUBMISSION</b>
    
👤 <b>Student:</b> ${submission.studentName}
📚 <b>Class:</b> ${submission.studentClass || 'Not specified'}
📝 <b>Test:</b> ${submission.testTitle || `Test ${submission.testId}`}
⏰ <b>Submitted:</b> ${timestamp}
⏱️ <b>Time spent:</b> ${Math.floor(submission.timeSpent / 60)}m ${submission.timeSpent % 60}s
✅ <b>Questions answered:</b> ${answered}/${total}

<b>📊 Summary:</b>
`;

    // Add answer summary
    if (submission.answers && Object.keys(submission.answers).length > 0) {
        message += '\n<b>Answers:</b>\n';
        const answers = Object.entries(submission.answers)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .slice(0, 20); // Show first 20 answers
        
        answers.forEach(([q, a]) => {
            message += `Q${q}: ${a}  `;
            if (q % 5 === 0) message += '\n';
        });
        
        if (Object.keys(submission.answers).length > 20) {
            message += `\n... and ${Object.keys(submission.answers).length - 20} more`;
        }
    }

    // Add flagged questions
    if (submission.flaggedQuestions && submission.flaggedQuestions.length > 0) {
        message += `\n\n🚩 <b>Flagged for review:</b> ${submission.flaggedQuestions.join(', ')}`;
    }

    message += `\n\n<i>Submission ID: ${Date.now()}</i>`;
    
    return message;
}
