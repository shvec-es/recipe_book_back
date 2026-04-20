import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

// Автоматичне очищення застарілих сесій
sessionSchema.index({ refreshTokenValidUntil: 1 }, { expireAfterSeconds: 0 });

export const Session = model('Session', sessionSchema);
