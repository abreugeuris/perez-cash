import { beneficiariesService } from '@/backend/services/Beneficiaries.service'

export const beneficiariesController = {
  getAll:  ()           => beneficiariesService.getAll(),
  create:  (payload)    => beneficiariesService.create(payload),
  update:  (id, payload)=> beneficiariesService.update(id, payload),
  delete:  (id)         => beneficiariesService.delete(id),
}