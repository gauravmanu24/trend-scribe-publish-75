import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2, User, Lock, Github, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration form state
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here would be the actual login logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Login successful",
        description: "Welcome back to TrendScribe!",
      });
      
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!regEmail || !regPassword || !regConfirmPassword || !regName) {
      setError("Please fill in all fields");
      return;
    }
    
    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (regPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here would be the actual registration logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. Welcome to TrendScribe!",
      });
      
      navigate("/dashboard");
    } catch (error) {
      setError("Registration failed. This email may already be in use.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <User className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TrendScribe
          </h1>
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          {activeTab === "login" ? "Welcome Back!" : "Create Your Account"}
        </h2>
      </div>
      
      <Card className="w-full max-w-md trendy-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {activeTab === "login" ? "Login" : "Sign Up"}
          </CardTitle>
          <CardDescription className="text-center">
            {activeTab === "login" 
              ? "Enter your email and password to access your account" 
              : "Fill in your details to create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="your@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a 
                      href="#" 
                      className="text-sm text-primary hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        toast({
                          description: "Password reset functionality would be implemented here",
                        });
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="password"
                      type="password" 
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full btn-gradient-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">
                  <Github className="mr-2 h-4 w-4" />
                  Github
                </Button>
                <Button variant="outline">
                  <Globe className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4 pt-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full Name</Label>
                  <Input 
                    id="reg-name"
                    placeholder="John Doe"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email Address</Label>
                  <Input 
                    id="reg-email"
                    type="email" 
                    placeholder="your@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input 
                    id="reg-password"
                    type="password" 
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                  <Input 
                    id="reg-confirm-password"
                    type="password" 
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full btn-gradient-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">
                  <Github className="mr-2 h-4 w-4" />
                  Github
                </Button>
                <Button variant="outline">
                  <Globe className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            By continuing, you agree to our{" "}
            <a 
              href="/terms" 
              className="text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/terms");
              }}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a 
              href="/privacy" 
              className="text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/privacy");
              }}
            >
              Privacy Policy
            </a>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
