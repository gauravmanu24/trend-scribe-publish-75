
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";

const GoogleTrendsGenerator: React.FC<{ onUrlGenerated?: (url: string) => void }> = ({ onUrlGenerated }) => {
  const [country, setCountry] = useState("US");
  const [category, setCategory] = useState("");
  const [copied, setCopied] = useState(false);

  const countries = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "IN", name: "India" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "BR", name: "Brazil" },
    { code: "MX", name: "Mexico" },
  ];

  const categories = [
    { code: "", name: "All Categories" },
    { code: "b", name: "Business" },
    { code: "e", name: "Entertainment" },
    { code: "m", name: "Health" },
    { code: "t", name: "Science/Tech" },
    { code: "s", name: "Sports" },
    { code: "h", name: "Top Stories" },
  ];

  const generateUrl = () => {
    let url = `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${country}`;
    if (category) {
      url += `&cat=${category}`;
    }
    return url;
  };

  const handleCopy = () => {
    const url = generateUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    if (onUrlGenerated) {
      onUrlGenerated(url);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
      <h3 className="font-medium mb-2">Google Trends RSS Generator</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger id="country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="pt-2">
        <Label htmlFor="generated-url">Generated URL</Label>
        <div className="flex mt-1">
          <Input 
            id="generated-url"
            value={generateUrl()} 
            readOnly
            className="flex-1"
          />
          <Button 
            className="ml-2" 
            variant="secondary" 
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoogleTrendsGenerator;
