import { BookGridItems } from "@/components/book/book-grid-items";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { ReactNode } from "react";
import { Book } from "@/types";
import { formatDate } from "@/utils/date";
import { RecommendedBooks } from "./recommended-books";

interface TabItem {
    name: string;
    value: string;
    content: ReactNode;
}

export function BookTabs({ book }: { book?: Book }) {
    const tabs: TabItem[] = [
        {
            name: 'Info',
            value: 'info',
            content: (
                <div className="bg-card/30 rounded-xl p-6 mt-4 border border-gray-100 dark:border-zinc-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-2 mb-2">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Description</div>
                            <div className="text-sm leading-relaxed text-muted-foreground">{book?.description || 'No description available'}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Language</div>
                            <div className="text-sm font-medium">{book?.language || 'N/A'}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pages</div>
                            <div className="text-sm font-medium">{book?.pages || 'N/A'} pages</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Format</div>
                            <div className="text-sm font-medium">{book?.fileKey?.split('.').pop()?.toUpperCase() || 'N/A'}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Publisher</div>
                            <div className="text-sm font-medium">{book?.publisher || 'N/A'}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Published Date</div>
                            <div className="text-sm font-medium">{book?.publishedDate ? formatDate(book.publishedDate) : 'N/A'}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">ISBN</div>
                            <div className="text-sm font-medium">{book?.isbn || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            name: 'Reviews',
            value: 'reviews',
            content: (
                <div className="border border-dashed border-gray-600 rounded-xl p-8 text-center text-base text-gray-200 mt-4">
                    <div className="font-semibold mb-2">Be the first to share your thoughts!</div>
                    <div className="text-sm text-gray-400">Click here to share your experience.</div>
                </div>
            )
        },
        {
            name: 'Recommendations',
            value: 'recommendations',
            content: <RecommendedBooks />
        },
        {
            name: 'Tags',
            value: 'tags',
            content: (
                <div className="border border-dashed border-gray-600 rounded-xl p-8 text-center text-base text-gray-200 mt-4">
                    <div className="font-semibold mb-2">No tags available</div>
                    <div className="text-sm text-gray-400">Tags help categorize and find books more easily.</div>
                </div>
            )
        },
        { name: 'Credits', value: 'credits', content: null },
        { name: 'Similar', value: 'similar', content: null },
        { name: 'Images', value: 'images', content: null },
        { name: 'Videos', value: 'videos', content: null },
    ];

    return (
        <Tabs defaultValue="info" className="w-full gap-4">
            <TabsList className="bg-background gap-1 border p-1 w-fit mx-auto flex justify-center">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground dark:data-[state=active]:border-transparent px-4 py-2"
                    >
                        {tab.name}
                    </TabsTrigger>
                ))}
            </TabsList>

            {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
}
