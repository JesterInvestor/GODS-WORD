# GOD'S WORD - KJV Bible Reader

A Next.js application for reading the King James Version Bible with an integrated Strong's Concordance. This app provides a clean, mobile-friendly interface for studying God's Word.

## Features

✅ Complete King James Version Bible (all 66 books)
✅ Mobile-friendly responsive design with large, readable text
✅ Interactive table of contents for easy navigation
✅ Chapter selection interface
✅ Previous/Next chapter navigation
✅ **Strong's Concordance integration with clickable word references**
✅ **Interactive tooltips and modals for Strong's definitions**
✅ **Embedded Strong's numbers in Bible text (e.g., God[H430])**
✅ Dark mode support
✅ Clean, distraction-free reading experience

## Screenshots

### Home Page

![Home Page](https://github.com/user-attachments/assets/6d5b4912-10b8-4229-9794-446652071dfd)

### Bible Reading View

![Bible Reading](https://github.com/user-attachments/assets/dd547643-cf66-4101-93c9-628f2b7decd9)

### Table of Contents

![Table of Contents](https://github.com/user-attachments/assets/49a437ad-deb7-4d2f-a140-cbef5a3b9d58)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/JesterInvestor/GODS-WORD.git
cd GODS-WORD
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript with strict mode
- **Tailwind CSS** - Utility-first CSS framework
- **SWR** - Client-side data fetching with caching
- **Bible Data** - KJV with Strong's numbers from [kaiserlik/kjv](https://github.com/kaiserlik/kjv)
- **Strong's Concordance** - From [openscriptures/strongs](https://github.com/openscriptures/strongs)

### Next.js 14/15 Best Practices

This project implements modern Next.js best practices including:

- ✅ TypeScript with strict mode configuration
- ✅ ESLint and Prettier for code quality
- ✅ Custom React hooks for reusable logic
- ✅ API routes with edge runtime and ISR
- ✅ Server Actions for data mutations
- ✅ Enhanced metadata and SEO optimization
- ✅ Performance monitoring with instrumentation
- ✅ Error boundaries and custom error pages
- ✅ SWR for client-side data fetching
- ✅ Custom caching strategies
- ✅ Turbopack support for faster builds

For detailed implementation, see [NEXTJS_BEST_PRACTICES.md](NEXTJS_BEST_PRACTICES.md).

## Project Structure

```
GODS-WORD/
├── app/
│   ├── actions/           # Server Actions
│   ├── api/               # API Routes (serverless functions)
│   ├── bible/
│   │   └── page.tsx       # Bible reading interface
│   ├── strongs/
│   │   └── page.tsx       # Strong's Concordance page
│   ├── error.tsx          # Error boundary
│   ├── not-found.tsx      # 404 page
│   ├── loading.tsx        # Loading UI
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configs
│   ├── bible.ts           # Bible data utilities
│   ├── strongs.ts         # Strong's dictionary utilities
│   ├── seo.config.ts      # SEO configuration
│   └── swr-config.ts      # SWR configuration
├── public/
│   └── data/              # Bible JSON files and Strong's data
├── instrumentation.ts     # Performance monitoring
└── package.json
```

## Development Commands

```bash
# Start development server
npm run dev

# Start with Turbopack (faster)
npm run dev:turbo

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

## Data Sources

This application uses:

- **Bible Text**: King James Version with embedded Strong's numbers from [kaiserlik/kjv](https://github.com/kaiserlik/kjv)
- **Strong's Concordance**: Hebrew and Greek dictionaries from [openscriptures/strongs](https://github.com/openscriptures/strongs)

## License

This project uses public domain Bible texts and concordance data.

## Acknowledgments

- Bible text with Strong's numbers courtesy of [kaiserlik/kjv](https://github.com/kaiserlik/kjv)
- Strong's Concordance data from [openscriptures/strongs](https://github.com/openscriptures/strongs)
- Built with love for studying God's Word
