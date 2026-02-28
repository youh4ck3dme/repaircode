import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import { LanguageProvider } from "./contexts/LanguageContext";

const Home = React.lazy(() => import("./pages/Home"));
const Services = React.lazy(() => import("./pages/Services"));
const Process = React.lazy(() => import("./pages/Process"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Audit = React.lazy(() => import("./pages/Audit"));
const LiveCodeOnline = React.lazy(() => import("./pages/LiveCodeOnline"));
const GitHubDashboard = React.lazy(() => import("./pages/GitHubDashboard"));
const SpaceCode = React.lazy(() => import("./pages/SpaceCode"));

const OfflineFallback = React.lazy(() => import("./pages/OfflineFallback"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                Loading...
              </div>
            }
          >
            <Home />
          </Suspense>
        ),
      },
      {
        path: "services",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                Loading...
              </div>
            }
          >
            <Services />
          </Suspense>
        ),
      },
      {
        path: "process",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                Loading...
              </div>
            }
          >
            <Process />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                Loading...
              </div>
            }
          >
            <About />
          </Suspense>
        ),
      },
      {
        path: "contact",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                Loading...
              </div>
            }
          >
            <Contact />
          </Suspense>
        ),
      },
      {
        path: "audit",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                Loading...
              </div>
            }
          >
            <Audit />
          </Suspense>
        ),
      },
      {
        path: "livecodeonline",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                Loading...
              </div>
            }
          >
            <LiveCodeOnline />
          </Suspense>
        ),
      },
      {
        path: "spacecode",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                Loading...
              </div>
            }
          >
            <SpaceCode />
          </Suspense>
        ),
      },
      {
        path: "github-dashboard",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                Loading...
              </div>
            }
          >
            <GitHubDashboard />
          </Suspense>
        ),
      },
      {
        path: "offline",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                Loading...
              </div>
            }
          >
            <OfflineFallback />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}

export default App;
