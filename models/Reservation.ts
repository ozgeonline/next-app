import { Schema, model, models, InferSchemaType, Model } from "mongoose";
import { SavedReservation } from "@/types/reservationTypes";

const reservationSchema = new Schema<SavedReservation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true, min: 1, max: 20 },
    notes: { type: String, maxlength: 500 },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
      index: true,
    },
    editCount: { type: Number, default: 0, min: 0, max: 2 },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

reservationSchema.index({ userId: 1, status: 1, date: 1, time: 1 });

export type Reservation = InferSchemaType<typeof reservationSchema>;

const ReservationModel: Model<Reservation> =
  models.Reservation || model<Reservation>("Reservation", reservationSchema);

export default ReservationModel;
