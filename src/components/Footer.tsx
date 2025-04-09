
import React from 'react';
import { Newspaper, Twitter, Facebook, Instagram, Github, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-news-950 text-news-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <Newspaper className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">TrendScribe</h2>
            </div>
            <p className="text-sm text-news-300">
              Revolutionize your content strategy with AI-powered content generation and management.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-news-300 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-news-300 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-news-300 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-news-300 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate("/")} className="text-news-300 hover:text-white transition-colors">Home</button>
              </li>
              <li>
                <button onClick={() => navigate("/features")} className="text-news-300 hover:text-white transition-colors">Features</button>
              </li>
              <li>
                <button onClick={() => navigate("/about")} className="text-news-300 hover:text-white transition-colors">About Us</button>
              </li>
              <li>
                <button onClick={() => navigate("/contact")} className="text-news-300 hover:text-white transition-colors">Contact Us</button>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate("/terms")} className="text-news-300 hover:text-white transition-colors">Terms & Conditions</button>
              </li>
              <li>
                <button onClick={() => navigate("/privacy")} className="text-news-300 hover:text-white transition-colors">Privacy Policy</button>
              </li>
              <li>
                <button className="text-news-300 hover:text-white transition-colors">Cookie Policy</button>
              </li>
              <li>
                <button className="text-news-300 hover:text-white transition-colors">GDPR Compliance</button>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Subscribe</h3>
            <p className="text-sm text-news-300">
              Stay updated with our latest news and features
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-news-900 border-news-700 text-white pl-10 w-full"
                />
              </div>
              <Button className="btn-gradient-primary whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-news-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-news-400 text-sm">
            © {currentYear} TrendScribe. All rights reserved.
          </p>
          <p className="text-news-400 text-sm mt-2 md:mt-0">
            Made with ♥ for content creators worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
