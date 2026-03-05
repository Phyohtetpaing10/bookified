"use server";

import VoiceSession from "@/database/models/voice-session.model";
import { connectDB } from "@/database/mongoose";
import { getCurrentBillingPeriodStart } from "../subscription-constants";
import { EndSessionResult, StartSessionResult } from "@/types";

export const startVoiceSession = async (
  clerkId: string,
  bookId: string,
): Promise<StartSessionResult> => {
  try {
    await connectDB();

    const session = await VoiceSession.create({
      clerkId,
      bookId,
      startedAt: new Date(),
      durationSeconds: 0,
      billingPeriodStart: getCurrentBillingPeriodStart(),
    });

    return {
      success: true,
      sessionId: session._id.toString(),
    };
  } catch (error) {
    console.error("Error starting voice session", error);
    return {
      success: false,
      error: "Failed to start voice session. Please try again later",
    };
  }
};

export const endVoiceSession = async (
  sessionId: string,
  durationSeconds: number,
): Promise<EndSessionResult> => {
  try {
    await connectDB();

    const session = await VoiceSession.findByIdAndUpdate(
      sessionId,
      {
        endedAt: new Date(),
        durationSeconds,
      },
      { new: true },
    );

    if (!session) {
      return { success: false, error: "Session not found" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error ending voice session:", error);
    return {
      success: false,
      error: "Failed to end voice session. Please try again later",
    };
  }
};
