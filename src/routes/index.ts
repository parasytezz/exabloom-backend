import { Router } from 'express';
import { getAllContacts, getAllMessages, getRecentConversations } from '../controllers/queryController';

const router = Router();

// Existing endpoints
router.get('/contacts', getAllContacts);
router.get('/messages', getAllMessages);

// New: Get 50 most recent conversations, with pagination
router.get('/conversations', getRecentConversations);

export default router;
