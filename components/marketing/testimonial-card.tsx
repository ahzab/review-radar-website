import { Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
  image?: string;
}

export function TestimonialCard({ quote, author, role, rating, image }: TestimonialCardProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-200'
            }`}
          />
        ))}
      </div>
      
      <blockquote className="text-lg text-gray-700 mb-6">
        "{quote}"
      </blockquote>
      
      <div className="flex items-center gap-4">
        {image ? (
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <img
              src={image}
              alt={author}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
            <span className="text-red-700 font-medium text-lg">
              {author[0]}
            </span>
          </div>
        )}
        
        <div>
          <div className="font-medium text-gray-900">{author}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
    </div>
  );
}