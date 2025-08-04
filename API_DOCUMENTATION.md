# API Layer Documentation

## Overview
The Quiz Game API provides comprehensive endpoints for question management, quality control, and community features.

## Base URL
- Development: `http://localhost:5173/api`
- Production: `https://your-domain.com/api`

## Authentication
All endpoints require Supabase authentication via JWT tokens.

```typescript
// Include in request headers
Authorization: Bearer <jwt_token>
```

## Core Endpoints

### Question Management

#### Get Questions
```
GET /api/questions?country={countryId}&difficulty={level}&count={number}
```
**Parameters:**
- `country` (string): Country ID (e.g., 'afghanistan')
- `difficulty` (string): easy, medium, hard
- `count` (number): Number of questions (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "text": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "difficulty": "string",
      "category": "string",
      "countryId": "string"
    }
  ],
  "meta": {
    "total": 20,
    "returned": 10,
    "hasMore": true
  }
}
```

#### Validate Question
```
POST /api/questions/validate
```
**Body:**
```json
{
  "text": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string",
  "difficulty": "string",
  "countryId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "issues": [],
    "suggestions": []
  }
}
```

#### Create Question (Admin)
```
POST /api/questions
```
**Body:**
```json
{
  "text": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string",
  "difficulty": "string",
  "category": "string",
  "countryId": "string",
  "explanation": "string"
}
```

#### Update Question (Admin)
```
PUT /api/questions/{id}
```

#### Delete Question (Admin)
```
DELETE /api/questions/{id}
```

### Quality Management

#### Report Question
```
POST /api/questions/{id}/report
```
**Body:**
```json
{
  "reason": "duplicate|incorrect|inappropriate|irrelevant",
  "description": "string"
}
```

#### Vote on Question
```
POST /api/questions/{id}/vote
```
**Body:**
```json
{
  "voteType": "upvote|downvote|report"
}
```

#### Get Moderation Queue (Moderators)
```
GET /api/moderation/queue
```

#### Moderate Question (Moderators)
```
POST /api/moderation/{questionId}/action
```
**Body:**
```json
{
  "action": "approve|reject|edit|flag",
  "reason": "string"
}
```

### Analytics & Statistics

#### Get Question Stats
```
GET /api/stats/questions?country={countryId}
```

#### Get Quality Metrics
```
GET /api/stats/quality
```

#### Get User Stats
```
GET /api/stats/user/{userId}
```

### Batch Operations

#### Bulk Question Upload (Admin)
```
POST /api/questions/bulk
```
**Body:**
```json
{
  "questions": [
    // Array of question objects
  ]
}
```

#### Bulk Quality Cleanup (Admin)
```
POST /api/cleanup/country/{countryId}
```

## Error Responses

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Question text is too short",
    "details": {
      "field": "text",
      "minLength": 20
    }
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `AUTHENTICATION_ERROR` | Invalid or missing auth token |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_QUESTION` | Question already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `SERVER_ERROR` | Internal server error |

## Rate Limiting

- **Public endpoints**: 100 requests/minute
- **Authenticated endpoints**: 500 requests/minute  
- **Admin endpoints**: 1000 requests/minute

## Pagination

Large result sets use cursor-based pagination:

```json
{
  "data": [...],
  "pagination": {
    "hasNext": true,
    "nextCursor": "eyJpZCI6IjEyMyJ9",
    "totalCount": 1500
  }
}
```

Use `cursor` parameter for next page:
```
GET /api/questions?cursor=eyJpZCI6IjEyMyJ9
```

## Webhooks (Future)

For real-time updates, subscribe to webhooks:

```
POST /api/webhooks/subscribe
```
**Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["question.created", "question.reported", "moderation.action"]
}
```

---

*This API layer provides a comprehensive foundation for the quiz game while maintaining high quality standards and community engagement.*