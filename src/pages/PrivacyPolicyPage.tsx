
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            TrendScribe ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our service.
          </p>
          <p>
            By accessing or using TrendScribe, you consent to the data practices described in this privacy policy. 
            If you do not agree with the data practices described, you should not use TrendScribe.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
          <h3 className="text-lg font-medium mb-2">2.1 Personal Information</h3>
          <p className="mb-4">
            We may collect personal information that you voluntarily provide when using TrendScribe, including but not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Email address</li>
            <li>Name</li>
            <li>Account credentials for WordPress integration</li>
            <li>API keys for external services</li>
            <li>Billing information</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-2">2.2 Usage Information</h3>
          <p className="mb-4">
            We may also collect information about how TrendScribe is accessed and used. This usage data may include:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Your computer's IP address</li>
            <li>Browser type and version</li>
            <li>Pages of TrendScribe that you visit</li>
            <li>Time and date of your visit</li>
            <li>Time spent on those pages</li>
            <li>Content generation and publishing statistics</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We may use the information we collect from you for various purposes, including to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Provide, operate, and maintain TrendScribe</li>
            <li>Improve, personalize, and expand TrendScribe</li>
            <li>Understand and analyze how you use TrendScribe</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you for customer service, updates, and marketing purposes</li>
            <li>Process transactions</li>
            <li>Prevent fraudulent transactions and monitor against theft</li>
            <li>Debug issues and fix errors</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">4. Data Retention</h2>
          <p>
            We will retain your information for as long as your account is active or as needed to provide you with our services. 
            We will also retain and use your information as necessary to comply with our legal obligations, resolve disputes, 
            and enforce our agreements.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">5. Security</h2>
          <p className="mb-4">
            We use appropriate technical and organizational measures to protect your personal information. While we implement 
            safeguards, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
          </p>
          <p>
            We use SSL encryption for data transmission and follow industry standards for data storage security.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">6. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
            on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">7. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please contact us at privacy@trendscribe.com.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;
