import axios from 'axios';

const API_URL = 'http://localhost:8000/api/revision';

class MLService {
    async getRevisionSuggestion(userData) {
        try {
            const response = await axios.post(`${API_URL}/suggest`, {
                subject: userData.subject,
                days_left: userData.daysLeft,
                daily_time: userData.dailyTime,
                topic_difficulty: userData.topicDifficulty,
                confidence: userData.confidence,
                performance: userData.performance,
                preferred_format_video: userData.preferredFormats.includes('video'),
                preferred_format_reading: userData.preferredFormats.includes('reading'),
                preferred_format_quiz: userData.preferredFormats.includes('quiz')
            });
            return response.data;
        } catch (error) {
            console.error('Error getting revision suggestion:', error);
            throw error;
        }
    }

    async getRevisionSuggestions(userData) {
        try {
            // For now, we'll return mock data until the ML backend is implemented
            return [
                {
                    topic: "Linear Algebra",
                    priority: "high",
                    reason: "Based on your recent quiz performance and time since last review",
                    performance: 65,
                    lastReview: "2 weeks ago"
                },
                {
                    topic: "Calculus",
                    priority: "medium",
                    reason: "Moderate performance with some gaps in understanding",
                    performance: 75,
                    lastReview: "1 week ago"
                },
                {
                    topic: "Probability",
                    priority: "low",
                    reason: "Strong performance, but could use a quick review",
                    performance: 85,
                    lastReview: "3 days ago"
                }
            ];
        } catch (error) {
            console.error('Error getting revision suggestions:', error);
            throw error;
        }
    }

    async getAvailableTopics() {
        try {
            const response = await axios.get(`${API_URL}/topics`);
            return response.data.topics;
        } catch (error) {
            console.error('Error getting available topics:', error);
            throw error;
        }
    }

    async getAvailableFormats() {
        try {
            const response = await axios.get(`${API_URL}/formats`);
            return response.data.formats;
        } catch (error) {
            console.error('Error getting available formats:', error);
            throw error;
        }
    }

    async generateStudySchedule(userData) {
        // This is a placeholder - you can implement more complex scheduling logic here
        const suggestion = await this.getRevisionSuggestion(userData);
        return {
            topic: suggestion.topic,
            duration: suggestion.duration,
            format: suggestion.format,
            schedule: this._createSchedule(suggestion, userData)
        };
    }

    _createSchedule(suggestion, userData) {
        // Simple scheduling logic - can be enhanced based on your needs
        const sessions = [];
        const totalDays = userData.daysLeft;
        const dailyTime = userData.dailyTime;
        const totalTime = suggestion.duration;
        
        let remainingTime = totalTime;
        for (let day = 0; day < totalDays && remainingTime > 0; day++) {
            const sessionTime = Math.min(remainingTime, dailyTime);
            sessions.push({
                day: day + 1,
                duration: sessionTime,
                format: suggestion.format
            });
            remainingTime -= sessionTime;
        }
        
        return sessions;
    }
}

export default new MLService(); 