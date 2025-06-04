'use client';

import { format } from "date-fns";
import { MessageSquarePlus, ExternalLink, ThumbsUp, Flag, Share2, MoreHorizontal, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {AiReplyButton} from "@/components/ai-reply-button";

interface ReviewCardProps {
    review: {
        id: number;
        reviewerName: string | null;
        content: string;
        rating: number;
        publishedAt: Date;
        link?: string | null;
    };
}

export function ReviewCard({ review }: ReviewCardProps) {

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md border border-gray-100">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center ring-2 ring-orange-50">
                        <span className="text-orange-700 font-medium">
                            {review.reviewerName?.[0] || 'A'}
                        </span>
                    </div>

                    <div>
                        <div className="flex items-center gap-3">
                            <p className="font-medium text-gray-900">
                                {review.reviewerName || "Anonymous Reviewer"}
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            {format(new Date(review.publishedAt), "MMMM d, yyyy")}
                            {review.link && (
                                <a
                                    href={review.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-primary hover:text-primary/80 transition-colors gap-1"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    <span className="text-xs">Original</span>
                                </a>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 bg-yellow-50 px-2 py-1 rounded-md">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${
                                    i < review.rating ? "text-yellow-400" : "text-gray-200"
                                } fill-current`}
                            />
                        ))}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem>
                                <Flag className="h-4 w-4 mr-2" />
                                Flag Review
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="prose prose-sm max-w-none text-gray-600 mb-4">
                {review.content}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <AiReplyButton
                    reviewContent={review.content}
                    rating={review.rating}
                />
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                >
                    <MessageSquarePlus className="h-4 w-4 mr-2" />
                    Reply
                </Button>
            </div>
        </div>
    );
}
