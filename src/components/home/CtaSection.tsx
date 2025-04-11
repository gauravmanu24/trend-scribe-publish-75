
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const CtaSection = () => {
  const { user } = useAuth();

  return (
    <section className="py-20 px-6 md:px-10 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Automate Your Content Creation?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Start publishing high-quality, SEO-optimized content consistently with minimal effort.
        </p>
        {user ? (
          <Button size="lg" className="px-8" asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <Button size="lg" className="px-8" asChild>
            <Link to="/auth">Get Started Now</Link>
          </Button>
        )}
        <p className="mt-12 attribution">
          © {new Date().getFullYear()} All Rights Reserved. This lovely tool developed by <span className="attribution-name">Gaurav Srivastava</span>
        </p>
      </div>
    </section>
  );
};

export default CtaSection;
