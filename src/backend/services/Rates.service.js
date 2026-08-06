import { ratesRepository } from "../repositories/RatesRepository.js";


function normalizeError(error) {
  return {
    message: error?.message || "Unexpected error",
    status: error?.status ?? null,
  };
}

export const ratesService = {
  async getAll() {
    try {
      return await ratesRepository.getAll();
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async create(payload) {
    try {
      return await ratesRepository.create(payload);
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async update(id, payload) {
    try {
      return await ratesRepository.update(id, payload);
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async toggleActive(id) {
    try {
      return await ratesRepository.toggleActive(id);
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async delete(id) {
    try {
      await ratesRepository.delete(id);
    } catch (error) {
      throw normalizeError(error);
    }
  },
};
