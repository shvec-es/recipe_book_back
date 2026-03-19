import { Schema, model } from 'mongoose';
import { TAGS } from '../constans/tags.js';

// Створимо схему для документа нотатки
const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // прибирає пробіли на початку та в кінці
    },
    content: {
      type: String,
      required: false,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      required: false,
      default: 'Todo',
      enum: TAGS,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // встановлюємо зв’язок між колекціями: поле userId посилається на інший документ у колекції users
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Додаємо текстовий індекс: кажемо MongoDB,
// що по полям title та content можна робити $text
noteSchema.index(
  { title: 'text', content: 'text' },
  // не обовʼязково
  {
    name: 'NoteTextIndex',
    weights: { title: 5, content: 5 },
    default_language: 'english',
  },
);

// створимо модель нотатки
export const Note = model('Note', noteSchema);
