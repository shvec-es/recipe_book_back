import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// Отримати список усіх нотаток
// по конспекту
// export const getNotes = async (req, res) => {
//   // Отримуємо параметри пагінації
//   const { page = 1, perPage = 10, tag, search } = req.query;

//   const skip = (page - 1) * perPage;

//   // Створюємо базовий запит до колекції
//   const notesQuery = Note.find();

//   // Текстовий пошук по name (працює лише якщо створено текстовий індекс)
//   if (search) {
//     notesQuery.where({ $text: { $search: search } });
//   }

//   // Будуємо фільтр
//   if (tag) {
//     notesQuery.where('tag').equals(tag);
//   }

//   // Виконуємо одразу два запити паралельно
//   const [totalNotes, notes] = await Promise.all([
//     notesQuery.clone().countDocuments(),
//     notesQuery
//       .skip(skip)
//       .limit(perPage)
//       // Додамєдо сортування в ланцюжок методів квері
//       .sort({ createdAt: -1 }),
//   ]);

//   // Обчислюємо загальну кількість «сторінок»
//   const totalPages = Math.ceil(totalNotes / perPage);

//   res.status(200).json({
//     page,
//     perPage,
//     totalNotes,
//     totalPages,
//     notes,
//   });
// };

// Отримати список усіх нотаток
// краща практика
export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const skip = (page - 1) * perPage;

    // додаємо фільтра одним обʼєктом
    const filter = {};
    if (tag) {
      filter.tag = tag;
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const [totalNotes, notes] = await Promise.all([
      // не робимо копію запиту
      Note.countDocuments(filter),
      Note.find(filter).skip(skip).limit(perPage).sort({ createdAt: -1 }),
    ]);

    // Обчислюємо загальну кількість «сторінок»
    const totalPages = Math.ceil(totalNotes / perPage);

    res.status(200).json({
      notes,
      totalNotes,
      page,
      perPage,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
};

// Отримати одну нотатку за id
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

// Створити нову нотатку
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

//Видалити одну нотатку по id
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findOneAndDelete({
      _id: noteId,
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

// Частково оновити дані нотатки по id
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndUpdate(
      { _id: noteId }, // Шукаємо по id
      req.body,
      { returnDocument: 'after' }, // повертаємо оновлений документ
    );

    if (!note) {
      throw createHttpError(404, 'Student not found');
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};
