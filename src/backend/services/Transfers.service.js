import { transfersRepository } from "../repositories/Transfers.repository";

function normalizeError(error) {
  return {
    message: error?.message || "Unexpected error",
    status: error?.status ?? null,
  };
}

export const transfersService = {
  async getAll(filters) {
    try {
      return await transfersRepository.getAll(filters);
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async create(payload) {
    try {
      return await transfersRepository.create(payload);
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async getReceipt(id) {
    try {
      return await transfersRepository.getReceipt(id);
    } catch (error) {
      throw normalizeError(error);
    }
  },
};
