
# Database Design for 1M+ Users

## Overview
This document outlines the database schema and architecture needed to scale the World Explorer Quiz App to support 1 million+ concurrent users.

## Recommended Stack: Supabase (PostgreSQL + Edge Functions)

### Why Supabase?
- **Free tier**: 500MB database, 2GB bandwidth, 50MB file storage
- **Automatic scaling**: Handles up to 100,000+ concurrent connections
- **Real-time subscriptions**: For leaderboards and live features
- **Edge functions**: For AI-powered question generation
- **Built-in auth**: User management and security
- **Global CDN**: Fast content delivery worldwide

## Database Schema

### Core Tables

```sql
-- Countries table
CREATE TABLE countries (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capital VARCHAR(100),
    continent VARCHAR(50) NOT NULL,
    population BIGINT,
    area_km2 DECIMAL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    flag_url TEXT,
    categories TEXT[], -- Array of category strings
    difficulty VARCHAR(10) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
    id VARCHAR(100) PRIMARY KEY,
    type VARCHAR(20) NOT NULL, -- 'multiple-choice', 'true-false', 'fill-blank', 'image'
    text TEXT NOT NULL,
    image_url TEXT,
    audio_url TEXT,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(10) NOT NULL,
    explanation TEXT,
    country_id VARCHAR(50) REFERENCES countries(id),
    continent VARCHAR(50),
    is_global BOOLEAN DEFAULT false,
    relevance_score DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 1.00
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Question choices table
CREATE TABLE question_choices (
    id VARCHAR(100) PRIMARY KEY,
    question_id VARCHAR(100) REFERENCES questions(id) ON DELETE CASCADE,
    choice_id VARCHAR(10) NOT NULL, -- 'a', 'b', 'c', 'd'
    text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Users table (managed by Supabase Auth)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    avatar_url TEXT,
    total_score INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    countries_explored INTEGER DEFAULT 0,
    favorite_categories TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Quiz sessions table
CREATE TABLE quiz_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id),
    country_id VARCHAR(50) REFERENCES countries(id),
    continent VARCHAR(50),
    is_weekly_challenge BOOLEAN DEFAULT false,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    score INTEGER NOT NULL,
    time_taken INTEGER, -- seconds
    difficulty VARCHAR(10),
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Quiz answers table (for analytics)
CREATE TABLE quiz_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    question_id VARCHAR(100) REFERENCES questions(id),
    selected_choice_id VARCHAR(10),
    is_correct BOOLEAN NOT NULL,
    time_taken INTEGER, -- seconds for this question
    created_at TIMESTAMP DEFAULT NOW()
);

-- Leaderboards table
CREATE TABLE leaderboards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id),
    score INTEGER NOT NULL,
    rank INTEGER,
    period VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'all-time'
    category VARCHAR(50),
    country_id VARCHAR(50) REFERENCES countries(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes for Performance

```sql
-- Performance indexes
CREATE INDEX idx_questions_country ON questions(country_id);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_global ON questions(is_global);
CREATE INDEX idx_quiz_sessions_user ON quiz_sessions(user_id);
CREATE INDEX idx_quiz_sessions_country ON quiz_sessions(country_id);
CREATE INDEX idx_quiz_answers_session ON quiz_answers(session_id);
CREATE INDEX idx_quiz_answers_question ON quiz_answers(question_id);
CREATE INDEX idx_leaderboards_period ON leaderboards(period);
CREATE INDEX idx_leaderboards_score ON leaderboards(score DESC);
```

## Scalability Features

### 1. Question Caching Strategy
```typescript
// Edge function for cached question fetching
export const getCachedQuestions = async (countryId: string, difficulty: string) => {
  const cacheKey = `questions:${countryId}:${difficulty}`;
  
  // Try cache first
  let questions = await redis.get(cacheKey);
  
  if (!questions) {
    // Fetch from database
    questions = await supabase
      .from('questions')
      .select('*, question_choices(*)')
      .eq('country_id', countryId)
      .eq('difficulty', difficulty)
      .gte('relevance_score', 0.7); // Only high-quality questions
    
    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(questions));
  }
  
  return JSON.parse(questions);
};
```

### 2. Real-time Leaderboards
```sql
-- Materialized view for fast leaderboard queries
CREATE MATERIALIZED VIEW leaderboard_weekly AS
SELECT 
    up.id,
    up.username,
    up.avatar_url,
    SUM(qs.score) as total_score,
    COUNT(qs.id) as quiz_count,
    RANK() OVER (ORDER BY SUM(qs.score) DESC) as rank
FROM user_profiles up
JOIN quiz_sessions qs ON up.id = qs.user_id
WHERE qs.completed_at >= date_trunc('week', NOW())
GROUP BY up.id, up.username, up.avatar_url
ORDER BY total_score DESC
LIMIT 1000;

-- Refresh every 5 minutes
```

### 3. Auto-scaling Configuration
```yaml
# supabase/config.toml
[database]
max_connections = 1000
shared_preload_libraries = ["pg_stat_statements"]

[auth]
max_concurrent_users = 100000

[storage]
max_file_size = "50MB"
```

## Cost Optimization

### Free Tier Usage (Up to 50K MAU):
- **Database**: 500MB (sufficient for 100K+ questions)
- **Bandwidth**: 2GB/month (optimized with CDN)
- **Storage**: 50MB (for images)
- **Edge Functions**: 500K invocations/month

### Paid Tier ($25/month for 100K MAU):
- **Database**: 8GB
- **Bandwidth**: 250GB/month
- **Storage**: 100GB
- **Edge Functions**: 2M invocations/month

## Migration Plan

### Phase 1: Basic Setup (Week 1)
1. Set up Supabase project
2. Create core tables
3. Migrate existing question data
4. Implement basic CRUD operations

### Phase 2: Performance (Week 2)
1. Add indexes
2. Implement caching layer
3. Set up CDN for images
4. Create materialized views

### Phase 3: Advanced Features (Week 3)
1. Real-time leaderboards
2. Advanced analytics
3. AI question generation
4. Content moderation

### Phase 4: Scale Testing (Week 4)
1. Load testing with 10K concurrent users
2. Performance optimization
3. Auto-scaling configuration
4. Monitoring setup

## Monitoring & Analytics

### Key Metrics to Track:
- **Performance**: Query response times, cache hit rates
- **Usage**: Daily/monthly active users, quiz completion rates
- **Quality**: Question relevance scores, user feedback
- **Business**: Revenue per user, churn rate

### Supabase Analytics Dashboard:
- Real-time user activity
- Database performance metrics
- API usage statistics
- Error tracking and alerts

## Security Considerations

### Row Level Security (RLS):
```sql
-- Users can only access their own data
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Public read access to questions and countries
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are viewable by everyone" ON questions
    FOR SELECT USING (true);
```

### Rate Limiting:
```typescript
// Edge function for rate limiting
const rateLimiter = new Map();

export const checkRateLimit = (userId: string) => {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || [];
  
  // Allow 100 requests per minute
  const recentRequests = userRequests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 100) {
    throw new Error('Rate limit exceeded');
  }
  
  recentRequests.push(now);
  rateLimiter.set(userId, recentRequests);
};
```

This database design provides a solid foundation for scaling to 1M+ users while maintaining performance and keeping costs low through Supabase's generous free tier and efficient architecture.
