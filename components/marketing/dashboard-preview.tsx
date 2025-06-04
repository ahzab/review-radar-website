import { Star, ThumbsUp, AlertCircle, TrendingUp, MessageCircle } from 'lucide-react';

export function DashboardPreview() {
  return (
    <div className="relative">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-red-50 to-orange-50 rounded-2xl" />
      
      {/* Main dashboard preview */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50">
        {/* Header */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Review Dashboard</h3>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">Live Monitoring</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard
              label="Average Rating"
              value="4.8"
              icon={Star}
              trend="+0.2"
              color="yellow"
            />
            <StatCard
              label="Total Reviews"
              value="2,847"
              icon={MessageCircle}
              trend="+124"
              color="blue"
            />
            <StatCard
              label="Response Rate"
              value="98%"
              icon={ThumbsUp}
              trend="+5%"
              color="green"
            />
          </div>

          {/* Recent Reviews */}
          <div className="space-y-4">
            <ReviewPreview
              platform="Yelp"
              rating={2}
              content="Service was below expectations. The staff seemed overwhelmed..."
              urgent
            />
            <ReviewPreview
              platform="Google"
              rating={5}
              content="Amazing experience! The team went above and beyond to help..."
            />
            <ReviewPreview
              platform="Trustpilot"
              rating={4}
              content="Good service overall, but there's room for improvement in..."
            />
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      <div className="absolute -right-4 top-20 bg-white rounded-lg shadow-lg border border-red-100 p-4 max-w-xs animate-pulse">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">New Negative Review</h4>
            <p className="text-sm text-gray-600">2-star review detected on Yelp</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  trend: string;
  color: 'yellow' | 'blue' | 'green';
}

function StatCard({ label, value, icon: Icon, trend, color }: StatCardProps) {
  const colors = {
    yellow: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600'
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        <div className="flex items-center text-sm text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          {trend}
        </div>
      </div>
    </div>
  );
}

interface ReviewPreviewProps {
  platform: string;
  rating: number;
  content: string;
  urgent?: boolean;
}

function ReviewPreview({ platform, rating, content, urgent }: ReviewPreviewProps) {
  return (
    <div className={`p-4 rounded-lg border ${
      urgent ? 'border-red-100 bg-red-50/50' : 'border-gray-100 bg-white'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">{platform}</span>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? 'text-yellow-400 fill-current' : 'text-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{content}</p>
    </div>
  );
}