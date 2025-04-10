
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  return (
    <footer className="bg-gray-100 text-gray-700 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">TrendScribe</h3>
            <p className="text-sm text-gray-600 mb-4">
              Cutting-edge AI-powered content creation platform for bloggers, marketers, and content professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-500 p-0 h-auto text-sm"
                  onClick={() => navigate("/")}
                >
                  Home
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-500 p-0 h-auto text-sm"
                  onClick={() => navigate("/features")}
                >
                  Features
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-500 p-0 h-auto text-sm"
                  onClick={() => navigate("/about")}
                >
                  About Us
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-500 p-0 h-auto text-sm"
                  onClick={() => navigate("/contact")}
                >
                  Contact
                </Button>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Tools</h3>
            <ul className="space-y-2">
              {user ? (
                <>
                  <li>
                    <Button 
                      variant="link" 
                      className="text-gray-500 p-0 h-auto text-sm"
                      onClick={() => navigate("/ai-writer")}
                    >
                      AI Writer
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="link" 
                      className="text-gray-500 p-0 h-auto text-sm"
                      onClick={() => navigate("/title-generator")}
                    >
                      Title Generator
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="link" 
                      className="text-gray-500 p-0 h-auto text-sm"
                      onClick={() => navigate("/web-story-generator")}
                    >
                      Web Story Generator
                    </Button>
                  </li>
                </>
              ) : (
                <li>
                  <p className="text-sm text-gray-500">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-blue-600"
                      onClick={() => navigate("/auth")}
                    >
                      Login
                    </Button>{' '}
                    to access our premium tools
                  </p>
                </li>
              )}
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-500 p-0 h-auto text-sm"
                  onClick={() => navigate("/terms")}
                >
                  Terms of Service
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-gray-500 p-0 h-auto text-sm"
                  onClick={() => navigate("/privacy")}
                >
                  Privacy Policy
                </Button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} TrendScribe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
