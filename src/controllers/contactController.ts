import { Request, Response } from 'express';
import pool from '../db';

export const getContacts = async (_req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM contacts ORDER BY id DESC');
  res.json(result.rows);
};

export const addContact = async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO contacts (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [name, email, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
