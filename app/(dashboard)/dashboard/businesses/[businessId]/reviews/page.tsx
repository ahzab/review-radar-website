import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/services/authService";
import { MessageCircle, Star, ThumbsUp, Filter } from 'lucide-react';
import { ReviewCard } from "@/components/review-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getReviewsForBusiness, getReviewStats } from "@/services/reviewService";
import { verifyBusinessAccess } from "@/lib/auth/business-access";
import {getBusinessWithReviews} from "@/services/businessService";

interface PageProps {
  params: { businessId: string };
  searchParams: { page?: string };
}

export default async function ReviewsPage({ params, searchParams }: PageProps) {
  const user = await getUser();
  if (!user) redirect('/sign-in');

  const businessId = parseInt(params.businessId);

  // Verify access and get business data
  const { business, teamMember } = await verifyBusinessAccess(businessId,user.id);
  const selectedBusiness = await getBusinessWithReviews(parseInt(params.businessId));

  if (!business || !selectedBusiness) {
    notFound();
  }

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  
  // Fetch actual data
  const reviewStats = await getReviewStats(businessId);
  const { reviews, totalPages, currentPage } = await getReviewsForBusiness(businessId, page);

  // Calculate statistics
  const averageRating = typeof reviewStats.averageRating === 'number' 
    ? Number(reviewStats.averageRating.toFixed(1)) 
    : 0;

  const totalReviews = reviewStats.totalReviews || 0;

  const positiveReviewsCount = reviewStats.ratingDistribution
      .filter(r => r.rating > 3)
      .reduce((sum, r) => sum + r.count, 0);


  const positivePercentage = totalReviews > 0
    ? Math.round((positiveReviewsCount / totalReviews) * 100)
    : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-2xl" />
        
        {/* Main content container */}
        <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <span className="text-sm text-green-600">↑ 0.2</span>
              </div>
              <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {averageRating}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm text-green-600">↑ {totalReviews}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-500">Total Reviews</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalReviews.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm text-green-600">{positivePercentage}%</span>
              </div>
              <h3 className="text-sm font-medium text-gray-500">Positive Reviews</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {positivePercentage}%
              </p>
            </div>
          </div>

          {/* Filters Section */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Review List</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem>Newest First</DropdownMenuItem>
                  <DropdownMenuItem>Oldest First</DropdownMenuItem>
                  <DropdownMenuItem>Highest Rated</DropdownMenuItem>
                  <DropdownMenuItem>Lowest Rated</DropdownMenuItem>
                  <DropdownMenuItem>Needs Response</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Reviews List */}
          <div className="px-6 pb-6">
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl text-gray-500">
                  No reviews found.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Link
                    href={`/dashboard/businesses/${businessId}/reviews/?page=${currentPage - 1}`}
                    className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
                      currentPage <= 1 ? 'invisible' : ''
                    }`}
                  >
                    ←
                  </Link>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Link
                    href={`/dashboard/businesses/${businessId}/reviews?page=${currentPage + 1}`}
                    className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
                      currentPage >= totalPages ? 'invisible' : ''
                    }`}
                  >
                    →
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}