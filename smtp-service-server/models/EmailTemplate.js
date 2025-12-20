import mongoose from "mongoose";

const EmailTemplateSchema = new mongoose.Schema(
  {
    templateId: {
      type: String,
      unique: true,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("EmailTemplate", EmailTemplateSchema);
