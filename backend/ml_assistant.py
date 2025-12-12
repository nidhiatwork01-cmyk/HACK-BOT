"""
AI/ML Assistant for Event Requests
Uses NLP to understand student requests and generate auto-responses
"""
import re
import json
from collections import Counter

class EventRequestAssistant:
    def __init__(self):
        # Event category keywords
        self.category_keywords = {
            'technical': ['hackathon', 'coding', 'programming', 'tech', 'software', 'ai', 'ml', 'data science', 
                         'cyber security', 'web development', 'app development', 'coding competition', 'tech talk'],
            'cultural': ['music', 'dance', 'singing', 'drama', 'theater', 'art', 'painting', 'cultural', 'festival',
                       'cultural fest', 'music festival', 'dance competition', 'talent show', 'cultural event'],
            'sports': ['sports', 'cricket', 'football', 'basketball', 'volleyball', 'badminton', 'tennis', 'athletics',
                      'tournament', 'sports meet', 'competition', 'match', 'game'],
            'academic': ['seminar', 'workshop', 'lecture', 'conference', 'research', 'paper presentation', 'academic',
                        'guest lecture', 'symposium', 'panel discussion', 'academic event']
        }
        
        # Response templates based on category
        self.response_templates = {
            'technical': "Thank you for your interest in technical events! We've noted your request for a {event_type} event. Our technical societies are always planning exciting hackathons, coding competitions, and tech talks. We'll keep you updated when similar events are scheduled!",
            'cultural': "Great to hear you're interested in cultural events! We've received your request for a {event_type} event. Our cultural committee organizes various festivals, competitions, and performances throughout the year. Stay tuned for upcoming cultural events!",
            'sports': "Thanks for your sports event request! We've noted your interest in {event_type}. Our sports department regularly organizes tournaments and competitions. We'll notify you when similar sports events are announced!",
            'academic': "Thank you for your academic event request! We've recorded your interest in {event_type}. Our academic departments frequently host seminars, workshops, and conferences. You'll be notified about upcoming academic events!",
            'general': "Thank you for your event request! We've received your message about {event_type} and forwarded it to the relevant committee. Our event organizers will review your request and consider it for future planning. Stay tuned for updates!"
        }
    
    def detect_category(self, text):
        """Detect event category from request text using keyword matching"""
        text_lower = text.lower()
        category_scores = {}
        
        for category, keywords in self.category_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                category_scores[category] = score
        
        if category_scores:
            # Return category with highest score
            return max(category_scores, key=category_scores.get)
        return 'general'
    
    def analyze_sentiment(self, text):
        """Simple sentiment analysis"""
        positive_words = ['want', 'need', 'hope', 'wish', 'excited', 'looking forward', 'interested', 'love', 'like']
        negative_words = ['disappointed', 'sad', 'frustrated', 'angry', 'hate', 'dislike']
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        return 'neutral'
    
    def extract_event_type(self, text):
        """Extract the type of event mentioned in the request"""
        # Look for patterns like "I want a [event]" or "looking for [event]"
        patterns = [
            r'(?:want|need|looking for|interested in|hope for|wish for)\s+(?:a|an|the)?\s*([^.!?]+)',
            r'([a-z]+(?:\s+[a-z]+)?)\s+(?:event|competition|festival|workshop|seminar)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text.lower())
            if match:
                event_type = match.group(1).strip()
                # Clean up common words
                event_type = re.sub(r'\b(a|an|the|for|in|on|at|to|of)\b', '', event_type).strip()
                if len(event_type) > 3:
                    return event_type
        
        # Fallback: return first few words
        words = text.split()[:5]
        return ' '.join(words).lower()
    
    def extract_society_name(self, text):
        """Extract society name from request text"""
        # Common society patterns
        society_keywords = ['society', 'club', 'committee', 'association', 'soc']
        text_lower = text.lower()
        
        # Look for patterns like "from [society]", "by [society]", "[society] wants"
        patterns = [
            r'(?:from|by|for|with)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:society|club|committee)',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:society|club|committee|association)',
            r'(?:society|club|committee)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                society = match.group(1).strip()
                if len(society) > 2:
                    return society
        
        # Look for common society names
        common_societies = [
            'coding club', 'tech society', 'cultural committee', 'sports committee',
            'dance club', 'music society', 'drama club', 'art society', 'photography club',
            'debate society', 'literary club', 'robotics club', 'ai club', 'cyber security club'
        ]
        
        for society in common_societies:
            if society in text_lower:
                return society.title()
        
        return None
    
    def generate_response(self, request_text, category=None):
        """Generate auto-response to student request"""
        if not category:
            category = self.detect_category(request_text)
        
        event_type = self.extract_event_type(request_text)
        if not event_type or len(event_type) < 3:
            event_type = "this type of event"
        
        # Get appropriate template
        template = self.response_templates.get(category, self.response_templates['general'])
        
        # Generate response
        response = template.format(event_type=event_type)
        
        return response
    
    def process_request(self, request_text):
        """Process a student request and return analysis"""
        category = self.detect_category(request_text)
        sentiment = self.analyze_sentiment(request_text)
        society_name = self.extract_society_name(request_text)
        auto_response = self.generate_response(request_text, category)
        
        # If society name not found, ask for it in response
        if not society_name:
            auto_response += " Could you please mention which society or club you're representing? This helps us route your request to the right team!"
        
        return {
            'category': category,
            'sentiment': sentiment,
            'auto_response': auto_response,
            'event_type_extracted': self.extract_event_type(request_text),
            'society_name': society_name
        }

# Initialize assistant
assistant = EventRequestAssistant()

