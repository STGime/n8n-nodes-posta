# n8n-nodes-posta

This is an [n8n](https://n8n.io/) community node for the [Posta](https://getposta.app) social media management API.

Manage posts, media, social accounts, analytics, and webhooks across Instagram, TikTok, Facebook, X/Twitter, LinkedIn, YouTube, Pinterest, Threads, and Bluesky — all from your n8n workflows.

## Installation

In your n8n instance, go to **Settings → Community Nodes** and install:

```
n8n-nodes-posta
```

## Credentials

Two authentication modes:

| Mode | Fields | Description |
|------|--------|-------------|
| **API Token** (recommended) | API Token | Generate from Posta dashboard → Settings → API |
| **Email / Password** | Email, Password | Auto-manages JWT tokens with refresh on 401 |

## Resources & Operations

| Resource | Operations |
|----------|-----------|
| **Post** | Create, Update, Delete, Get, Get Many, Schedule, Publish Now, Cancel, Get Calendar |
| **Media** | Upload (3-step signed URL), Get, Get Many, Delete, Generate Carousel PDF |
| **Social Account** | Get Many, Get Pinterest Boards, Get TikTok Creator Info |
| **Analytics** | Overview, Posts, Post Detail, Trends, Best Times, Content Types, Hashtags, Compare Posts, Benchmarks, Capabilities, Refresh Post, Refresh All, Export CSV, Export PDF |
| **Platform** | Get Many, Get, Get Specifications, Get Aspect Ratios (public, no auth) |
| **User** | Get Plan, Get Profile, Update Profile |
| **Webhook** | Create, Get Many, Get, Update, Delete, Test |

### Platform-Specific Configurations

When creating or updating posts, configure per-platform settings:

- **TikTok**: Privacy level (required), comments, duet, stitch, branded content
- **Pinterest**: Board (dynamic dropdown), link, alt text
- **YouTube**: Title, description, tags, privacy, shorts, made for kids
- **Instagram/Facebook**: Placement (feed/reels/story)
- **X/Twitter**: Reply settings, quote tweet, alt text
- **LinkedIn**: Visibility, post type, document title
- **Bluesky**: Alt text, embed URL, languages, content labels
- **Threads**: Location (timeline/reels)

### Media Upload

The upload operation uses a 3-step signed URL flow:
1. Request upload URL from Posta
2. PUT binary data directly to cloud storage
3. Confirm upload to trigger processing

Connect any n8n node that produces binary data (HTTP Request, Read File, etc.) upstream.

## Example Workflows

**Daily Auto-Post:**
Schedule Trigger → OpenAI → HTTP Request (image) → Posta: Upload → Posta: Create Post → Posta: Schedule

**Weekly Analytics Report:**
Cron → Posta: Analytics Overview → Posta: Export CSV → Gmail: Send Attachment

**Webhook Alerts:**
Posta: Create Webhook → n8n Webhook Trigger → IF (failed) → Slack: Alert

## License

MIT
