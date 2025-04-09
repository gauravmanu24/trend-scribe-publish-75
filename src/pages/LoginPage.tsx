
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2, User, Lock, Github, Globe, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"login" | "signup">(
    location.pathname === "/signup" ? "signup" : "login"
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // Check for verification token in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const verificationToken = queryParams.get("verify");
    const email = queryParams.get("email");
    
    if (verificationToken && email) {
      handleVerifyEmail(email, verificationToken);
    }
  }, [location.search]);
  
  const handleVerifyEmail = async (email: string, token: string) => {
    setIsVerifyingEmail(true);
    
    try {
      // In a real app, this would make an API call to verify the token
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful verification
      setIsVerified(true);
      toast({
        title: "Email verified",
        description: "Your email has been verified successfully. You can now log in.",
      });
      
      // Auto-fill the login form with the email
      setLoginEmail(email);
      setActiveTab("login");
      
    } catch (error) {
      setError("Email verification failed. The link may be expired or invalid.");
    } finally {
      setIsVerifyingEmail(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      setError("Please enter both email and password.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call to authenticate the user
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful login
      localStorage.setItem('auth', JSON.stringify({ 
        isLoggedIn: true, 
        profile: { 
          name: 'John Doe', 
          email: loginEmail 
        } 
      }));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupEmail || !signupPassword || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (signupPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call to create a user account
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful signup and verification email
      setIsSendingVerification(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
      
      setActiveTab("login");
      setLoginEmail(signupEmail);
      
      // Clear signup form
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
      
    } catch (error) {
      setError("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
      setIsSendingVerification(false);
    }
  };

  if (isVerifyingEmail) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Verifying Email</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="mt-4">Please wait, we are verifying your email address...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isVerified) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-green-500">Email Verified!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <p>Your email has been successfully verified.</p>
            <p className="mt-2 text-muted-foreground">You can now log in to your account.</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full btn-gradient-primary"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {activeTab === "login" ? "Login to your account" : "Create an account"}
          </CardTitle>
          <CardDescription className="text-center">
            {activeTab === "login" 
              ? "Enter your credentials to access your account" 
              : "Fill in your details to create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")}>
            <TabsList className="grid grid-cols-2 w-full mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button 
                      type="button" 
                      variant="link" 
                      size="sm"
                      className="text-sm text-primary"
                      onClick={() => toast({
                        title: "Password reset",
                        description: "If your email exists in our system, you will receive a password reset link.",
                      })}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                
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
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
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
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input 
                      id="first-name"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input 
                      id="last-name"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full btn-gradient-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isSendingVerification ? "Sending verification email..." : "Creating account..."}
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
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
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary"
              onClick={() => navigate("/terms")}
            >
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary"
              onClick={() => navigate("/privacy")}
            >
              Privacy Policy
            </Button>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
