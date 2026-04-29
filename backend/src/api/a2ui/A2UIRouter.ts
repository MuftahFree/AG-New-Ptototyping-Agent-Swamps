import { Router, type Request, type Response } from 'express';
import { A2ABus } from '../../protocols/a2a/A2ABus.js';

export function createA2UIRouter(): Router {
  const router = Router();
  const bus = A2ABus.getInstance();

  router.get('/conversations', (req: Request, res: Response) => {
    const limit = Math.min(parseInt(String(req.query.limit ?? 50), 10), 200);
    const offset = Math.max(parseInt(String(req.query.offset ?? 0), 10), 0);
    const allIds = bus.getAllConversationIds();
    const page = allIds.slice(offset, offset + limit);
    res.json({ conversationIds: page, total: allIds.length, limit, offset });
  });

  router.get('/conversations/:id', (req: Request, res: Response) => {
    const allIds = bus.getAllConversationIds();
    const messages = bus.getConversation(req.params.id);
    if (!allIds.includes(req.params.id)) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }
    res.json({ conversationId: req.params.id, messages });
  });

  router.get('/capabilities', (req: Request, res: Response) => {
    const query = (req.query.capability as string) || '';
    const agents = query
      ? bus.findAgentsWithCapability(query)
      : [];
    res.json({ agents });
  });

  return router;
}

