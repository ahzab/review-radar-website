import { getBusinessWithReviews } from "@/services/businessService";
import { format } from "date-fns";
import {notFound, redirect} from "next/navigation";
import Link from "next/link";
import ReviewStatistics from "@/components/review-statistics";
import {getReviewsForBusiness, getReviewStats} from "@/services/reviewService";
import {getUser} from "@/services/authService";
import {verifyBusinessAccess} from "@/lib/auth/business-access";


interface PageProps {
  params: {
    businessId: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function BusinessReviewsPage({ params, searchParams }: PageProps) {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const businessId = parseInt(params.businessId);
  // Verify access and get business data
  const { business, teamMember } = await verifyBusinessAccess(businessId,user.id);
  const selectedBusiness = await getBusinessWithReviews(parseInt(params.businessId));

  if (!business || !selectedBusiness) {
    notFound();
  }

  const page = searchParams.page ? parseInt(searchParams.page) : 1;




  const reviewStats = await getReviewStats(parseInt(params.businessId));


  const { reviews, totalPages, currentPage } = await getReviewsForBusiness(
    parseInt(params.businessId),
    page
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{selectedBusiness.name}</h1>
        <div className="text-sm text-muted-foreground">
          <span className="mr-4">Platform: {selectedBusiness.platform.name}</span>
          <a href={selectedBusiness.url} target="_blank" rel="noopener noreferrer"
             className="text-primary hover:underline">
            View Business Page →
          </a>
        </div>
      </div>

      {/* Add the statistics component here */}
      <ReviewStatistics stats={reviewStats} />

      <div className="grid gap-6 mb-8">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold">
                  {review.reviewerName || "Anonymous Reviewer"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(review.publishedAt), "MMMM d, yyyy")}
                </p>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700">{review.content}</p>
            {review.link && (
              <a
                href={review.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                View Original Review →
              </a>
            )}
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No reviews found for this business.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {currentPage > 1 && (
            <Link
              href={`/dashboard/businesses/${params.businessId}/reviews?page=${currentPage - 1}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Previous
            </Link>
          )}

          {[...Array(totalPages)].map((_, i) => (
            <Link
              key={i + 1}
              href={`/dashboard/businesses/${params.businessId}/reviews?page=${i + 1}`}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === i + 1
                  ? "bg-primary text-white"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </Link>
          ))}

          {currentPage < totalPages && (
            <Link
              href={`/dashboard/businesses/${params.businessId}/reviews?page=${currentPage + 1}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}