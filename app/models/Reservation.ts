import { Schema, model, models, Types, InferSchemaType, Model } from "mongoose";
export interface IReservation {
  userId: Types.ObjectId;
  date: Date;
  time: string;
  guests: number;
  notes?: string;
}

const reservationSchema = new Schema<IReservation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export type Reservation = InferSchemaType<typeof reservationSchema>;

const ReservationModel: Model<Reservation> =
  models.Reservation || model<Reservation>("Reservation", reservationSchema);

export default ReservationModel;