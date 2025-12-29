import BookGridItems from "@/components/book/book-grid-items";
import { useBooks } from "@/hooks/data/useBook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";

export default function BookTabs() {
    const { data: recommendedBooksData, isLoading, error } = useBooks();
    const recommendedBooks = recommendedBooksData?.data || [];
    return (
        <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="w-full flex justify-start bg-muted/40 rounded-lg mb-4">
                <TabsTrigger value="tags">Tags</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="credits">Credits</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="similar">Similar</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            <TabsContent value="tags">
                <div className="border border-dashed border-gray-600 rounded-xl p-8 text-center text-base text-gray-200 mt-4">
                    <div className="font-semibold mb-2">Be the first to leave your opinion!</div>
                    <div className="text-sm text-gray-400">Click here and share your experience.</div>
                </div>
            </TabsContent>

            <TabsContent value="reviews">
                <div className="border border-dashed border-gray-600 rounded-xl p-8 text-center text-base text-gray-200 mt-4">
                    <div className="font-semibold mb-2">Be the first to leave your opinion!</div>
                    <div className="text-sm text-gray-400">Click here and share your experience.</div>
                </div>
            </TabsContent>

            <TabsContent value="recommendations">
                <div className="mt-4">
                    <BookGridItems data={recommendedBooks} loading={isLoading} error={error?.message} />
                </div>
            </TabsContent>

            

        </Tabs>
    );
}