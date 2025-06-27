
import { Header } from "@/components/Header";

const Terms = () => {
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
            Terms of Service
          </h1>
          
          <p className="text-gray-600 mb-8">Effective Date: June 27, 2025</p>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>
              By accessing or using ReachFlow ("Service", "we", "our"), you agree to the following Terms of Service. If you do not agree, do not use our service.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Use of Service</h2>
              <p>You agree to use the Service only for lawful purposes and not to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Misuse the AI email generator for spam or harassment</li>
                <li>Copy, reverse engineer, or resell the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Account Responsibilities</h2>
              <p>You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Payment Terms</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Free tier available with limited features</li>
                <li>Paid plans charged monthly via Stripe</li>
                <li>No refunds except as required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Intellectual Property</h2>
              <p>All content, branding, and code is owned by ReachFlow. You may not reproduce or redistribute without permission.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Termination</h2>
              <p>We reserve the right to suspend or terminate accounts for any violation of these terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Disclaimer</h2>
              <p>The Service is provided "as is" without warranty. We do not guarantee that generated emails will result in leads, conversions, or replies.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p>We are not liable for indirect or consequential damages related to your use of the Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
              <p>We may update these terms at any time. Continued use of the Service means you accept the new terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
              <p>
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

export default Terms;
