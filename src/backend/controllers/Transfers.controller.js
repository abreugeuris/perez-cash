import { transfersService } from "../services/Transfers.service";

export const transfersController = {
  getAll: (filters) => transfersService.getAll(filters),
  create: (payload) => transfersService.create(payload),
  getReceipt: (id) => transfersService.getReceipt(id),
};
