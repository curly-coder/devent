import mongoose, { Schema, Document, Model, Types } from "mongoose";

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Email validation regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true, // Index for faster queries on eventId
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => EMAIL_REGEX.test(email),
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook: validate that referenced event exists
BookingSchema.pre("save", async function () {
  if (this.isModified("eventId")) {
    const Event: Model<Document> =
      mongoose.models.Event || (await import("./event.model")).default;

    const eventExists = await Event.findById(this.eventId);

    if (!eventExists) {
      throw new Error(`Event with ID ${this.eventId} does not exist`);
    }
  }
});


// Prevent model recompilation in development (Next.js hot reload)
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
