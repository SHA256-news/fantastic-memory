import React, { useEffect, useState } from 'react';

const lead = {
  title: 'Hashrate hits record as new rigs come online',
  deck: 'Bitcoin mining difficulty surges after a wave of next-gen ASICs are deployed in North America.',
  byline: 'By SHA256 News Desk',
  time: 'Updated 1 hour ago',
};

const markets = [
  { s: 'Hashprice', p: '$72.10/PH/s/day', c: '−1.2%' },
  { s: 'BTC', p: '$63,842', c: '+0.4%' },
  { s: 'Mining Difficulty', p: '82.1 T', c: '+0.9%' },
  { s: 'Energy Index', p: '$54.20/MWh', c: '−0.5%' },
];

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Masthead />
      <MarketsStrip />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <article>
          <h1 className="font-serif text-3xl sm:text-4xl leading-tight tracking-tight">{lead.title}</h1>
          <p className="mt-3 text-lg leading-relaxed text-zinc-300">{lead.deck}</p>
          <div className="mt-3 text-xs uppercase tracking-widest text-zinc-400">
            <span className="font-semibold">{lead.byline}</span>
            <span className="mx-2">•</span>
            <time>{lead.time}</time>
          </div>
        </article>
        <LatestHeadlinesWidget />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

function Masthead() {
  return (
    <header className="border-b border-zinc-800">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="py-6 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl">SHA256 News</h1>
          <div className="mt-2 text-[11px] tracking-widest uppercase text-zinc-400">
            Bitcoin Mining •{' '}
            {new Date().toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

function MarketsStrip() {
  return (
    <div className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 py-3 text-sm">
          {markets.map((m, i) => (
            <div key={i} className="flex items-baseline gap-2">
              <span className="font-semibold">{m.s}</span>
              <span className="tabular-nums">{m.p}</span>
              <span
                className={`tabular-nums ${m.c.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {m.c}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LatestHeadlinesWidget() {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useEmbed, setUseEmbed] = useState(false);

  useEffect(() => {
    if (useEmbed) {
      const existing = document.getElementById('x-wjs');
      if (!existing) {
        const s = document.createElement('script');
        s.id = 'x-wjs';
        s.async = true;
        s.src = 'https://platform.twitter.com/widgets.js';
        document.body.appendChild(s);
      } else if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load();
      }
      return undefined;
    }

    let ignore = false;

    async function fetchTweets() {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}api/sha256news-tweets.json`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        if (!ignore) {
          setTweets(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!ignore) {
          setError(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchTweets();

    return () => {
      ignore = true;
    };
  }, [useEmbed]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <h2 className="text-xl font-serif">Latest Headlines</h2>
        <button
          onClick={() => setUseEmbed((v) => !v)}
          className="text-xs border border-zinc-600 px-2 py-1 rounded hover:bg-zinc-800"
        >
          {useEmbed ? 'Use Server Feed' : 'Load X Embed'}
        </button>
      </div>
      {useEmbed ? (
        <div className="border border-zinc-800 bg-zinc-900 p-3 rounded-md">
          <a
            className="twitter-timeline"
            data-theme="dark"
            data-chrome="transparent noheader nofooter"
            data-tweet-limit="5"
            href="https://x.com/SHA256News"
          >
            Tweets by @SHA256News
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {error ? (
            <div className="text-sm text-zinc-300">
              Could not load feed.{' '}
              <a className="underline" href="https://x.com/SHA256News" target="_blank" rel="noreferrer">
                Open @SHA256News on X
              </a>
              .
            </div>
          ) : loading ? (
            <div className="text-xs text-zinc-500">Loading feed…</div>
          ) : (
            <ul className="space-y-3">
              {tweets.map((t) => (
                <li key={t.id} className="border border-zinc-800 bg-zinc-900 p-3 rounded-md">
                  <p className="text-sm text-zinc-200">{t.text}</p>
                  {Array.isArray(t.media) && t.media.length > 0 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto">
                      {t.media.map((m, i) => (
                        <img key={i} src={m} alt="media" className="h-20 w-20 object-cover rounded" />
                      ))}
                    </div>
                  )}
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block text-xs text-emerald-400 underline"
                  >
                    View on X
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function Newsletter() {
  return (
    <section className="border border-zinc-800 bg-zinc-900 p-6 text-center">
      <h3 className="font-serif text-xl">Stay Updated</h3>
      <p className="mt-1 text-sm text-zinc-400">Get early Bitcoin mining news in your inbox.</p>
      <form className="mt-3 flex flex-col sm:flex-row gap-2 justify-center" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="you@company.com"
          className="w-full sm:w-64 border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-0"
        />
        <button className="border border-zinc-100 px-4 py-2 text-sm font-semibold">Subscribe</button>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-800 py-6 text-sm text-zinc-400 text-center">
      <div>© {new Date().getFullYear()} SHA256 Media — Bitcoin Mining Only</div>
    </footer>
  );
}
