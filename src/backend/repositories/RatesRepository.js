import { supabase } from '@/lib/supabaseClient';

export const ratesRepository = {
  async getAll() {
    const { data, error } = await supabase.rpc("get_rates");
    if (error) throw error;
    return data ?? [];
  },

  async create(payload) {
    const { data, error } = await supabase.rpc("create_rate", {
      p_from_currency: payload.fromCurrency,
      p_to_currency: payload.toCurrency,
      p_rate: payload.rate,
      p_description: payload.description ?? "",
      p_active: payload.active ?? true,
    });
    if (error) throw error;
    return data?.[0] ?? null;
  },

  async update(id, payload) {
    const { data, error } = await supabase.rpc("update_rate", {
      p_id: id,
      p_from_currency: payload.fromCurrency,
      p_to_currency: payload.toCurrency,
      p_rate: payload.rate,
      p_description: payload.description ?? "",
      p_active: payload.active ?? true,
    });
    if (error) throw error;
    return data?.[0] ?? null;
  },

  async toggleActive(id) {
    const { data, error } = await supabase.rpc("toggle_rate_active", {
      p_id: id,
    });
    if (error) throw error;
    return data?.[0] ?? null;
  },

  async delete(id) {
    const { error } = await supabase.rpc("delete_rate", { p_id: id });
    if (error) throw error;
  },
};
