import express, { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { readEvents, writeEvents, EventItem, DataFileError } from './fileEventStore';

const app = express();

// Обов'язково для парсингу JSON у POST запитах
app.use(express.json());

// GET /api/events-from-file
app.get('/api/events-from-file', async (req: Request, res: Response) => {
  try {
    const events = await readEvents();
    res.json(events);
  } catch (error) {
    // Логуємо технічні деталі в консоль сервера
    console.error('Помилка сервера при GET:', error);
    
    // Користувачеві повертаємо лише загальний статус без технічних деталей
    res.status(500).json({ error: 'Внутрішня помилка сервера при отриманні даних.' });
  }
});

// POST /api/events-from-file
app.post('/api/events-from-file', async (req: Request, res: Response) => {
  try {
    const { title, date } = req.body;

    // Валідація вхідних даних
    if (!title || !date) {
       res.status(400).json({ error: 'Поля title та date є обов’язковими' });
       return;
    }

    // 1. Читаємо наявні події
    const events = await readEvents();

    // 2. Створюємо нову подію
    const newEvent: EventItem = {
      id: randomUUID(),
      title,
      date
    };

    // 3. Додаємо до масиву та зберігаємо
    events.push(newEvent);
    await writeEvents(events);

    // 4. Повертаємо створену подію зі статусом 201
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Помилка сервера при POST:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера при збереженні даних.' });
  }
});

export default app;
