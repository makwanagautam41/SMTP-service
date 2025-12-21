import mongoose, { modelNames, mongo } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const EmailTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    templateId: {
      type: String,
      unique: true,
      index: true,
      default: uuidv4,
    },
    subject: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("EmailTemplate", EmailTemplateSchema);
