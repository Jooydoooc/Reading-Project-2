// api/submissions.js - Teacher view of submissions
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    // Basic authentication (in production, use proper auth)
    const authHeader = req.headers.authorization;
    const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || 'ielts2024';
    
    if (authHeader !== `Bearer ${TEACHER_PASSWORD}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        // In production, fetch from database
        // For now, return mock data
        const submissions = [
            {
                id: 1,
                studentName: 'John Smith',
                studentClass: 'IELTS Advanced',
                testId: 1,
                testTitle: 'Academic Test 1',
                score: 7.5,
                answers: {1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'A'},
                timestamp: '2024-01-15T10:30:00Z',
                timeSpent: 3540
            },
            {
                id: 2,
                studentName: 'Sarah Johnson',
                studentClass: 'IELTS General',
                testId: 2,
                testTitle: 'General Training Test 1',
                score: 8.0,
                answers: {1: 'B', 2: 'C', 3: 'A', 4: 'D', 5: 'B'},
                timestamp: '2024-01-15T09:15:00Z',
                timeSpent: 3200
            }
        ];
        
        return res.status(200).json({
            success: true,
            count: submissions.length,
            submissions: submissions
        });
        
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
