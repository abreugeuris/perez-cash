import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Pencil, Trash2, DollarSign, ArrowRightLeft } from "lucide-react";
import {
  fetchRates,
  toggleRateActive,
  deleteRate,
  clearRatesError,
} from "@/store/slices/ratesSlice";

import { CardBody, Button } from "@/styles/components";
import {
  SearchBar,
  TasaCard,
  TasaRow,
  TasaInfo,
  TasaRate,
  TasaDesc,
  TasaBadge,
  ToggleBtn,
  Actions,
  EmptyState,
} from "./styles/ratesStyled";
import RateFormModal from "@/components/modals/RateFormModal";
import DataListPage from "@/components/DataListPage";

export default function Rates() {
  const dispatch = useDispatch();
  const {
    items: rates,
    status,
    deleting,
  } = useSelector((state) => state.rates);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchRates());
    return () => dispatch(clearRatesError());
  }, [dispatch, status]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rates;
    return rates.filter(
      (r) =>
        r.from_currency.toLowerCase().includes(q) ||
        r.to_currency.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q),
    );
  }, [rates, search]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setModalOpen(true);
  }, []);
  const openEdit = useCallback((r) => {
    setEditing(r);
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditing(null);
  }, []);

  const handleToggle = async (id) => {
    const result = await dispatch(toggleRateActive(id));
    if (!toggleRateActive.fulfilled.match(result)) {
      toast.error(result.payload?.message ?? "Error toggling rate");
    }
  };

  const handleDelete = async (id) => {
    if (pendingDelete === id) {
      const result = await dispatch(deleteRate(id));
      if (deleteRate.fulfilled.match(result)) {
        toast.success("Rate deleted");
      } else {
        toast.error(result.payload?.message ?? "Error deleting rate");
      }
      setPendingDelete(null);
    } else {
      setPendingDelete(id);
      toast("Delete rate?", {
        description: "Click the icon again to confirm.",
        action: { label: "Cancel", onClick: () => setPendingDelete(null) },
      });
    }
  };

  const activeCount = rates.filter((r) => r.active).length;

  return (
    <>
      <DataListPage
        title="Gestión de Tasas"
        subtitle={`${filtered.length} tasa${filtered.length !== 1 ? "s" : ""} configurada${filtered.length !== 1 ? "s" : ""} | ${activeCount} activa${activeCount !== 1 ? "s" : ""}`}
        actionLabel="Nueva Tasa"
        onAction={openCreate}
        searchPlaceholder="Buscar por moneda o descripción…"
        searchValue={search}
        onSearchChange={setSearch}
        SearchBarComponent={SearchBar}
        loading={status === "loading"}
        loadingText="Cargando tasas…"
        isEmpty={filtered.length === 0}
        EmptyStateComponent={EmptyState}
        emptyIcon={DollarSign}
        emptyTitle={search ? "Sin resultados" : "No hay tasas configuradas"}
        emptyDescription={
          search
            ? "Intenta con otros términos de búsqueda."
            : "Agrega tu primera tasa de cambio para comenzar."
        }
        emptyActionLabel={!search ? "Nueva Tasa" : undefined}
        onEmptyAction={openCreate}
      >
        {filtered.map((r) => (
          <TasaCard key={r.id} $inactive={!r.active}>
            <CardBody>
              <TasaRow>
                <TasaInfo>
                  <TasaRate>
                    <span
                      style={{
                        color: "var(--color-muted-fg)",
                        fontSize: "0.75rem",
                      }}
                    >
                      1 {r.from_currency}
                    </span>
                    <ArrowRightLeft
                      size={14}
                      style={{ color: "var(--color-muted-fg)" }}
                    />
                    <span
                      style={{ color: "var(--color-fg)", fontSize: "0.9rem" }}
                    >
                      {r.rate % 1 === 0 ? r.rate.toFixed(0) : r.rate.toFixed(2)}
                    </span>
                    <span
                      style={{
                        color: "var(--color-muted-fg)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {r.to_currency}
                    </span>
                    <ToggleBtn
                      $on={r.active}
                      onClick={() => handleToggle(r.id)}
                      title={r.active ? "Desactivar" : "Activar"}
                    />
                    <TasaBadge $active={r.active}>
                      {r.active ? "Activa" : "Inactiva"}
                    </TasaBadge>
                  </TasaRate>
                  <TasaDesc>{r.description}</TasaDesc>
                </TasaInfo>
                <Actions>
                  <Button
                    $variant="ghost"
                    $size="sm"
                    onClick={() => openEdit(r)}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    $variant={pendingDelete === r.id ? "destructive" : "ghost"}
                    $size="sm"
                    onClick={() => handleDelete(r.id)}
                    disabled={deleting}
                    title={pendingDelete === r.id ? "Confirm delete" : "Delete"}
                  >
                    <Trash2 size={14} />
                  </Button>
                </Actions>
              </TasaRow>
            </CardBody>
          </TasaCard>
        ))}
      </DataListPage>

      <RateFormModal open={modalOpen} editing={editing} onClose={closeModal} />
    </>
  );
}
