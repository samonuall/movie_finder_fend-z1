# Movie Finder

A web application that allows users to find movies together in an infinite scroll style. Pulls movie data from the TMDB API, streaming data from streamwatch. Built with Next.js, React, TailwindCSS, and Supabase.

## Features

- 🔐 **Authentication**: Secure login with email/password or Google OAuth
- 🎬 **Movie Discovery**: Browse movies with infinite scroll
- 👤 **User Profiles**: Personalized movie collections and watchlists
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🔒 **Protected Routes**: Authentication-required pages with middleware

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Database**: [Supabase](https://supabase.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.17.0 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v10.x or higher) - Install with `npm install -g pnpm`
- **Git** - [Download](https://git-scm.com/)

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/samonuall/movie_finder_fend-z1.git
cd movie_finder_fend-z1
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: OAuth redirect (for development)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

To get your Supabase credentials:
1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy the Project URL and anon/public key

4. **Configure Supabase Authentication**

In your Supabase dashboard:
1. Go to **Authentication → URL Configuration**
2. Add these redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
3. Enable **Google OAuth** (optional):
   - Go to Authentication → Providers
   - Enable Google and add your OAuth credentials

## Running the Application

### Development Mode

Start the development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

Build the application for production:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

### Linting

Run ESLint to check for code issues:

```bash
pnpm lint
```
