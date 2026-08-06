import { supabase } from '@/lib/supabaseClient';


export const transfersRepository = {
  async create(payload) {
    const { data, error } = await supabase.rpc("create_transfer", {
      p_sender_id: payload.senderId,
      p_beneficiary_id: payload.beneficiaryId,
      p_from_currency: payload.fromCurrency,
      p_to_currency: payload.toCurrency,
      p_amount_sent: payload.amountSent,
      p_applied_rate: payload.appliedRate,
      p_payment_method: payload.paymentMethod,
      p_fee: payload.fee ?? 0,
      p_notes: payload.notes ?? null,
    });
    if (error) throw error;
    return data?.[0] ?? null;
  },
};
