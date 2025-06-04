import { Shield, Zap, Bot, Bell, Star, Users, Clock, ArrowRight } from 'lucide-react';
import { checkoutAction } from '@/lib/payments/actions';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { Button } from '@/components/ui/button';

export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const basePlan = products.find((product) => product.name === 'Essential');
  const proPlan = products.find((product) => product.name === 'Pro');
  const enterprisePlan = products.find((product) => product.name === 'Enterprise');

  const basePrice = prices.find((price) => price.productId === basePlan?.id);
  const proPrice = prices.find((price) => price.productId === proPlan?.id);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Protect Your Business Reputation
          </h1>
          <p className="text-xl text-gray-600">
            Never miss another review. Get instant alerts and AI-powered responses to maintain your online reputation.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <PricingCard
            name="Essential"
            price={basePrice?.unitAmount || 2900}
            interval={basePrice?.interval || 'month'}
            description="Perfect for small businesses getting started with review management"
            features={[
              'Monitor up to 3 platforms',
              'Daily review scanning',
              'Email notifications',
              'Basic AI response templates',
              'Review analytics dashboard',
              '5 team members',
              'Email support'
            ]}
            priceId={basePrice?.id}
            icon={Shield}
          />

          <PricingCard
            name="Pro"
            price={proPrice?.unitAmount || 7900}
            interval={proPrice?.interval || 'month'}
            description="Advanced features for growing businesses"
            features={[
              'Monitor unlimited platforms',
              'Real-time review alerts',
              'Custom notification rules',
              'Advanced AI response generation',
              'Sentiment analysis',
              'Unlimited team members',
              'Priority support',
              'Review performance reports',
              'Custom branding'
            ]}
            priceId={proPrice?.id}
            icon={Zap}
            highlighted={true}
          />

          <PricingCard
            name="Enterprise"
            price={null}
            interval="month"
            description="Custom solutions for large organizations"
            features={[
              'Everything in Pro, plus:',
              'Custom API integration',
              'Dedicated account manager',
              'Custom AI training',
              'SLA guarantees',
              'Custom reporting',
              'Phone support',
              'Onboarding assistance'
            ]}
            icon={Bot}
            enterprise={true}
          />
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-12">Why Choose ReviewRadar?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Bell}
              title="Instant Alerts"
              description="Get notified immediately when new reviews are posted across any platform"
            />
            <FeatureCard
              icon={Star}
              title="AI-Powered Responses"
              description="Generate professional, personalized responses to reviews in seconds"
            />
            <FeatureCard
              icon={Clock}
              title="Time-Saving"
              description="Manage all your reviews from one dashboard, saving hours every week"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PricingCardProps {
  name: string;
  price: number | null;
  interval: string;
  description: string;
  features: string[];
  priceId?: string;
  icon: React.ElementType;
  highlighted?: boolean;
  enterprise?: boolean;
}

function PricingCard({
  name,
  price,
  interval,
  description,
  features,
  priceId,
  icon: Icon,
  highlighted,
  enterprise
}: PricingCardProps) {
  return (
    <div className={`rounded-2xl p-8 ${
      highlighted 
        ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-200 shadow-xl' 
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${
          highlighted ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <Icon className={`w-5 h-5 ${
            highlighted ? 'text-blue-600' : 'text-gray-600'
          }`} />
        </div>
        <h3 className="text-xl font-semibold">{name}</h3>
      </div>
      
      <p className="text-gray-600 mb-6">{description}</p>
      
      {price !== null ? (
        <div className="mb-6">
          <p className="text-4xl font-bold">
            ${price / 100}
            <span className="text-lg font-normal text-gray-600">
              /{interval}
            </span>
          </p>
        </div>
      ) : (
        <p className="text-2xl font-semibold mb-6">Custom Pricing</p>
      )}

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="mt-1 flex-shrink-0">
              <svg className={`w-5 h-5 ${
                highlighted ? 'text-blue-500' : 'text-green-500'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {enterprise ? (
        <Button className="w-full" variant="outline">
          Contact Sales
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <form action={checkoutAction}>
          <input type="hidden" name="priceId" value={priceId} />
          <Button className="w-full" variant={highlighted ? "default" : "outline"}>
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="text-center p-6">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}