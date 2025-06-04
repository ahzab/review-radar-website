import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Star,
  AlertCircle,
  MessageSquareText,
  BarChart3,
  Bell,
  Shield,
  Clock
} from 'lucide-react';
// First, add these new imports at the top
import { Check, HelpCircle } from 'lucide-react';
import {LogoCloud} from "@/components/marketing/logo-cloud";
import {TestimonialCard} from "@/components/marketing/testimonial-card";
import {DashboardPreview} from "@/components/marketing/dashboard-preview";

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center lg:text-left lg:col-span-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block text-gray-900">Never Miss Another</span>
                <span className="block text-red-600">Critical Review</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Instant alerts for negative reviews across all platforms. AI-powered responses to protect your reputation. Perfect for local businesses, SaaS companies, and service providers.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                <Button size="lg" className="text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  Watch Demo
                  <PlayIcon className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                14-day free trial · No credit card required
              </p>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <LogoCloud />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need to Manage Your Online Reputation
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              One dashboard for all your reviews, intelligent alerts, and AI-powered responses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={AlertCircle}
              title="Negative Review Alerts"
              description="Get instant notifications when negative reviews are posted, allowing you to respond quickly and effectively."
            />
            <FeatureCard
              icon={Star}
              title="Multi-Platform Monitoring"
              description="Track reviews across Yelp, Google, Capterra, G2, and other platforms from one dashboard."
            />
            <FeatureCard
              icon={MessageSquareText}
              title="AI-Generated Responses"
              description="Generate professional, personalized responses to reviews in seconds using advanced AI."
            />
            <FeatureCard
              icon={BarChart3}
              title="Review Analytics"
              description="Track your rating trends, sentiment analysis, and competitor comparisons."
            />
            <FeatureCard
              icon={Bell}
              title="Smart Notifications"
              description="Customize alerts based on rating thresholds, keywords, and sentiment."
            />
            <FeatureCard
              icon={Shield}
              title="Reputation Defense"
              description="Proactively protect your brand with early warning system for negative feedback."
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by Growing Businesses
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="ReviewRadar caught a negative review within minutes, allowing us to resolve the issue before it escalated."
              author="Sarah Chen"
              role="Owner, The Lotus Restaurant"
              rating={5}
            />
            <TestimonialCard
              quote="The AI responses save us hours every week. They're personalized and professional - our customers love them."
              author="Michael Roberts"
              role="CEO, SoftwareStack"
              rating={5}
            />
            <TestimonialCard
              quote="Finally, a tool that lets us monitor all our review platforms in one place. Game changer!"
              author="Lisa Thompson"
              role="Marketing Director, ServicePro"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How ReviewRadar Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Get started in minutes and take control of your online reputation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Platforms</h3>
              <p className="text-gray-600">Link your review profiles from multiple platforms in one dashboard</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Set Up Alerts</h3>
              <p className="text-gray-600">Customize your notification preferences for different types of reviews</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Respond & Analyze</h3>
              <p className="text-gray-600">Use AI to respond quickly and track your reputation metrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Choose the perfect plan for your business
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "49",
                description: "Perfect for small businesses",
                features: [
                  "Monitor up to 3 platforms",
                  "Basic review alerts",
                  "5 AI-powered responses per month",
                  "Basic analytics"
                ]
              },
              {
                name: "Professional",
                price: "99",
                description: "Most popular for growing businesses",
                features: [
                  "Monitor up to 10 platforms",
                  "Advanced review alerts",
                  "50 AI-powered responses per month",
                  "Advanced analytics",
                  "Competitor tracking",
                  "Priority support"
                ]
              },
              {
                name: "Enterprise",
                price: "299",
                description: "For large organizations",
                features: [
                  "Unlimited platform monitoring",
                  "Real-time alerts",
                  "Unlimited AI responses",
                  "Custom analytics",
                  "API access",
                  "Dedicated support"
                ]
              }
            ].map((plan) => (
              <div key={plan.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mt-2">{plan.description}</p>
                <div className="mt-4 mb-8">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-8" variant={plan.name === "Professional" ? "default" : "outline"}>
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to know about ReviewRadar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Which platforms do you monitor?",
                answer: "We monitor all major review platforms including Google, Yelp, TripAdvisor, Facebook, G2, Capterra, and more. Custom platform integration is available on Enterprise plans."
              },
              {
                question: "How quickly are alerts sent?",
                answer: "Our system checks for new reviews every 5 minutes. Alerts are sent instantly when negative reviews are detected."
              },
              {
                question: "Can I customize the AI responses?",
                answer: "Yes! You can set your brand voice, tone, and specific guidelines for the AI to follow when generating responses."
              },
              {
                question: "Is there a contract or commitment?",
                answer: "No, all our plans are month-to-month and you can cancel anytime. We also offer annual plans with a discount."
              }
            ].map((faq) => (
              <div key={faq.question} className="border-b border-gray-200 pb-6">
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{faq.question}</h3>
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Protecting Your Reputation Today
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using ReviewRadar to monitor and manage their online reputation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg text-white border-white hover:bg-white hover:text-gray-900">
              View Pricing
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-gray-400">
            <Feature text="14-day free trial" icon={Clock} />
            <Feature text="No credit card required" icon={Shield} />
            <Feature text="Cancel anytime" icon={ArrowRight} />
          </div>
        </div>
      </section>
    </main>
  );
}

// Add these additional components in separate files
function Feature({ text, icon: Icon }: { text: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5" />
      <span>{text}</span>
    </div>
  );
}

function PlayIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}