import { Router, type Request, type Response } from 'express';
import { A2ABus } from '../../protocols/a2a/A2ABus.js';

export function createA2UIRouter(): Router {
  const router = Router();
  const bus = A2ABus.getInstance();

  router.get('/conversations', (_req: Request, res: Response) => {
    const ids = bus.getAllConversationIds();
    res.json({ conversationIds: ids, total: ids.length });
  });

  router.get('/conversations/:id', (req: Request, res: Response) => {
    const messages = bus.getConversation(req.params.id);
    res.json({ conversationId: req.params.id, messages });
  });

  router.get('/capabilities', (_req: Request, res: Response) => {
    const query = (_req.query.capability as string) || '';
    const agents = query
      ? bus.findAgentsWithCapability(query)
      : [];
    res.json({ agents });
  });

  return router;
}
