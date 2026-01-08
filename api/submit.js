// api/submit.js - Simple version
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const submission = req.body || {};
        
        // Validate required fields
        if (!submission.studentName) {
            return res.status(400).json({ error: 'Student name is required' });
        }
        
        // Log the submission
        console.log('IELTS Submission received:', {
            student: submission.studentName,
            type: submission.testType || 'unknown',
            timestamp: new Date().toISOString()
        });
        
        // Try to send to Telegram if credentials are set
        const telegramResult = await sendToTelegram(submission);
        
        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Submission received successfully',
            telegramSent: telegramResult.success,
            submissionId: `sub_${Date.now()}`
        });
        
    } catch (error) {
        console.error('Error processing submission:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            details: error.message 
        });
    }
};

async function sendToTelegram(submission) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.log('Telegram credentials not configured. Skipping Telegram notification.');
        return { success: false, reason: 'Not configured' };
    }
    
    try {
        const { default: axios } = await import('axios');
        
        const message = `
📚 IELTS Reading Submission

👤 Student: ${submission.studentName}
📚 Class: ${submission.studentClass || 'Not specified'}
🎯 Test Type: ${submission.testType || 'Practice'}
✅ Questions: ${submission.answeredQuestions || '?'}
⏰ Submitted: ${new Date().toLocaleString()}

Submission ID: sub_${Date.now()}
        `.trim();
        
        const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            }
        );
        
        return { success: true, messageId: response.data.result.message_id };
        
    } catch (error) {
        console.error('Error sending to Telegram:', error.message);
        return { success: false, error: error.message };
    }
}
