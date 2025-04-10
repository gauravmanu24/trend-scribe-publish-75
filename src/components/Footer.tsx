
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-700 border-t border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-gray-500">
            © {currentYear} TrendScribe. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6">
            <Button 
              variant="link" 
              className="text-gray-500 p-0 h-auto text-sm"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <Button 
              variant="link" 
              className="text-gray-500 p-0 h-auto text-sm"
              onClick={() => navigate("/features")}
            >
              Tools & Features
            </Button>
            <Button 
              variant="link" 
              className="text-gray-500 p-0 h-auto text-sm"
              onClick={() => navigate("/about")}
            >
              About Us
            </Button>
            <Button 
              variant="link" 
              className="text-gray-500 p-0 h-auto text-sm"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/auth")} 
              className="text-xs rounded-sm"
            >
              Login
            </Button>
            <Button 
              size="sm" 
              onClick={() => navigate("/auth?tab=signup")} 
              className="text-xs rounded-sm bg-blue-600 hover:bg-blue-700"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
