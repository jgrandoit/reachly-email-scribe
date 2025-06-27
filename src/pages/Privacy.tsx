
import { Header } from "@/components/Header";

const Privacy = () => {
  const handleGetStarted = () => {
    window.location.href = "/auth";
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header 
        onGetStarted={handleGetStarted}
        onBackToHome={handleBackToHome}
        currentView="home"
      />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Privacy Policy
          </h1>
          
          <p className="text-gray-600 mb-8">Effective Date: June 27, 2025</p>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>
              ReachFlow ("we", "our", or "us") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, including any related services, tools, and features (collectively, the "Service").
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Information:</strong> When you create an account, we may collect your name, email address, and payment information.</li>
                <li><strong>Usage Data:</strong> We collect data on how you use the Service (e.g., number of emails generated, IP address, device type).</li>
                <li><strong>Cookies:</strong> We use cookies and similar technologies to enhance your experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To process payments via Stripe</li>
                <li>To improve and personalize user experience</li>
                <li>To communicate with you (e.g., updates, promotions)</li>
                <li>To monitor usage for abuse or fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Sharing of Information</h2>
              <p>We do <strong>not</strong> sell your personal data. We may share data with:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Service providers (e.g., Stripe, OpenAI) under strict data protection agreements</li>
                <li>Legal authorities if required to comply with applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p>We implement security measures to protect your data, including encryption and secure servers.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
              <p>You can:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Access or update your personal info via your account</li>
                <li>Request deletion of your account</li>
                <li>Opt out of promotional emails</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Children's Privacy</h2>
              <p>Our service is not intended for individuals under the age of 13. We do not knowingly collect data from children.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Changes to This Policy</h2>
              <p>We may update this policy and will notify users via email or in-app message.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
              <p>
                If you have any questions, contact us at:{" "}
                <a href="mailto:support@reachflow.ai" className="text-blue-600 hover:text-blue-700 underline">
                  support@reachflow.ai
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
