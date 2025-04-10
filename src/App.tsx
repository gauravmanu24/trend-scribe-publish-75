
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import FeedsPage from "./pages/FeedsPage";
import ArticlesPage from "./pages/ArticlesPage";
import AIWriterPage from "./pages/AIWriterPage";
import WebStoryGeneratorPage from "./pages/WebStoryGeneratorPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import FeaturesPage from "./pages/FeaturesPage";
import AuthPage from "./pages/AuthPage";
import TitleGeneratorPage from "./pages/TitleGeneratorPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import React from "react";

// Move QueryClient creation inside the App component
const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes with Header and Footer */}
                <Route path="/" element={
                  <>
                    <Header />
                    <div className="min-h-[calc(100vh-64px)]">
                      <Index />
                    </div>
                    <Footer />
                  </>
                } />
                <Route path="/about" element={
                  <>
                    <Header />
                    <div className="min-h-[calc(100vh-64px)]">
                      <AboutUsPage />
                    </div>
                    <Footer />
                  </>
                } />
                <Route path="/contact" element={
                  <>
                    <Header />
                    <div className="min-h-[calc(100vh-64px)]">
                      <ContactUsPage />
                    </div>
                    <Footer />
                  </>
                } />
                <Route path="/privacy" element={
                  <>
                    <Header />
                    <div className="min-h-[calc(100vh-64px)]">
                      <PrivacyPolicyPage />
                    </div>
                    <Footer />
                  </>
                } />
                <Route path="/terms" element={
                  <>
                    <Header />
                    <div className="min-h-[calc(100vh-64px)]">
                      <TermsPage />
                    </div>
                    <Footer />
                  </>
                } />
                <Route path="/features" element={
                  <>
                    <Header />
                    <div className="min-h-[calc(100vh-64px)]">
                      <FeaturesPage />
                    </div>
                    <Footer />
                  </>
                } />
                <Route path="/auth" element={
                  <>
                    <Header />
                    <div className="min-h-[calc(100vh-64px)]">
                      <AuthPage />
                    </div>
                    <Footer />
                  </>
                } />

                {/* Protected Routes with Layout (includes its own header/footer) */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/feeds" element={<FeedsPage />} />
                  <Route path="/title-generator" element={<TitleGeneratorPage />} />
                  <Route path="/articles" element={<ArticlesPage />} />
                  <Route path="/ai-writer" element={<AIWriterPage />} />
                  <Route path="/web-stories" element={<WebStoryGeneratorPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
