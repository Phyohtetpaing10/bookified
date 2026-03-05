import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MicOff, ArrowLeft } from "lucide-react";
import { getBookBySlug } from "@/lib/actions/book.actions";
import VapiControls from "@/components/VapiControls";

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

const BookPage = async ({ params }: BookPageProps) => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { slug } = await params;
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) redirect("/");

  const book = result.data;

  return (
    <div className="book-page-container">
      {/* Floating back button */}
      <Link href="/" className="back-btn-floating" aria-label="Back to library">
        <ArrowLeft className="w-5 h-5 text-(--text-primary)" />
      </Link>
      {/* ── 2. Transcript area ── */}
      <VapiControls book={book} />
    </div>
  );
};

export default BookPage;
