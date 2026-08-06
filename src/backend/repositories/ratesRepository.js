import { supabase } from '@/lib/supabaseClient';

export const ratesRepository = {
  async getAll() {
    const { data, error } = await supabase.rpc("get_rates");
    if (error) throw error;
    return data ?? [];
  },

  async create(payload) {
    const { data, error } = await supabase.rpc("create_rate", {
      p_name: payload.name,
      p_phone: payload.phone,
      p_id_document: payload.idDocument ?? null,
      p_address: payload.address ?? null,
      p_notes: payload.notes ?? null,
    });
    if (error) throw error;
    return data?.[0] ?? null;
  },

  async update(id, payload) {
    const { data, error } = await supabase.rpc("update_rate", {
      p_id: id,
      p_name: payload.name,
      p_phone: payload.phone,
      p_id_document: payload.idDocument ?? null,
      p_address: payload.address ?? null,
      p_notes: payload.notes ?? null,
    });
    if (error) throw error;
    return data?.[0] ?? null;
  },

  async delete(id) {
    const { error } = await supabase.rpc("delete_rate", { p_id: id });
    if (error) throw error;
  },
};
