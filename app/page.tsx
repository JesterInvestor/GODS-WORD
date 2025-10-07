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
    '1 Corinthians': '1Corinthians'
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
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Popular Chapters
            </h3>
            <div className="space-y-2">
              <Link href={getBibleLink('Genesis', 1)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Genesis 1</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">— Describes the creation of the world, introducing God as the Creator.</span>
              </Link>
              <Link href={getBibleLink('Exodus', 20)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Exodus 20</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">— Contains the Ten Commandments, fundamental laws given to Moses.</span>
              </Link>
              <Link href={getBibleLink('Luke', 2)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Luke 2</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">— Narrates the birth of Jesus, including the visit of the shepherds.</span>
              </Link>
              <Link href={getBibleLink('John', 3)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">John 3</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">— Features the famous verse about God&apos;s love and the promise of eternal life.</span>
              </Link>
              <Link href={getBibleLink('Psalm', 23)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Psalm 23</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">— Known for its comforting message about God as the Shepherd who guides and protects.</span>
              </Link>
              <Link href={getBibleLink('Romans', 8)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Romans 8</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">— Discusses themes of salvation, the work of the Holy Spirit, and the hope of glory.</span>
              </Link>
              <Link href={getBibleLink('John', 1)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">John 1</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">— Introduces Jesus as the Word and emphasizes His divine nature.</span>
              </Link>
              <Link href={getBibleLink('Hebrews', 11)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Hebrews 11</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">— Highlights examples of faith from biblical figures, inspiring readers in their own faith journeys.</span>
              </Link>
            </div>
          </div>

          {/* Seasonal Favorites */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Seasonal Favorites
            </h3>
            <div className="space-y-2">
              <Link href={getBibleLink('Luke', 2)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Luke 2</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">— Especially popular during Christmas for its account of Jesus&apos; birth.</span>
              </Link>
              <Link href={getBibleLink('John', 19)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">John 19</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">— Often gains attention around Easter due to the crucifixion narrative.</span>
              </Link>
            </div>
          </div>

          {/* Notable Mentions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Notable Mentions
            </h3>
            <div className="space-y-2">
              <Link href={getBibleLink('1 Corinthians', 13)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">1 Corinthians 13</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">— Frequently referred to as the &quot;Love Chapter,&quot; emphasizing the importance of love in Christian life.</span>
              </Link>
              <Link href={getBibleLink('Psalm', 91)} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Psalm 91</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">— Favored for its themes of protection and trust in God.</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
