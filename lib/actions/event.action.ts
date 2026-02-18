"use server";
import { Event } from "@/database";
import dbConnect from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await dbConnect();
    const event = await Event.findOne({ slug });

    if (!event) return [];

    return JSON.parse(JSON.stringify(await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    })));
  } catch {
    return [];
  }
};