import Link from 'next/link';

// Helper function to generate Bible reference links
function getBibleLink(book: string, chapter: number): string {
  // Convert book name to match the BOOKS array format
  const bookMap: Record<string, string> = {
    'Genesis': 'Genesis',
    'Exodus': 'Exodus',
    'Luke': 'Luke',
    'John': 'John',
    'Psalm': 'Psalms',
    'Romans': 'Romans',
    'Hebrews': 'Hebrews',
    '1 Corinthians': '1Corinthians',
    'Isaiah': 'Isaiah',
    'Ephesians': 'Ephesians',
    'Jeremiah': 'Jeremiah'
  };
  const bookFile = bookMap[book] || book;
  return `/bible?book=${bookFile}&chapter=${chapter}`;
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
          GOD&apos;S WORD
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          King James Version Bible with Strong&apos;s Concordance
        </p>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/bible?testament=old"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Old Testament
            </Link>
            <Link 
              href="/bible?testament=new"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              New Testament
            </Link>
            <Link 
              href="/strongs"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Strong&apos;s Concordance
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Click on any word to view Strong&apos;s Concordance reference (toggle off with S#)
          </p>
        </div>

        {/* Quick Reference Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-left">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Quick Reference
          </h2>
          
          {/* Popular Chapters */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Popular Chapters
            </h3>
            <div className="space-y-2">
              <Link href={getBibleLink('Genesis', 1)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Genesis 1</span>
              </Link>
              <Link href={getBibleLink('Exodus', 20)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Exodus 20</span>
              </Link>
              <Link href={getBibleLink('Luke', 2)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Luke 2</span>
              </Link>
              <Link href={getBibleLink('John', 3)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">John 3</span>
              </Link>
              <Link href={getBibleLink('Psalm', 23)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Psalm 23</span>
              </Link>
              <Link href={getBibleLink('Romans', 8)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Romans 8</span>
              </Link>
              <Link href={getBibleLink('John', 1)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">John 1</span>
              </Link>
              <Link href={getBibleLink('Hebrews', 11)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Hebrews 11</span>
              </Link>
              <Link href={getBibleLink('Romans', 1)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Romans 1</span>
              </Link>
              <Link href={getBibleLink('Romans', 3)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Romans 3</span>
              </Link>
              <Link href={getBibleLink('Genesis', 6)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Genesis 6</span>
              </Link>
              <Link href={getBibleLink('Psalm', 14)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Psalm 14</span>
              </Link>
              <Link href={getBibleLink('Isaiah', 53)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Isaiah 53</span>
              </Link>
              <Link href={getBibleLink('Ephesians', 2)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Ephesians 2</span>
              </Link>
              <Link href={getBibleLink('Jeremiah', 17)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Jeremiah 17</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Thanks to openscriptures
          </p>
        </div>
      </div>
    </main>
  );
}
