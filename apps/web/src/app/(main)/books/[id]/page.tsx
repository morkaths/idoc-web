import type { Metadata } from "next";
import { BookDetailView } from "./_components/view";
import { BookApi } from "@/apis";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const book = await BookApi.findById(params.id);
    if (!book) {
      return {
        title: "Sách không tồn tại",
      };
    }
    return {
      title: book.title,
      description: book.description,
      openGraph: {
        images: book.coverUrl ? [book.coverUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: "Chi tiết sách",
    };
  }
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  return <BookDetailView id={params.id} />;
}