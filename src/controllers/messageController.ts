import { Request, Response } from 'express';
import pool from '../db';

export const getMessages = async (_req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM messages ORDER BY id DESC');
  res.json(result.rows);
};

export const addMessage = async (req: Request, res: Response) => {
  const { contact_id, body } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO messages (contact_id, body) VALUES ($1, $2) RETURNING *',
      [contact_id, body]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
