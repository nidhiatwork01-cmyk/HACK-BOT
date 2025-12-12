"""
Smart Semantic Search using Sentence Embeddings
Uses sentence transformers for semantic event search
"""
import sqlite3
from collections import defaultdict
import math
import re

class SemanticSearch:
    def __init__(self, db_name='events.db'):
        self.db_name = db_name
        # Try to use sentence transformers if available, otherwise fallback to TF-IDF
        self.use_embeddings = False
        self.model = None
        # Don't load model at init - load it lazily when needed
        # Always assume it's not available to avoid PyTorch DLL errors at startup
        # Will try to load it only when actually searching
        self._sentence_transformers_available = False
        print("⚠️ Using TF-IDF search (sentence-transformers disabled to avoid DLL errors)")
    
    def _tf_idf_search(self, query, events, top_k=10):
        """Fallback TF-IDF based search"""
        query_lower = query.lower()
        query_words = set(re.findall(r'\b\w+\b', query_lower))
        
        scored_events = []
        for event in events:
            # Combine title, description, category, venue for search
            text = f"{event.get('title', '')} {event.get('description', '')} {event.get('category', '')} {event.get('venue', '')}".lower()
            text_words = set(re.findall(r'\b\w+\b', text))
            
            # Calculate Jaccard similarity
            intersection = len(query_words & text_words)
            union = len(query_words | query_words)
            similarity = intersection / union if union > 0 else 0
            
            # Boost for exact matches
            if query_lower in text:
                similarity += 0.3
            
            # Boost for category match
            if event.get('category', '').lower() in query_lower:
                similarity += 0.2
            
            scored_events.append({
                **event,
                'similarity_score': min(similarity, 1.0),
                'match_type': 'keyword'
            })
        
        scored_events.sort(key=lambda x: x['similarity_score'], reverse=True)
        return scored_events[:top_k]
    
    def _embedding_search(self, query, events, top_k=10):
        """Semantic search using sentence embeddings"""
        try:
            # Lazy load model only when needed (avoids PyTorch DLL errors at startup)
            if self.model is None and self._sentence_transformers_available:
                try:
                    from sentence_transformers import SentenceTransformer
                    self.model = SentenceTransformer('all-MiniLM-L6-v2')
                    self.use_embeddings = True
                    print("✅ Loaded Sentence Transformers for semantic search")
                except (ImportError, OSError, Exception) as e:
                    print(f"⚠️ Failed to load Sentence Transformers ({type(e).__name__}: {str(e)[:50]}), using TF-IDF fallback")
                    self._sentence_transformers_available = False
                    self.use_embeddings = False
                    return self._tf_idf_search(query, events, top_k)
            
            if not self.use_embeddings or self.model is None:
                return self._tf_idf_search(query, events, top_k)
            
            # Encode query
            query_embedding = self.model.encode(query, convert_to_tensor=False)
            
            scored_events = []
            for event in events:
                # Create searchable text
                search_text = f"{event.get('title', '')}. {event.get('description', '')}"
                
                # Encode event text
                event_embedding = self.model.encode(search_text, convert_to_tensor=False)
                
                # Calculate cosine similarity
                similarity = self._cosine_similarity(query_embedding, event_embedding)
                
                # Boost for category match
                if event.get('category', '').lower() in query.lower():
                    similarity += 0.1
                
                scored_events.append({
                    **event,
                    'similarity_score': min(similarity, 1.0),
                    'match_type': 'semantic'
                })
            
            scored_events.sort(key=lambda x: x['similarity_score'], reverse=True)
            return scored_events[:top_k]
        except Exception as e:
            print(f"Error in embedding search: {e}")
            return self._tf_idf_search(query, events, top_k)
    
    def _cosine_similarity(self, vec1, vec2):
        """Calculate cosine similarity between two vectors"""
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude1 = math.sqrt(sum(a * a for a in vec1))
        magnitude2 = math.sqrt(sum(a * a for a in vec2))
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        
        return dot_product / (magnitude1 * magnitude2)
    
    def search(self, query, limit=10, category=None, date_filter=None):
        """Search events semantically"""
        conn = sqlite3.connect(self.db_name)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        
        # Build query
        sql_query = "SELECT id, title, description, category, date, time, venue, poster_url, society, registration_url FROM events WHERE 1=1"
        params = []
        
        if category:
            sql_query += " AND category = ?"
            params.append(category)
        
        if date_filter:
            sql_query += " AND date >= ?"
            params.append(date_filter)
        
        sql_query += " ORDER BY date ASC"
        
        events = c.execute(sql_query, params).fetchall()
        conn.close()
        
        # Convert to dicts
        events_list = [dict(event) for event in events]
        
        if not events_list:
            return []
        
        # Perform semantic search
        if self.use_embeddings:
            results = self._embedding_search(query, events_list, limit)
        else:
            results = self._tf_idf_search(query, events_list, limit)
        
        return results

# Initialize semantic search
semantic_search = SemanticSearch()

