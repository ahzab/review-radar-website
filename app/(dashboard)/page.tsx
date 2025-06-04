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