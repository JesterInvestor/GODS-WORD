"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import FunProButton from '../components/FunProButton';

// Helper function to generate Bible reference links
function getBibleLink(book: string, chapter: number): string {
  const bookMap: Record<string, string> = {
    Genesis: 'Genesis',
    Exodus: 'Exodus',
    Luke: 'Luke',
    John: 'John',
    Psalm: 'Psalms',
    Romans: 'Romans',
    Hebrews: 'Hebrews',
    '1 Corinthians': '1Corinthians',
    Isaiah: 'Isaiah',
    Ephesians: 'Ephesians',
    Jeremiah: 'Jeremiah',
  };
  const bookFile = bookMap[book] || book;
  return `/bible?book=${bookFile}&chapter=${chapter}`;
}

export default function Home() {
  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
        console.log('[Farcaster] ready() called from app/page');
      } catch (e) {
        console.log('[Farcaster] ready() failed in app/page (not in host?):', e);
      }
    };

    init();
  }, []);

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
              className="w-full sm:w-auto text-center inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-300"
            >
              Old Testament
            </Link>
            <Link
              href="/bible?testament=new"
              className="w-full sm:w-auto text-center inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-300"
            >
              New Testament
            </Link>
            <Link
              href="/strongs"
              className="w-full sm:w-auto text-center inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-300"
            >
              Strong&apos;s Concordance
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Reading setting (change with ⚙️) Click on any word to view Strong&apos;s Concordance
            reference (toggle off with S#). Jesus&apos; word red underline (toggle off with J)
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
            <div className="flex flex-wrap justify-center items-stretch gap-4">
              <FunProButton href={getBibleLink('Genesis', 1)} label="Genesis 1" />
              <FunProButton href={getBibleLink('Exodus', 20)} label="Exodus 20" />
              <FunProButton href={getBibleLink('Luke', 2)} label="Luke 2" />
              <FunProButton href={getBibleLink('John', 3)} label="John 3" />
              <FunProButton href={getBibleLink('Psalm', 23)} label="Psalm 23" />
              <FunProButton href={getBibleLink('Romans', 8)} label="Romans 8" />
              <FunProButton href={getBibleLink('John', 1)} label="John 1" />
              <FunProButton href={getBibleLink('Hebrews', 11)} label="Hebrews 11" />
              <FunProButton href={getBibleLink('Romans', 1)} label="Romans 1" />
              <FunProButton href={getBibleLink('Romans', 3)} label="Romans 3" />
              <FunProButton href={getBibleLink('Genesis', 6)} label="Genesis 6" />
              <FunProButton href={getBibleLink('Psalm', 14)} label="Psalm 14" />
              <FunProButton href={getBibleLink('Isaiah', 53)} label="Isaiah 53" />
              <FunProButton href={getBibleLink('Ephesians', 2)} label="Ephesians 2" />
              <FunProButton href={getBibleLink('Jeremiah', 17)} label="Jeremiah 17" />
            </div>
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Thanks to openscriptures, kenyonbowers, and kaiserlik
          </p>
        </div>
      </div>
    </main>
  );
}
