import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
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

  // Client-Side UTM Listener: Bypass Vercel Web Analytics Plus Paywall
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const medium = params.get('utm_medium');
      const source = params.get('utm_source');
      const campaign = params.get('utm_campaign');

      if (medium === 'story' || source === 'instagram' || source === 'facebook') {
        const sessionKey = `moth1_story_click_${window.location.pathname}_${source}_${medium}`;
        if (!window.sessionStorage.getItem(sessionKey)) {
          window.sessionStorage.setItem(sessionKey, '1');
          fetch('/api/track-story-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              issue: window.location.pathname.replace(/^\//, '') || 'latest',
              source: source || 'social',
              medium: medium || 'story',
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
      document.title = `Issue #${dispatch.id}: ${dispatch.title}, Observations by Moth1`;
      recordSiteEvent('page_view', {
        path: `/${dispatch.slug}`,
        issueId: dispatch.id,
        utm_medium: utmMedium,
        utm_source: utmSource,
      });
    } else {
      document.title = 'Observations by Moth1 | Interactive Visual Essays';
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
            const isStory =
              window.sessionStorage?.getItem('moth1_utm_medium') === 'story' ||
              new URLSearchParams(window.location.search).get('utm_medium') === 'story';
            if (isStory) {
              const storySrc =
                window.sessionStorage?.getItem('moth1_utm_source') ||
                new URLSearchParams(window.location.search).get('utm_source') ||
                'social';
              fetch('/api/track-story-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  issue: dispatch.slug,
                  source: storySrc,
                  medium: 'story',
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

      {/* Vercel Web Analytics */}
      <Analytics />
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
      <ActiveIssueComponent />
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

          {/* Route /:slug and /issue/:id: Dynamically renders the matching dispatch */}
          <Route path="/:slug" element={<DynamicDispatchRoute />} />
          <Route path="/issue/:id" element={<DynamicDispatchRoute />} />

          {/* Fallback route *: Redirects to / */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <SpeedInsights />
    </>
  );
}
