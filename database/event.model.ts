import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    mode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      required: [true, "Mode is required"],
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "Agenda must have at least one item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "Tags must have at least one item",
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

/**
 * Generates a URL-friendly slug from a string.
 * Converts to lowercase, replaces spaces with hyphens, removes special characters.
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
}

/**
 * Normalizes date string to ISO format (YYYY-MM-DD).
 * Throws error if date is invalid.
 */
function normalizeDate(dateStr: string): string {
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  return parsed.toISOString().split("T")[0];
}

/**
 * Normalizes time to 24-hour format (HH:MM).
 * Accepts various formats like "2:30 PM", "14:30", etc.
 */
function normalizeTime(timeStr: string): string {
  const trimmed = timeStr.trim().toUpperCase();

  // Check if already in 24-hour format
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = match24[1].padStart(2, "0");
    const minutes = match24[2];
    return `${hours}:${minutes}`;
  }

  // Parse 12-hour format (e.g., "2:30 PM")
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2];
    const period = match12[3];

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

  throw new Error(`Invalid time format: ${timeStr}`);
}

// Pre-save hook: generate slug, normalize date/time
EventSchema.pre("save", async function (next) {
  // Generate slug only if title is new or modified
  if (this.isModified("title")) {
    let slug = generateSlug(this.title);

    // Ensure slug uniqueness by appending a suffix if needed
    const Event = this.constructor as Model<IEvent>;
    let existingEvent = await Event.findOne({ slug, _id: { $ne: this._id } });
    let counter = 1;

    while (existingEvent) {
      slug = `${generateSlug(this.title)}-${counter}`;
      existingEvent = await Event.findOne({ slug, _id: { $ne: this._id } });
      counter++;
    }

    this.slug = slug;
  }

  // Normalize date to ISO format
  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }

  // Normalize time to 24-hour format
  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }

  next();
});

// Prevent model recompilation in development (Next.js hot reload)
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
