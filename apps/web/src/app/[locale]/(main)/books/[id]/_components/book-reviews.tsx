'use client';

import { useState } from 'react';
import { Star, MessageSquare, Loader2, User as UserIcon } from 'lucide-react';
import { useReviews } from '@/hooks/data/useReview';
import { Avatar, AvatarFallback } from '@repo/ui/components/avatar';
import { formatDate } from '@/utils/date';
import { Pagination } from '@/components/pagination';

interface BookReviewsProps {
    bookId?: string;
    rating?: number;
    totalReviews?: number;
}

export function BookReviews({ bookId, rating = 0, totalReviews = 0 }: BookReviewsProps) {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useReviews({ itemId: bookId, page }, { enabled: !!bookId });
    const reviews = data?.data || [];
    const pagination = data?.pagination;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="space-y-8 mt-4">
            {/* Tóm tắt */}
            <div className="grid gap-8 md:grid-cols-[250px_1fr]">
                <div className="space-y-6">
                    <div className="bg-card rounded-xl p-6 border text-center space-y-2 h-fit sticky top-4">
                        <div className="text-5xl font-bold tracking-tighter text-foreground">{rating?.toFixed(1) || 0}</div>
                        <div className="flex justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= Math.round(rating || 0) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
                                />
                            ))}
                        </div>
                        <div className="text-sm text-muted-foreground pt-1">Based on {totalReviews || 0} reviews</div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Danh sách đánh giá */}
                    {(isLoading) ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (isError) ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-destructive/5 border-destructive/20 text-destructive">
                            <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
                            <p className="text-lg font-medium">Không thể tải đánh giá</p>
                            <p className="text-sm opacity-80">Vui lòng thử lại sau</p>
                        </div>
                    ) : (reviews.length > 0) ? (
                        <div className="space-y-4">
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="bg-card rounded-xl p-6 border shadow-sm space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback><UserIcon className="h-5 w-5" /></AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-sm">
                                                        {review.user?.username || review.user?.email || 'User'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-sm leading-relaxed text-muted-foreground">
                                            {review.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {pagination && (
                                <Pagination pagination={pagination} onPageChange={handlePageChange} />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                            <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                            <p className="text-lg font-medium">No reviews yet</p>
                            <p className="text-sm">Be the first to share your creative thoughts</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
