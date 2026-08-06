import { transfersRepository } from "../repositories/Transfers.repository";


function normalizeError(error) {
  return {
    message: error?.message || "Unexpected error",
    status: error?.status ?? null,
  };
}

export const transfersService = {
  async create(payload) {
    try {
      return await transfersRepository.create(payload);
    } catch (error) {
      throw normalizeError(error);
    }
  },
};
