import BookCard from "@/components/BookCard";
import HeroSection from "@/components/HeroSection";
import Search from "@/components/Search";
import { getAllBooks } from "@/lib/actions/book.actions";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ query?: string }>;
}

const Page = async ({ searchParams }: Props) => {
  const { query } = await searchParams;
  const bookResults = await getAllBooks(query);
  const books = bookResults.success ? (bookResults.data ?? []) : [];

  return (
    <main className="wrapper container">
      <HeroSection />

      <div className="library-filter-bar">
        <h2 className="section-title">Recent Books</h2>
        <Search />
      </div>

      <div className="library-books-grid">
        {books.map((book) => (
          <BookCard
            key={book._id}
            title={book.title}
            author={book.author}
            coverURL={book.coverURL}
            slug={book.slug}
          />
        ))}
      </div>
    </main>
  );
};

export default Page;
