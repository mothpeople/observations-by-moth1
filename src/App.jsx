import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { dispatches, findDispatchByParam } from './data/dispatches';
import Masthead from './components/Masthead';
import ArchiveDrawer from './components/ArchiveDrawer';
import LandingPage from './components/LandingPage';

function PublicationLayout({ dispatch = null, children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (dispatch) {
      document.title = `Issue #${dispatch.id}: ${dispatch.title}, Observations by Moth1`;
    } else {
      document.title = 'Observations by Moth1 | Interactive Visual Essays';
    }
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

        {/* Route /:slug and /issue/:id: Dynamically renders the matching dispatch */}
        <Route path="/:slug" element={<DynamicDispatchRoute />} />
        <Route path="/issue/:id" element={<DynamicDispatchRoute />} />

        {/* Fallback route *: Redirects to / */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
