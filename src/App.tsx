
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Protected Routes */}
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
