import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const EmailTemplateSchema = new mongoose.Schema(
  {
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
    version: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("EmailTemplate", EmailTemplateSchema);
