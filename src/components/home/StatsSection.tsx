
import React from "react";

const StatsSection = () => {
  return (
    <section className="py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Trusted by Content Creators Worldwide</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="p-6 rounded-lg bg-card shadow-sm border">
            <p className="text-4xl md:text-5xl font-bold text-primary">10K+</p>
            <p className="text-muted-foreground mt-2">Articles Generated</p>
          </div>
          <div className="p-6 rounded-lg bg-card shadow-sm border">
            <p className="text-4xl md:text-5xl font-bold text-primary">2.5M+</p>
            <p className="text-muted-foreground mt-2">Words Created</p>
          </div>
          <div className="p-6 rounded-lg bg-card shadow-sm border">
            <p className="text-4xl md:text-5xl font-bold text-primary">98%</p>
            <p className="text-muted-foreground mt-2">Customer Satisfaction</p>
          </div>
          <div className="p-6 rounded-lg bg-card shadow-sm border">
            <p className="text-4xl md:text-5xl font-bold text-primary">3hr+</p>
            <p className="text-muted-foreground mt-2">Time Saved Per Article</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
