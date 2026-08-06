import { transfersService } from "../services/Transfers.service";


export const transfersController = {
  create: (payload) => transfersService.create(payload),
}