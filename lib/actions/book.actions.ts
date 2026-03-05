"use server";

import { connectDB } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { escapeRegex, generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";
import mongoose from "mongoose";

export const getAllBooks = async () => {
  try {
    await connectDB();

    const books = await Book.find(
      {},
      { title: 1, author: 1, coverURL: 1, slug: 1, createdAt: 1 },
    )
      .sort({ createdAt: -1 })
      .limit(24)
      .lean();

    return {
      success: true,
      data: serializeData(books),
    };
  } catch (error) {
    console.error("Error getting all books", error);
    return {
      success: false,
      error: "Failed to get all books",
    };
  }
};

export const checkBookExists = async (title: string) => {
  try {
    await connectDB();

    const slug = generateSlug(title);

    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        exists: true,
        book: serializeData(existingBook),
      };
    }

    return {
      exists: false,
    };
  } catch (error) {
    console.error("Error checking book exists", error);
    return {
      exists: false,
      error: "Failed to check book exists",
    };
  }
};

export const createBook = async (data: CreateBook) => {
  try {
    await connectDB();

    const slug = generateSlug(data.title);

    const existingBook = await Book.findOne({ slug }).lean();
    if (existingBook) {
      return {
        success: true,
        data: serializeData(existingBook),
        alreadyExists: true,
      };
    }

    const book = await Book.create({
      ...data,
      slug,
      totalSegments: 0,
    });

    return {
      success: true,
      data: serializeData(book),
    };
  } catch (error) {
    console.error("Error creating book:", error);

    return {
      success: false,
      error: "Failed to create book",
    };
  }
};

export const getBookBySlug = async (slug: string) => {
  try {
    await connectDB();

    const book = await Book.findOne(
      { slug },
      { title: 1, author: 1, coverURL: 1, persona: 1, slug: 1 },
    ).lean();

    if (!book) {
      return { success: false, error: "Book not found" };
    }

    return { success: true, data: serializeData(book) };
  } catch (error) {
    console.error("Error getting book by slug", error);
    return { success: false, error: "Failed to get book" };
  }
};

export const saveBookSegments = async (
  bookId: string,
  clerkId: string,
  segments: TextSegment[],
) => {
  try {
    await connectDB();

    console.log("Saving book segments...");

    const segmentsToInsert = segments.map(
      ({ text, segmentIndex, pageNumber, wordCount }) => ({
        bookId,
        clerkId,
        content: text,
        segmentIndex,
        pageNumber,
        wordCount,
      }),
    );

    await BookSegment.insertMany(segmentsToInsert);

    await Book.findByIdAndUpdate(bookId, {
      totalSegments: segments.length,
    });

    console.log("Book segments saved successfully");

    return {
      success: true,
      data: { segmentsCreated: segments.length },
    };
  } catch (error) {
    console.log("Error saving book segments", error);

    await BookSegment.deleteMany({ bookId });
    await Book.findByIdAndDelete(bookId);
    console.log(
      "Deleted book segments and book due to failure to save segments.",
    );
    return {
      success: false,
      error: "Failed to save book segments",
    };
  }
};

export const searchBookSegments = async (
  bookId: string,
  query: string,
  limit: number = 5,
) => {
  try {
    await connectDB();

    console.log(`Searching for: "${query}" in book ${bookId}`);

    const bookObjectId = new mongoose.Types.ObjectId(bookId);

    // Try MongoDB text search first (requires text index)
    let segments: Record<string, unknown>[] = [];
    try {
      segments = await BookSegment.find({
        bookId: bookObjectId,
        $text: { $search: query },
      })
        .select("_id bookId content segmentIndex pageNumber wordCount")
        .sort({ score: { $meta: "textScore" } })
        .limit(limit)
        .lean();
    } catch {
      // Text index may not exist — fall through to regex fallback
      segments = [];
    }

    // Fallback: regex search matching ANY keyword
    if (segments.length === 0) {
      const keywords = query.split(/\s+/).filter((k) => k.length > 2);
      const pattern = keywords.map(escapeRegex).join("|");

      segments = await BookSegment.find({
        bookId: bookObjectId,
        content: { $regex: pattern, $options: "i" },
      })
        .select("_id bookId content segmentIndex pageNumber wordCount")
        .sort({ segmentIndex: 1 })
        .limit(limit)
        .lean();
    }

    console.log(`Search complete. Found ${segments.length} results`);

    return {
      success: true,
      data: serializeData(segments),
    };
  } catch (error) {
    console.error("Error searching segments:", error);
    return {
      success: false,
      error: (error as Error).message,
      data: [],
    };
  }
};
