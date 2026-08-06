import { sendersService } from '@/backend/services/Senders.service';

export const sendersController = {
  getAll: () => sendersService.getAll(),
  create: (payload) => sendersService.create(payload),
  update: (id, payload) => sendersService.update(id, payload),
  delete: (id) => sendersService.delete(id),
};
