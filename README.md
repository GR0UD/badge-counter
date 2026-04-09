# badge-counter

Minimal, configurable profile view counter badge. Self-hosted on Vercel + Upstash Redis.

## Setup

### 1. Clone and deploy to Vercel

```bash
git clone https://github.com/YOUR_USERNAME/badge-counter
cd badge-counter
npm install
vercel deploy
```

### 2. Create Upstash Redis database

1. Go to [upstash.com](https://upstash.com) and sign up (free)
2. Create a new Redis database
3. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### 3. Add environment variables in Vercel

In your Vercel project settings > Environment Variables, add:

```
UPSTASH_REDIS_REST_URL=your_url_here
UPSTASH_REDIS_REST_TOKEN=your_token_here
ADMIN_SECRET=any_secret_string_you_choose
```

---

## Usage

Base URL: `https://your-project.vercel.app/api/badge`

### Basic

```
![views](https://your-project.vercel.app/api/badge)
```

### All parameters

| Param | Default | Description |
|---|---|---|
| `id` | `default` | Counter ID, use different IDs for multiple badges |
| `label` | `views` | Text on the left side. Set to `false` to hide |
| `icon` | none | Icon name (see list below). Set to `false` to hide |
| `color` | `1DCB5C` | Background color (hex, no #) |
| `textcolor` | auto | Text/icon color override |
| `labelcolor` | dark bg | Left label background color |
| `style` | `pill` | `pill`, `flat`, or `sharp` |
| `scale` | `1` | Size multiplier (0.5 to 3) |
| `theme` | `dark` | `dark` or `light` |
| `nocount` | false | Set `true` to read count without incrementing |

### Examples

```
# Minimal, just the number
![](https://your-project.vercel.app/api/badge?label=false)

# With icon, no label
![](https://your-project.vercel.app/api/badge?icon=eye&label=false&color=1DCB5C)

# Full: label + icon + count
![](https://your-project.vercel.app/api/badge?label=views&icon=eye&color=1DCB5C)

# Sharp style, custom colors
![](https://your-project.vercel.app/api/badge?style=sharp&color=0d1117&textcolor=1DCB5C)

# Larger
![](https://your-project.vercel.app/api/badge?scale=1.5)

# Multiple badges with different IDs
![](https://your-project.vercel.app/api/badge?id=profile)
![](https://your-project.vercel.app/api/badge?id=repo-xyz)
```

### Available icons

`eye`, `star`, `user`, `heart`, `activity`, `code`, `github`, `zap`, `terminal`, `globe`, `flame`, `award`

---

## API Endpoints

### GET /api/badge
Returns SVG badge and increments counter.

### GET /api/stats?id=default
Returns JSON with current count without incrementing.
```json
{ "id": "default", "count": 42 }
```

### GET /api/reset?id=default&value=0&secret=your_secret
Manually set counter to any value. Requires `ADMIN_SECRET` env var.

---

## Add to your GitHub README

```md
![Profile Views](https://your-project.vercel.app/api/badge?id=profile&label=views&icon=eye&color=1DCB5C&style=pill)
```
