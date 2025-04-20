import { Request, Response } from 'express';
import pool from '../db';

export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM contacts LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM messages LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// ✅ New: Get 50 most recent conversations with pagination
export const getRecentConversations = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const searchValue = (req.query.searchValue as string) || '';
    const limit = 50;
    const offset = (page - 1) * limit;
  
    try {
      const result = await pool.query(
        `
        SELECT m.id, m.contact_id, m.body, m.sent_at, c.name, c.phone
        FROM (
          SELECT DISTINCT ON (contact_id) *
          FROM messages
          ORDER BY contact_id, sent_at DESC
        ) m
        JOIN contacts c ON m.contact_id = c.id
        WHERE 
          LOWER(m.body) LIKE LOWER($1)
          OR LOWER(c.name) LIKE LOWER($1)
          OR c.phone LIKE $1
        ORDER BY m.sent_at DESC
        LIMIT $2 OFFSET $3
      `,
        [`%${searchValue}%`, limit, offset]
      );
  
      res.json(result.rows);
    } catch (err) {
      console.error('Search query failed:', err);
      res.status(500).json({ error: 'Failed to search conversations' });
    }
  };
  