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

- **Next.js 15** - React framework for production
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Bible Data** - KJV with Strong's numbers from [kaiserlik/kjv](https://github.com/kaiserlik/kjv)
- **Strong's Concordance** - From [openscriptures/strongs](https://github.com/openscriptures/strongs)

## Project Structure

```
GODS-WORD/
├── app/
│   ├── bible/
│   │   └── page.tsx      # Bible reading interface
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/
│   └── bible.ts          # Bible data utilities
├── public/
│   └── data/             # Bible JSON files and Strong's data
├── components/           # Reusable React components
└── package.json
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
