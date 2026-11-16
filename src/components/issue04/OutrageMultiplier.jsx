import React from 'react';
import { clamp, remap } from '../../utils/math';

/**
 * OutrageMultiplier — Authentic Social Media Mobile App Feed Mockup
 * - When mode="algorithmic" (Beat 3): Shows a dedicated 6-post "For You (5x Rage)" feed
 *   without the Reformed tab, auto-scrolling through all 6 posts as the user scrolls the page.
 * - When mode="reformed" (Beat 7): Shows a dedicated 7-post "Following (ZK-KYC Chronological)" feed
 *   without the 5x Rage tab, auto-scrolling through all 7 posts as the user scrolls the stage.
 */
export default function OutrageMultiplier({
  defaultMode = 'algorithmic',
  scrollProgress = 0,
  compact = false,
}) {
  const isAlgo = defaultMode === 'algorithmic';

  const algorithmicFeed = [
    {
      name: 'Patriot Eagle 99',
      author: '@anon_patriot_99281',
      avatar: '🤖',
      avatarBg: 'bg-[#ef4444]/20 border-[#ef4444]',
      time: '2m • Promoted by 5x Rage Engine',
      badge: 'UNVERIFIED BOT • 5X RAGE BOOST',
      content:
        'They are deliberately poisoning your neighbourhood and laughing about it. Share this before they delete it!',
      angryCount: '14.2K',
      commentsCount: '3.1K',
      sharesCount: '8.9K',
      likesCount: '190',
      reachScore: '98% Feed Reach',
      reachPct: 98,
      tone: 'hostile',
    },
    {
      name: 'Daily Outrage Alert',
      author: '@rage_bait_daily',
      avatar: '🔥',
      avatarBg: 'bg-[#eab308]/20 border-[#eab308]',
      time: '6m • Trending in Your Silo',
      badge: 'SYNTHETIC OUTRAGE • 5X RAGE BOOST',
      content:
        'If you disagree with this slogan, you are a traitor to your own people. Wake up!',
      angryCount: '9.4K',
      commentsCount: '4.1K',
      sharesCount: '5.2K',
      likesCount: '112',
      reachScore: '91% Feed Reach',
      reachPct: 91,
      tone: 'hostile',
    },
    {
      name: 'Culture War Now',
      author: '@tribal_shock_feed',
      avatar: '⚡',
      avatarBg: 'bg-[#ef4444]/20 border-[#ef4444]',
      time: '11m • 5x Hostility Multiplier',
      badge: 'TROLL FARM NODE • 5X RAGE BOOST',
      content:
        'WATCH: Your neighbours are secretly plotting to destroy your way of life. Retweet to expose them immediately!',
      angryCount: '22.8K',
      commentsCount: '6.7K',
      sharesCount: '15.4K',
      likesCount: '310',
      reachScore: '99% Feed Reach',
      reachPct: 99,
      tone: 'hostile',
    },
    {
      name: 'Doomscroll Insider',
      author: '@panic_wire_247',
      avatar: '🚨',
      avatarBg: 'bg-[#ef4444]/20 border-[#ef4444]',
      time: '19m •Suggested for You',
      badge: 'CLICKBAIT MILL • 5X RAGE BOOST',
      content:
        'BREAKING: Everything you were taught is a lie orchestrated by your political enemies. Full thread below!',
      angryCount: '18.1K',
      commentsCount: '5.3K',
      sharesCount: '11.2K',
      likesCount: '245',
      reachScore: '95% Feed Reach',
      reachPct: 95,
      tone: 'hostile',
    },
    {
      name: 'Echo Chamber TV',
      author: '@silo_amplifier_08',
      avatar: '📢',
      avatarBg: 'bg-[#eab308]/20 border-[#eab308]',
      time: '27m • Viral Out-Group Attack',
      badge: 'AUTOMATED SWARM • 5X RAGE BOOST',
      content:
        'Compromise is surrender. Anyone calling for calm dialogue is paid by the opposition!',
      angryCount: '11.6K',
      commentsCount: '2.9K',
      sharesCount: '7.4K',
      likesCount: '98',
      reachScore: '89% Feed Reach',
      reachPct: 89,
      tone: 'hostile',
    },
    {
      name: 'Civic Water Lab',
      author: '@civic_research_lab',
      avatar: '🔬',
      avatarBg: 'bg-neutral-800 border-neutral-600',
      time: '4h • Buried by Algorithm',
      badge: 'VERIFIED HUMAN • 1X NEUTRAL WEIGHT',
      content:
        'We analysed three years of municipal water testing data across twelve districts. Here is the full dataset.',
      angryCount: '0',
      commentsCount: '2',
      sharesCount: '4',
      likesCount: '18',
      reachScore: '3% Reach (Throttled)',
      reachPct: 6,
      tone: 'buried',
    },
  ];

  const reformedFeed = [
    {
      name: 'Civic Water Lab',
      author: '@civic_research_lab',
      avatar: '🔬',
      avatarBg: 'bg-[#22c55e]/20 border-[#22c55e]',
      time: '4m • Chronological Subscription',
      badge: 'ZK-KYC HUMAN • CHRONOLOGICAL',
      content:
        'We analysed three years of municipal water testing data across twelve districts. Here is the full dataset.',
      angryCount: '0',
      commentsCount: '64',
      sharesCount: '128',
      likesCount: '412',
      reachScore: '100% Follower Delivery',
      reachPct: 100,
      tone: 'healthy',
    },
    {
      name: 'Local Urbanist Collective',
      author: '@local_urbanist',
      avatar: '🏛️',
      avatarBg: 'bg-[#22c55e]/20 border-[#22c55e]',
      time: '12m • Chronological Subscription',
      badge: 'ZK-KYC HUMAN • CHRONOLOGICAL',
      content:
        'Notes from tonight’s town hall on converting the disused bus depot into a community workshop and library.',
      angryCount: '0',
      commentsCount: '41',
      sharesCount: '95',
      likesCount: '289',
      reachScore: '100% Follower Delivery',
      reachPct: 100,
      tone: 'healthy',
    },
    {
      name: 'Dr. Mei-Ling Tan',
      author: '@dr_tan_geriatrics',
      avatar: '🩺',
      avatarBg: 'bg-[#22c55e]/20 border-[#22c55e]',
      time: '21m • Chronological Subscription',
      badge: 'ZK-KYC HUMAN • CHRONOLOGICAL',
      content:
        'Our clinic’s new morning walking and chess club for seniors aged 65+ starts this Saturday at Victoria Park. All welcome.',
      angryCount: '0',
      commentsCount: '53',
      sharesCount: '140',
      likesCount: '518',
      reachScore: '100% Follower Delivery',
      reachPct: 100,
      tone: 'healthy',
    },
    {
      name: 'Harbour Public Library',
      author: '@harbour_library_hub',
      avatar: '📚',
      avatarBg: 'bg-[#22c55e]/20 border-[#22c55e]',
      time: '34m • Chronological Subscription',
      badge: 'ZK-KYC HUMAN • CHRONOLOGICAL',
      content:
        'Funded by the municipal digital ad-extraction levy: late-night reading rooms and free woodworking benches are now open until 10 PM.',
      angryCount: '0',
      commentsCount: '38',
      sharesCount: '112',
      likesCount: '640',
      reachScore: '100% Follower Delivery',
      reachPct: 100,
      tone: 'healthy',
    },
    {
      name: 'Open Social Protocol',
      author: '@open_graph_wg',
      avatar: '🔐',
      avatarBg: 'bg-[#22c55e]/20 border-[#22c55e]',
      time: '49m • Chronological Subscription',
      badge: 'ZK-KYC HUMAN • CHRONOLOGICAL',
      content:
        'Protocol v2.4 is live: export your entire follower graph to any ad-free client in one click with zero data lock-in.',
      angryCount: '0',
      commentsCount: '72',
      sharesCount: '204',
      likesCount: '495',
      reachScore: '100% Follower Delivery',
      reachPct: 100,
      tone: 'healthy',
    },
    {
      name: 'District 04 Repair Café',
      author: '@d04_repair_commons',
      avatar: '🛠️',
      avatarBg: 'bg-[#22c55e]/20 border-[#22c55e]',
      time: '1h • Chronological Subscription',
      badge: 'ZK-KYC HUMAN • CHRONOLOGICAL',
      content:
        'Retired engineers paired with secondary school students fixed 42 household appliances this weekend. Next session: Sunday at 2 PM.',
      angryCount: '0',
      commentsCount: '29',
      sharesCount: '84',
      likesCount: '376',
      reachScore: '100% Follower Delivery',
      reachPct: 100,
      tone: 'healthy',
    },
    {
      name: 'Public Audit Observatory',
      author: '@civic_audit_uk',
      avatar: '📊',
      avatarBg: 'bg-[#22c55e]/20 border-[#22c55e]',
      time: '2h • Chronological Subscription',
      badge: 'ZK-KYC HUMAN • CHRONOLOGICAL',
      content:
        'Six months after mandatory 1:1 Zero-Knowledge Proof-of-Personhood took effect: coordinated bot astroturfing dropped by 99.4%.',
      angryCount: '0',
      commentsCount: '88',
      sharesCount: '310',
      likesCount: '820',
      reachScore: '100% Follower Delivery',
      reachPct: 100,
      tone: 'healthy',
    },
  ];

  const posts = isAlgo ? algorithmicFeed : reformedFeed;

  // Scroll-driven vertical feed translation so the reader watches the 6–7 posts scroll inside the phone
  const feedScrollPct = clamp(remap(scrollProgress, 0.06, 0.92, 0, 1), 0, 1);
  const maxTranslatePx = isAlgo ? 540 : 620;
  const translateY = -Math.round(feedScrollPct * maxTranslatePx);

  return (
    <div
      className={`w-full rounded-[28px] sm:rounded-[34px] bg-[#0b0d14]/96 border-2 ${
        isAlgo ? 'border-[#ef4444]/45' : 'border-[#22c55e]/45'
      } text-[#e2e8f0] font-sans relative overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-xl transition-colors duration-300 ${
        compact ? 'p-2.5 sm:p-5' : 'max-w-3xl mx-auto my-8 p-4 sm:p-6'
      }`}
    >
      {/* Realistic Mobile Phone Top Status Bar & Speaker Pill */}
      <div className="flex items-center justify-between px-2 sm:px-3 pb-2 mb-2 border-b border-neutral-800/90 text-[9px] sm:text-[10px] font-mono text-neutral-400">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isAlgo ? 'bg-[#ef4444] animate-ping' : 'bg-[#22c55e]'
            }`}
          />
          <span className="font-bold text-white">
            {isAlgo ? '02:14 AM' : '10:30 AM'}
          </span>
          <span className="hidden sm:inline text-neutral-500">
            {isAlgo ? '• LIVE ALGORITHMIC FEED' : '• CHRONOLOGICAL CIVIC FEED'}
          </span>
        </div>

        <div className="hidden sm:block w-20 h-3 rounded-full bg-[#050608] border border-neutral-800" />

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold ${
              isAlgo
                ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40'
                : 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40'
            }`}
          >
            {isAlgo
              ? '😡 5X OUTRAGE ENGINE ACTIVE'
              : '🛡️ 1:1 ZK-KYC VERIFIED HUMANS'}
          </span>
        </div>
      </div>

      {/* Dedicated Single-Mode App Header Bar (No cross-tab clutter) */}
      <div
        className={`flex items-center justify-between px-3 sm:px-4 py-2 rounded-2xl mb-2.5 border ${
          isAlgo
            ? 'bg-[#180b0e] border-[#ef4444]/40 text-[#ef4444]'
            : 'bg-[#0b1811] border-[#22c55e]/40 text-[#22c55e]'
        }`}
      >
        <div className="flex items-center gap-2 font-mono text-[9.5px] sm:text-xs font-extrabold uppercase tracking-wider">
          <span>
            {isAlgo
              ? '🔥 For You • Algorithmic Outrage Stream (6 Posts)'
              : '🛡️ Following • Chronological ZK-KYC Stream (7 Posts)'}
          </span>
        </div>
        <span className="font-mono text-[8.5px] sm:text-[10px] text-neutral-300">
          {Math.round(feedScrollPct * 100)}% Scrolled
        </span>
      </div>

      {/* Scrollable + Auto-Scrolling Social Media Feed Viewport */}
      <div className="relative h-[185px] sm:h-[350px] overflow-hidden rounded-2xl bg-[#07080c]/90 border border-neutral-800/80 p-2 sm:p-3">
        <div
          style={{
            transform: `translate3d(0, ${translateY}px, 0)`,
          }}
          className="space-y-2 sm:space-y-2.5 transition-transform duration-150 ease-out will-change-transform"
        >
          {posts.map((post, idx) => (
            <div
              key={idx}
              className={`p-2.5 sm:p-3.5 rounded-2xl border transition-all ${
                post.tone === 'hostile'
                  ? 'bg-[#160d10]/95 border-[#ef4444]/45 shadow-[0_8px_25px_rgba(239,68,68,0.12)]'
                  : post.tone === 'buried'
                    ? 'bg-[#0b0c10]/80 border-neutral-800/80 opacity-55'
                    : 'bg-[#0c1612]/95 border-[#22c55e]/45 shadow-[0_8px_25px_rgba(34,197,94,0.1)]'
              }`}
            >
              {/* Post Header: Avatar + Name + @Handle + Algorithm Badge */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center text-xs sm:text-sm shrink-0 ${post.avatarBg}`}
                  >
                    {post.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-[11px] sm:text-xs font-bold text-white truncate">
                        {post.name}
                      </span>
                      <span className="text-[9.5px] sm:text-[11px] font-mono text-neutral-400 truncate">
                        {post.author}
                      </span>
                    </div>
                    <div className="text-[8px] sm:text-[9.5px] font-mono text-neutral-400 truncate">
                      {post.time}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[7.5px] sm:text-[8.5px] font-mono px-2 py-0.5 rounded-full border font-bold shrink-0 ${
                    post.tone === 'hostile'
                      ? 'border-[#ef4444]/60 text-[#ef4444] bg-[#ef4444]/15'
                      : post.tone === 'buried'
                        ? 'border-neutral-700 text-neutral-400 bg-neutral-900'
                        : 'border-[#22c55e]/60 text-[#22c55e] bg-[#22c55e]/15'
                  }`}
                >
                  {post.badge}
                </span>
              </div>

              {/* Post Body Copy */}
              <p className="text-[10.5px] sm:text-xs text-neutral-100 leading-snug mb-1.5 pl-9 sm:pl-10">
                {post.content}
              </p>

              {/* Authentic Social Media Action Bar */}
              <div className="pl-9 sm:pl-10 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-800/70 text-[8.5px] sm:text-[10px] font-mono">
                <div className="flex items-center gap-2.5 sm:gap-3.5 text-neutral-300">
                  {post.tone === 'hostile' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] font-bold">
                      😡 {post.angryCount}{' '}
                      <span className="text-[7.5px] text-[#eab308]">(5x)</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    💬 {post.commentsCount}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    🔁 {post.sharesCount}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 ${
                      post.tone === 'healthy' ? 'text-[#22c55e] font-bold' : ''
                    }`}
                  >
                    ❤️ {post.likesCount}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="hidden sm:block w-12 h-1.5 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
                    <div
                      style={{
                        width: `${post.reachPct}%`,
                        backgroundColor:
                          post.tone === 'hostile'
                            ? '#ef4444'
                            : post.tone === 'healthy'
                              ? '#22c55e'
                              : '#525252',
                      }}
                      className="h-full rounded-full"
                    />
                  </div>
                  <span
                    className={
                      post.tone === 'hostile'
                        ? 'text-[#eab308] font-bold'
                        : post.tone === 'healthy'
                          ? 'text-[#22c55e] font-bold'
                          : 'text-neutral-500'
                    }
                  >
                    {post.reachScore}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Fade Gradient inside Phone Screen */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#07080c] to-transparent" />
      </div>

      <div className="hidden sm:flex items-center justify-between mt-2 pt-1.5 font-mono text-[9px] text-neutral-400">
        <span>
          {isAlgo
            ? 'Ref: Internal Platform Ranking Disclosures (5 pts Angry vs. 1 pt Like)'
            : 'Ref: IEEE Zero-Knowledge Proof-of-Personhood & Chronological Feed Standard'}
        </span>
        <span className={isAlgo ? 'text-[#ef4444]' : 'text-[#22c55e]'}>
          {isAlgo
            ? 'Scroll page to watch the angry feed unfold ↓'
            : 'Scroll page to browse the verified human stream ↓'}
        </span>
      </div>
    </div>
  );
}
