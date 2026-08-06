import { beneficiariesRepository } from '@/backend/repositories/Beneficiaries.repository'

function normalizeError(error) {
  return {
    message: error?.message || 'Unexpected error',
    status: error?.status ?? null,
  }
}

export const beneficiariesService = {
  async getAll() {
    try {
      return await beneficiariesRepository.getAll()
    } catch (error) {
      throw normalizeError(error)
    }
  },

  async create(payload) {
    try {
      return await beneficiariesRepository.create(payload)
    } catch (error) {
      throw normalizeError(error)
    }
  },

  async update(id, payload) {
    try {
      return await beneficiariesRepository.update(id, payload)
    } catch (error) {
      throw normalizeError(error)
    }
  },

  async delete(id) {
    try {
      await beneficiariesRepository.delete(id)
    } catch (error) {
      throw normalizeError(error)
    }
  },
}