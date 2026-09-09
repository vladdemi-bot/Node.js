import { promises as fs } from 'fs';
import * as path from 'path';

export interface EventItem {
  id: string;
  title: string;
  date: string;
}

export class DataFileError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'DataFileError';
  }
}

const DATA_DIR = path.join(__dirname, '../data');
const FILE_PATH = path.join(DATA_DIR, 'events.json');
const TEMP_FILE_PATH = path.join(DATA_DIR, 'events.tmp.json');

export async function readEvents(): Promise<EventItem[]> {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data) as EventItem[];
  } catch (error: any) {
    throw new DataFileError('Не вдалося прочитати дані з файлу конфігурації подій', error);
  }
}

export async function writeEvents(events: EventItem[]): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    const jsonString = JSON.stringify(events, null, 2);
    await fs.writeFile(TEMP_FILE_PATH, jsonString, 'utf-8');
    await fs.rename(TEMP_FILE_PATH, FILE_PATH);
  } catch (error: any) {
    throw new DataFileError('Не вдалося зберегти оновлені дані у файл', error);
  }
}
