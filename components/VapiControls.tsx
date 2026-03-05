"use client";

import { IBook } from "@/types";
import { Mic, MicOff } from "lucide-react";
import useVapi from "@/hooks/useVapi";
import Image from "next/image";
import Transcript from "@/components/Transcript";

const VapiControls = ({ book }: { book: IBook }) => {
  const {
    isActive,
    status,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    limitError,
    start,
    stop,
    clearErrors,
  } = useVapi(book);
  return (
    <>
      <div className="max-w-4xl mx-auto flex flex-col gap-5">
        {/* ── 1. Header card ── */}
        <div className="vapi-header-card">
          {/* Cover + mic button */}
          <div className="vapi-cover-wrapper">
            <Image
              src={book.coverURL}
              alt={`${book.title} cover`}
              width={120}
              height={180}
              className="vapi-cover-image w-[120px]! h-[180px]!"
              priority
            />

            {/* Mic button overlapping bottom-right of cover */}
            <div className="vapi-mic-wrapper">
              <div className="relative inline-flex items-center justify-center">
                {/* Pulsating ring — visible only when AI is speaking or thinking */}
                {(status === "speaking" || status === "thinking") && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                )}
                <button
                  onClick={isActive ? stop : start}
                  disabled={status === "connecting"}
                  className="vapi-mic-btn relative"
                  aria-label={
                    isActive ? "Stop voice session" : "Start voice session"
                  }
                  type="button"
                >
                  {isActive ? (
                    <Mic className="w-6 h-6 text-(--text-primary)" />
                  ) : (
                    <MicOff className="w-6 h-6 text-(--text-primary)" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Book info + status pills */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            {/* Title & author */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) leading-tight font-serif line-clamp-3">
                {book.title}
              </h1>
              <p className="mt-1 text-base text-(--text-secondary) font-medium">
                by {book.author}
              </p>
            </div>

            {/* Status pill row */}
            <div className="flex flex-wrap gap-2">
              {/* Ready indicator */}
              <span className="vapi-status-indicator">
                <span className="vapi-status-dot vapi-status-dot-ready" />
                <span className="vapi-status-text">Ready</span>
              </span>

              {/* Voice / persona pill */}
              <span className="vapi-status-indicator">
                <span className="vapi-status-text">
                  Voice:{" "}
                  <span className="font-semibold">
                    {book.persona ?? "Default"}
                  </span>
                </span>
              </span>

              {/* Timer pill */}
              <span className="vapi-status-indicator">
                <span className="vapi-status-text">0:00 / 15:00</span>
              </span>
            </div>
          </div>
        </div>

        <div className="vapi-transcript-wrapper">
          <Transcript
            messages={messages}
            currentMessage={currentMessage}
            currentUserMessage={currentUserMessage}
          />
        </div>
      </div>
    </>
  );
};

export default VapiControls;
