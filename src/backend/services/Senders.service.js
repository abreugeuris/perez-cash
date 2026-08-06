import { sendersRepository } from '@/backend/repositories/Senders.repository';

function normalizeError(error) {
  return {
    message: error?.message || "Unexpected error",
    status: error?.status ?? null,
  };
}

export const sendersService = {
  async getAll() {
    try {
      return await sendersRepository.getAll();
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async create(payload) {
    try {
      return await sendersRepository.create(payload);
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async update(id, payload) {
    try {
      return await sendersRepository.update(id, payload);
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async delete(id) {
    try {
      await sendersRepository.delete(id);
    } catch (error) {
      throw normalizeError(error);
    }
  },
};
