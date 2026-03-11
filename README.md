# 🎧 Shared Playlist

> Build a playlist together with your favorite people — no sign-up required.

**[🔗 Live Demo → shared-playlist.com](https://www.shared-playlist.com)**

---

## ✨ Overview

**Shared Playlist** is a lightweight, real-time collaborative playlist app. Create a room, share the link, and start adding tracks together — no email, no password, no friction.

Whether it's a road trip, a party, or a late-night music session with a friend across the world, Shared Playlist makes it easy to discover what everyone's vibing to.

---

## 🚀 Features

- **Instant Rooms** — Create a room in one click and share the link with anyone
- **No Sign-up Required** — Just enter a nickname and you're in
- **Collaborative Playlist** — Add, view, and manage tracks in real time
- **👎 Dislike System** — Let your friends know when a track isn't hitting
- **Dislike Awards** — A live leaderboard of the most disliked contributors
- **Screenshot Export** — Clean capture-ready view to recreate the playlist in any streaming app
- **Text Export** — Copy the full playlist as plain text
- **Member Tracks** — Click any member's name to see what they've added
- **Room Management** — Extend expiry by 7 days or delete the room anytime
- **Bilingual** — Full Korean 🇰🇷 and English 🇺🇸 support

---

## 🔩 Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | NestJS |
| Language | TypeScript |
| ORM | Prisma |
| Database | MySQL (AWS RDS) |
| Auth | Cookie-based sessions with NestJS Guards |
| Music Data | Last.fm API |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React + Vite |
| Language | TypeScript |
| Routing | React Router |
| Styling | Inline styles + CSS variables |
| i18n | Custom translation layer |

### Infrastructure
| Layer | Technology |
|---|---|
| Backend Hosting | AWS EC2 |
| Containerization | Docker |
| Frontend Hosting | Vercel |
| Database | AWS RDS (MySQL) |

---

## 🏗️ Architecture

```
┌─────────────────────┐        ┌──────────────────────────┐
│   React + Vite      │  HTTPS │   NestJS API             │
│   (Vercel)          │ ──────▶│   (AWS EC2 + Docker)     │
│                     │        │                          │
│  - Room UI          │        │  - Room Management       │
│  - Search           │        │  - Track Service         │
│  - Playlist         │        │  - Auth Guard (Cookie)   │
└─────────────────────┘        └────────────┬─────────────┘
                                            │
                              ┌─────────────▼─────────────┐
                              │   MySQL (AWS RDS)          │
                              │   Prisma ORM               │
                              └───────────────────────────┘
```

---

## 🛠️ Local Development

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- MySQL (or use Docker)

### Backend

```bash
# Clone the repo
git clone https://github.com/eschoi04/Shared-Playlist.git
cd Shared-Playlist

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL and other required vars

# Run database migrations
npx prisma migrate dev

# Start in development mode
npm run start:dev
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Note:** For local development against the production backend, configure `vite.config.ts` to proxy API requests.

### Docker (Production)

```bash
docker compose up --build
```

---

## 🌐 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/rooms` | Create a new room |
| `POST` | `/rooms/:id/enter` | Enter a room with a nickname |
| `GET` | `/rooms/:id` | Get room info & members |
| `PATCH` | `/rooms/:id` | Extend room expiry by 7 days |
| `DELETE` | `/rooms/:id` | Delete a room |
| `GET` | `/tracks/search` | Search tracks via Last.fm |
| `GET` | `/rooms/:id/tracks` | Get playlist |
| `POST` | `/rooms/:id/tracks` | Add a track |
| `DELETE` | `/rooms/:id/tracks/:trackId` | Delete a track |
| `PATCH` | `/rooms/:id/tracks/:trackId` | Dislike a track |
| `GET` | `/rooms/:id/users/:userId/tracks` | Get tracks by user |

---

## 📁 Project Structure

```
├── src/
│   ├── common/
│   │   └── guards/         # Auth guard (cookie-based session)
│   ├── modules/
│   │   ├── room/           # Room creation & management
│   │   └── track/          # Playlist & track services
│   └── main.ts
├── prisma/
│   └── schema.prisma
├── Dockerfile
└── docker-compose.yml
```

---

## 🤝 Contributing

Feedback and bug reports are welcome!  
👉 [Submit an issue here](https://forms.gle/ruhd2B76yE1otKce7)

---

## 👤 Author

**Eunsong Choi**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/eunsongchoi04)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/eschoi04)

---

## 📄 License

MIT License © 2026 Eunsong Choi

---

<p align="center">Music data powered by <a href="https://www.last.fm/api">Last.fm API</a> 🎵</p>
