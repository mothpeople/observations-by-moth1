import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useLocation,
} from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { dispatches, findDispatchByParam } from './data/dispatches';
import Masthead from './components/Masthead';
import ArchiveDrawer from './components/ArchiveDrawer';
import LandingPage from './components/LandingPage';
import Dashboard from './pages/Dashboard';
import { recordSiteEvent } from './utils/telemetry';

function PublicationLayout({ dispatch = null, children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const isAnalyticsRoute = location.pathname.startsWith('/analytics');

  const siteOrigin = 'https://observations.moth1.xyz';
  const pageTitle = dispatch
    ? `${dispatch.title} | Observations by Moth1`
    : isAnalyticsRoute
      ? 'Observations by Moth1 Performance Hub'
      : 'Observations by Moth1 | Interactive Visual Essays';
  const pageDescription = dispatch
    ? dispatch.subtitle
    : 'Visual essays on power, generational economics, and street-level reality.';
  const canonicalUrl = dispatch
    ? `${siteOrigin}/${dispatch.slug}`
    : isAnalyticsRoute
      ? `${siteOrigin}/analytics`
      : `${siteOrigin}/`;
  const ogImageUrl = dispatch
    ? `${siteOrigin}${dispatch.ogImage || `/og/og-issue-${dispatch.id}.jpg`}`
    : `${siteOrigin}/og/og-home.jpg`;
  const ogType = dispatch ? 'article' : 'website';

  const jsonLd = dispatch
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: dispatch.title,
        description: dispatch.subtitle,
        image: ogImageUrl,
        datePublished: dispatch.datePublished || '2026-11-01',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        author: {
          '@type': 'Person',
          name: 'Moth1',
          url: 'https://moth1.xyz',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Observations by Moth1',
          url: siteOrigin,
        },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Observations by Moth1',
        url: siteOrigin,
        description: pageDescription,
        publisher: {
          '@type': 'Organization',
          name: 'Observations by Moth1',
          url: siteOrigin,
        },
      };

  // Client-Side UTM Listener: Bypass Vercel Web Analytics Plus Paywall
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const medium = params.get('utm_medium');
      const source = params.get('utm_source');
      const campaign = params.get('utm_campaign');

      const rawMedium = (medium || '').toLowerCase();
      const rawSource = (source || '').toLowerCase();
      const isTrackedCampaign =
        ['story', 'thread', 'video', 'teaser', 'community', 'shorts', 'short', 'post', 'profile', 'bio', 'pin', 'note', 'email', 'newsletter'].includes(rawMedium) ||
        ['instagram', 'facebook', 'x', 'twitter', 'ig', 'fb', 'youtube', 'yt', 'threads', 'pinterest', 'pin', 'substack', 'email', 'mail', 'newsletter'].includes(rawSource) ||
        Boolean(campaign);

      if (isTrackedCampaign) {
        window.sessionStorage.setItem('moth1_utm_medium', rawMedium || 'campaign');
        window.sessionStorage.setItem('moth1_utm_source', rawSource || 'social');
        if (campaign) window.sessionStorage.setItem('moth1_utm_campaign', campaign);

        const sessionKey = `moth1_campaign_${window.location.pathname}_${rawSource}_${rawMedium}_${campaign || ''}`;
        if (!window.sessionStorage.getItem(sessionKey)) {
          window.sessionStorage.setItem(sessionKey, '1');
          fetch('/api/track-story-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              issue: window.location.pathname.replace(/^\//, '') || 'latest',
              source: rawSource || 'social',
              medium: rawMedium || 'campaign',
              campaign: campaign || '',
              timestamp: new Date().toISOString(),
            }),
          }).catch(() => {});
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const searchParams =
      typeof window !== 'undefined' && window.location.search
        ? new URLSearchParams(window.location.search)
        : null;
    const utmMedium = searchParams ? searchParams.get('utm_medium') : null;
    const utmSource = searchParams ? searchParams.get('utm_source') : null;

    if (dispatch) {
      recordSiteEvent('page_view', {
        path: `/${dispatch.slug}`,
        issueId: dispatch.id,
        utm_medium: utmMedium,
        utm_source: utmSource,
      });
    } else {
      if (typeof window !== 'undefined' && window.location.pathname === '/') {
        recordSiteEvent('page_view', {
          path: '/',
          utm_medium: utmMedium,
          utm_source: utmSource,
        });
      }
    }
  }, [dispatch]);

  // Automated Scroll Depth Telemetry (tracks 75%+ scroll completion)
  useEffect(() => {
    if (!dispatch || typeof window === 'undefined') return;
    let tracked75 = false;

    const handleScroll = () => {
      if (tracked75) return;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docHeight = (document.documentElement.scrollHeight || 0) - window.innerHeight;
      if (docHeight > 0) {
        const progress = scrollY / docHeight;
        if (progress >= 0.75) {
          tracked75 = true;
          recordSiteEvent('scroll_depth', {
            depth: 75,
            path: `/${dispatch.slug}`,
            issueId: dispatch.id,
          });

          // Post automated 75% scroll retention event to serverless UTM tracking endpoint
          try {
            const storedMedium =
              window.sessionStorage?.getItem('moth1_utm_medium') ||
              new URLSearchParams(window.location.search).get('utm_medium') ||
              '';
            const storedSource =
              window.sessionStorage?.getItem('moth1_utm_source') ||
              new URLSearchParams(window.location.search).get('utm_source') ||
              '';
            const storedCampaign =
              window.sessionStorage?.getItem('moth1_utm_campaign') ||
              new URLSearchParams(window.location.search).get('utm_campaign') ||
              '';

            const isCampaignSession =
              ['story', 'thread', 'video', 'teaser', 'community', 'shorts', 'short', 'post', 'profile', 'bio', 'pin', 'note', 'email', 'newsletter'].includes(storedMedium.toLowerCase()) ||
              ['instagram', 'facebook', 'x', 'twitter', 'ig', 'fb', 'youtube', 'yt', 'threads', 'pinterest', 'pin', 'substack', 'email', 'mail', 'newsletter'].includes(storedSource.toLowerCase()) ||
              Boolean(storedCampaign);

            if (isCampaignSession) {
              fetch('/api/track-story-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  issue: dispatch.slug,
                  source: storedSource || 'social',
                  medium: storedMedium || 'campaign',
                  campaign: storedCampaign || '',
                  eventType: 'scroll_75',
                  timestamp: new Date().toISOString(),
                }),
              }).catch(() => {});
            }
          } catch {
            // ignore
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount in case user restores previous scroll position
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch]);

  return (
    <div className="relative min-h-screen bg-[#0c0d10] text-[#e6e4dd] selection:bg-[#dc2626] selection:text-[#e6e4dd]">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {isAnalyticsRoute && <meta name="robots" content="noindex, nofollow" />}

        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content="Observations by Moth1" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />

        {!isAnalyticsRoute && (
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        )}
      </Helmet>
      {/* Global SVG Filters: Washi Rice Paper Grain (opacity 0.04) & Sumi-e Brush Edge Displacement */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 w-full h-full z-50 opacity-[0.04]"
      >
        <defs>
          <filter
            id="washi-paper-noise"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.78"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <filter
            id="sumi-brush-stroke"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feTurbulence
              type="turbulence"
              baseFrequency="0.035"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="3.8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#washi-paper-noise)" />
      </svg>

      {/* Global Floating Masthead */}
      <Masthead
        activeDispatch={dispatch}
        totalIssues={dispatches.length}
        isDrawerOpen={isDrawerOpen}
        onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
      />

      {/* Slide-Over Cyber-Zen Archive Drawer */}
      <ArchiveDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        dispatches={dispatches}
        activeDispatch={dispatch}
      />

      {/* Main Content */}
      <main className="relative z-10">{children}</main>
    </div>
  );
}

function DispatchShell({ dispatch }) {
  if (!dispatch) {
    return <Navigate to="/" replace />;
  }
  const ActiveIssueComponent = dispatch.component;
  return (
    <PublicationLayout dispatch={dispatch}>
      <article className="w-full">
        <ActiveIssueComponent />
      </article>
    </PublicationLayout>
  );
}

function DynamicDispatchRoute() {
  const { slug, id } = useParams();
  const matched = findDispatchByParam(slug || id);
  if (!matched) {
    return <Navigate to="/" replace />;
  }
  return <DispatchShell dispatch={matched} />;
}

// Filter out /analytics dashboard traffic so Vercel only tracks pure publication visitors
function filterOutAnalytics(event) {
  if (!event) return null;
  const rawUrl = event.url || (typeof window !== 'undefined' ? window.location.pathname : '');
  if (rawUrl && (rawUrl.includes('/analytics') || rawUrl.startsWith('/analytics'))) {
    return null;
  }
  return event;
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Route /: Main Publication Landing Page with dynamic animated background & links to all issues */}
          <Route
            path="/"
            element={
              <PublicationLayout dispatch={null}>
                <LandingPage dispatches={dispatches} />
              </PublicationLayout>
            }
          />

          {/* Route /analytics: Hidden Multi-Channel Publication Telemetry Dashboard */}
          <Route
            path="/analytics"
            element={
              <PublicationLayout dispatch={null}>
                <Dashboard />
              </PublicationLayout>
            }
          />
          {/* Route /dashboard alias redirect to /analytics */}
          <Route path="/dashboard" element={<Navigate to="/analytics" replace />} />

          {/* Route /:slug and /issue/:id: Dynamically renders the matching dispatch */}
          <Route path="/:slug" element={<DynamicDispatchRoute />} />
          <Route path="/issue/:id" element={<DynamicDispatchRoute />} />

          {/* Fallback route *: Redirects to / */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Analytics beforeSend={filterOutAnalytics} />
      <SpeedInsights beforeSend={filterOutAnalytics} />
    </>
  );
}
