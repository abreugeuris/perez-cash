import { ratesService } from '../services/Rates.service'

export const ratesController = {
  getAll:       ()            => ratesService.getAll(),
  create:       (payload)     => ratesService.create(payload),
  update:       (id, payload) => ratesService.update(id, payload),
  toggleActive: (id)          => ratesService.toggleActive(id),
  delete:       (id)          => ratesService.delete(id),
}