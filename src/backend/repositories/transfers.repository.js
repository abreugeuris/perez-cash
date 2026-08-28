import { supabase } from '@/lib/supabaseClient';


export const transfersRepository = {
  async getAll(filters = {}) {
    const { data, error } = await supabase.rpc("get_transfers", {
      p_status: filters.status || null,
      // El RPC castea created_at a 'America/Santo_Domingo' internamente,
      // así que basta con mandar la fecha simple (YYYY-MM-DD) tal cual
      // viene del <input type="date">, sin conversión de zona horaria acá.
      p_date_from: filters.dateFrom || null,
      p_date_to: filters.dateTo || null,
      p_search: filters.search || null,
      p_sort_dir: filters.sortDir || "desc",
      p_page: filters.page || 1,
      p_page_size: filters.pageSize || 10,
    });
    if (error) throw error;

    const rows = data ?? [];
    // total_count viaja repetido en cada fila (count(*) over()) —
    // se saca una vez y se limpia de los items individuales.
    const totalCount = rows[0]?.total_count ? Number(rows[0].total_count) : 0;
    const items = rows.map(({ total_count, ...rest }) => rest);

    return { items, totalCount };
  },

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

  async getReceipt(id) {
    const { data, error } = await supabase.rpc("get_transfer_receipt", {
      p_id: id,
    });
    if (error) throw error;
    return data?.[0] ?? null;
  },
};
