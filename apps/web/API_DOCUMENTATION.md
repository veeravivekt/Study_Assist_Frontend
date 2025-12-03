# Backend API Integration Documentation

## Page Content Save API

When users edit content in the editor, the application automatically saves the content in JSON format to the backend API.

### Endpoint

**POST** `/api/pages/[id]/content`

### Request Format

The frontend sends a POST request with the following JSON structure:

```json
{
  "content": {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Hello world"
          }
        ]
      }
    ]
  },
  "html": "<p>Hello world</p>",
  "markdown": "Hello world"
}
```

### Request Body Fields

- **`content`** (required): The editor content in TipTap JSON format (`JSONContent` type)
  - This is the primary format that should be stored in your database
  - Structure follows TipTap's document model
  - Contains all formatting, structure, and metadata

- **`html`** (optional): HTML representation of the content
  - Includes syntax highlighting for code blocks
  - Useful for rendering/preview purposes

- **`markdown`** (optional): Markdown representation of the content
  - Plain text format
  - Useful for export or search indexing

### Response Format

The API should return:

```json
{
  "success": true,
  "pageId": "page-id-here",
  "content": { /* JSONContent object */ },
  "html": "<p>Hello world</p>",
  "markdown": "Hello world",
  "savedAt": "2024-01-01T00:00:00.000Z"
}
```

### Current Implementation

The API route is located at:
- `app/api/pages/[id]/content/route.ts`

Currently, it returns a mock response. **You need to replace the TODO comments** in the route file with actual backend API calls.

### Integration Steps

1. **Update the API route** (`app/api/pages/[id]/content/route.ts`):
   - Replace the TODO section in the POST handler with your actual backend API call
   - Update the GET handler if you want to load content from the backend

2. **Backend API Requirements**:
   - Accept POST requests with the JSON structure shown above
   - Store the `content` field (TipTap JSON format) in your database
   - Optionally store `html` and `markdown` for faster rendering/search
   - Return a success response with the saved data

3. **Example Backend Integration**:

```typescript
// In route.ts, replace the TODO section with:
const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/pages/${pageId}/content`, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.BACKEND_API_TOKEN}` // if needed
  },
  body: JSON.stringify({ 
    content: body.content, 
    html: body.html, 
    markdown: body.markdown 
  })
});

if (!backendResponse.ok) {
  throw new Error('Backend API error');
}

const result = await backendResponse.json();
return NextResponse.json(result, { status: 200 });
```

### Autosave Behavior

- Content is automatically saved **500ms after the user stops typing** (debounced)
- The save status is displayed in the top-right corner:
  - "Unsaved" - User is typing
  - "Saving..." - Request in progress
  - "Saved" - Successfully saved
  - "Save failed" - Error occurred (content still saved locally)

### Content Format (TipTap JSON)

The `content` field follows TipTap's JSON document structure:

```typescript
interface JSONContent {
  type: string;
  attrs?: Record<string, any>;
  content?: JSONContent[];
  marks?: Array<{
    type: string;
    attrs?: Record<string, any>;
  }>;
  text?: string;
}
```

Common node types include:
- `doc` - Document root
- `paragraph` - Paragraph
- `heading` - Headings (level 1-6)
- `codeBlock` - Code blocks
- `image` - Images
- `bulletList`, `orderedList` - Lists
- `blockquote` - Quotes
- And many more...

### Error Handling

- If the backend API call fails, the content is still saved to localStorage
- Users can continue working even if the backend is temporarily unavailable
- The save status will show "Save failed" to alert users

### Environment Variables

Add these to your `.env.local` file:

```env
BACKEND_API_URL=https://your-backend-api.com
BACKEND_API_TOKEN=your-api-token-if-needed
```

