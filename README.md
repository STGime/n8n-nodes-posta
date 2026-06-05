# n8n-nodes-posta

This is an [n8n](https://n8n.io/) community node for the [Posta](https://getposta.app) social media management API.

Manage posts, media, social accounts, analytics, and webhooks across Instagram, TikTok, Facebook, X/Twitter, LinkedIn, YouTube, Pinterest, Threads, and Bluesky — all from your n8n workflows.

## Installation

In your n8n instance, go to **Settings → Community Nodes** and install:

```
n8n-nodes-posta
```

## Setting Up Credentials

1. Log in to [Posta](https://getposta.app) → go to **Settings → API Tokens** → click **Generate Token** → copy the token (starts with `posta_...`)
2. In your n8n editor, open any **Posta** node and click the **Credential** dropdown → **Create New Credential**
3. Paste your token into the **API Token** field
4. Leave **Base URL** as `https://api.getposta.app/v1`
5. Click **Test** to verify the connection

Full API reference: https://api.getposta.app/docs

## Resources & Operations

| Resource | Operations |
|----------|-----------|
| **Post** | Create, Update, Delete, Get, Get Many, Schedule, Publish Now, Cancel, Get Calendar |
| **Media** | Upload (3-step signed URL), Get, Get Many, Delete, Generate Carousel PDF, Generate Text Carousel PDF |
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

## Ready-to-import workflow templates

Don't want to build from scratch? Import a complete, documented workflow from the **[Posta workflow gallery](https://getposta.app/workflows)** — download the JSON, or in n8n use **⋯ menu → Import from URL** with the links below:

| Workflow | What it does | Import URL |
|----------|--------------|------------|
| [Share new blog posts to social media](https://getposta.app/workflows/blog-to-social-media) | RSS → scheduled post with image, across your accounts | `https://getposta.app/assets/workflows/blog-to-social-media.json` |
| [Turn a blog post into a LinkedIn carousel](https://getposta.app/workflows/blog-to-linkedin-carousel) | Article → AI 5-slide carousel PDF (DeepSeek + fal.ai) | `https://getposta.app/assets/workflows/blog-to-linkedin-carousel.json` |
| [Run a 5-day product launch campaign](https://getposta.app/workflows/product-launch-campaign) | Product → per-platform captions, scheduled over 5 days | `https://getposta.app/assets/workflows/product-launch-campaign.json` |
| [Promote your latest YouTube video](https://getposta.app/workflows/youtube-to-social-media) | YouTube feed → AI promo drafts on every platform | `https://getposta.app/assets/workflows/youtube-to-social-media.json` |

Each template includes step-by-step docs and the credentials you'll need. The hand-built examples below explain the individual building blocks.

## Example Workflows

### 1. Check Connected Social Accounts

See which social accounts (Instagram, TikTok, etc.) are connected to your Posta account.

```
Manual Trigger → Posta (Social Account: Get Many)
```

**Setup:**
1. Add a **Manual Trigger** node
2. Add a **Posta** node, set Resource = **Social Account**, Operation = **Get Many**
3. Execute — the output shows each connected account with its `id`, `platform`, and `username`

Use the account `id` values from this output whenever a post requires **Social Account IDs**.

---

### 2. Create and Publish a Post Directly

Create a text post and publish it immediately to one or more channels.

```
Manual Trigger → Posta (Post: Create) → Posta (Post: Publish Now)
```

**Setup:**
1. Add a **Manual Trigger** node
2. Add a **Posta** node:
   - Resource = **Post**, Operation = **Create**
   - **Social Account IDs** = the account ID(s) from workflow 1 (comma-separated for multiple)
   - **Caption** = your post text
   - Under **Additional Fields**, set **Is Draft** = `false`
3. Add another **Posta** node:
   - Resource = **Post**, Operation = **Publish Now**
   - **Post ID** = `{{ $json.id }}` (from the previous node's output)
4. Execute to publish immediately

---

### 3. Create a Post with an Image

Upload media first, then attach it to a post.

```
HTTP Request (download image) → Posta (Media: Upload) → Posta (Post: Create) → Posta (Post: Publish Now)
```

**Setup:**
1. **HTTP Request** node: set the URL to your image, response format = **File**
2. **Posta** node: Resource = **Media**, Operation = **Upload** — this handles the 3-step signed URL upload automatically
3. **Posta** node: Resource = **Post**, Operation = **Create**
   - **Social Account IDs** = your account ID(s)
   - **Caption** = your post text
   - Under **Additional Fields**, set **Media IDs** = `{{ $json.id }}` (the uploaded media ID)
4. **Posta** node: Resource = **Post**, Operation = **Publish Now**, **Post ID** = `{{ $json.id }}`

---

### 4. Schedule a Post for Later

Create a draft post and schedule it for a future date/time.

```
Manual Trigger → Posta (Post: Create) → Posta (Post: Schedule)
```

**Setup:**
1. Add a **Manual Trigger** node
2. **Posta** node: Resource = **Post**, Operation = **Create**
   - **Social Account IDs** = your account ID(s)
   - **Caption** = your post text
3. **Posta** node: Resource = **Post**, Operation = **Schedule**
   - **Post ID** = `{{ $json.id }}`
   - **Scheduled At** = your desired publish time (ISO 8601, e.g. `2026-03-20T14:00:00Z`)

---

### 5. Daily Auto-Post with AI-Generated Content

Automatically generate and schedule a daily post using OpenAI.

```
Schedule Trigger → OpenAI (generate caption) → HTTP Request (generate image) → Posta (Media: Upload) → Posta (Post: Create) → Posta (Post: Schedule)
```

---

### 6. Cross-Post to Multiple Platforms with Platform-Specific Settings

Post the same content across platforms with tailored settings per channel.

```
Manual Trigger → Posta (Post: Create with Platform Configurations)
```

**Setup:**
1. In the **Posta** Create Post node, provide multiple **Social Account IDs** (comma-separated)
2. Expand **Platform Configurations** to set per-platform options:
   - **Instagram**: Placement = `reels`
   - **TikTok**: Privacy Level = `Public`, Allow Comments = `true`
   - **YouTube**: Title, Description, Privacy = `public`
   - **LinkedIn**: Visibility = `Public`

---

### 7. Weekly Analytics Report

Pull analytics and export to CSV on a schedule.

```
Schedule Trigger → Posta (Analytics: Overview) → Posta (Analytics: Export CSV) → Gmail (Send Attachment)
```

---

### 8. Monitor Post Failures via Webhooks

Set up a webhook to get notified when posts fail.

```
Posta (Webhook: Create) → [one-time setup]

n8n Webhook Trigger → IF (status = "failed") → Slack (Send Message)
```

---

### 9. Generate a LinkedIn Carousel from an Article

Turn an article into a text-over-background LinkedIn carousel PDF.

```
HTTP/RSS (article) → LLM (write N slides) → fal.ai (N backgrounds) → Posta (Media: Upload, per background)
  → Posta (Media: Generate Text Carousel PDF) → Posta (Post: Create on LinkedIn)
```

**Setup:**
1. Generate slide copy with an LLM and a background image per slide; upload each background via **Media → Upload** to get media IDs.
2. **Posta** node: Resource = **Media**, Operation = **Generate Text Carousel PDF**
   - **Slides** = a JSON array (2–20), e.g. `{{ $json.slides }}` where each item is `{ "media_id": "<bg id>", "title": "...", "body": "..." }`
   - **Logo Media ID** = optional; the media ID of an uploaded logo image shown in the bottom-right of every slide
   - **Title** = optional document title
3. **Posta** node: Resource = **Post**, Operation = **Create**
   - **Social Account IDs** = your LinkedIn account ID
   - Under **Additional Fields**, set **Media IDs** = `{{ $json.media_id }}` (the generated PDF)

## License

MIT
