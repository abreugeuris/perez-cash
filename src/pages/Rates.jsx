import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  ArrowRightLeft,
  X,
} from "lucide-react";
import {
  fetchRates,
  createRate,
  updateRate,
  toggleRateActive,
  deleteRate,
  clearRatesError,
} from "@/store/slices/ratesSlice";
import {
  PageWrapper,
  PageTitle,
  PageSubtitle,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  Input,
  Label,
  Flex,
  Grid,
} from "@/styles/components";
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
  ModalOverlay,
  ModalCard,
  FormGroup,
  ErrorMsg,
  EmptyState,
} from "./styles/ratesStyled";

const INITIAL_FORM = {
  fromCurrency: "",
  toCurrency: "",
  rate: "",
  description: "",
  active: true,
};

export default function Rates() {
  const dispatch = useDispatch();
  const {
    items: rates,
    status,
    saving,
    deleting,
  } = useSelector((state) => state.rates);
  // Esta pantalla ya está restringida a owner por ProtectedRoute (/tasas),
  // pero igual dejamos user por si en el futuro se relaja el acceso.
  const { user } = useSelector((state) => state.auth);
  const isOwner = user?.role === "owner";

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
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
    setForm(INITIAL_FORM);
    setErrors({});
    setEditing(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((r) => {
    setForm({
      fromCurrency: r.from_currency,
      toCurrency: r.to_currency,
      rate: String(r.rate),
      description: r.description ?? "",
      active: r.active,
    });
    setErrors({});
    setEditing(r);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditing(null);
    setForm(INITIAL_FORM);
    setErrors({});
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.fromCurrency.trim())
      errs.fromCurrency = "From currency is required";
    if (!form.toCurrency.trim()) errs.toCurrency = "To currency is required";
    const val = parseFloat(form.rate);
    if (!form.rate || isNaN(val) || val <= 0)
      errs.rate = "Rate must be a positive number";
    if (!form.description.trim()) errs.description = "Description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...form, rate: parseFloat(form.rate) };

    if (editing) {
      const result = await dispatch(updateRate({ id: editing.id, payload }));
      if (updateRate.fulfilled.match(result)) {
        toast.success("Rate updated successfully");
        closeModal();
      } else {
        toast.error(result.payload?.message ?? "Error updating rate");
      }
    } else {
      const result = await dispatch(createRate(payload));
      if (createRate.fulfilled.match(result)) {
        toast.success("Rate created successfully");
        closeModal();
      } else {
        toast.error(result.payload?.message ?? "Error creating rate");
      }
    }
  };

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
  const isLoading = status === "loading";

  return (
    <PageWrapper>
      <Flex
        $justify="space-between"
        $align="center"
        $wrap
        style={{ marginBottom: "0.25rem" }}
      >
        <div>
          <PageTitle>Gestión de Tasas</PageTitle>
          <PageSubtitle>
            {filtered.length} tasa{filtered.length !== 1 ? "s" : ""} configurada
            {filtered.length !== 1 ? "s" : ""}
            {" | "}
            {activeCount} activa{activeCount !== 1 ? "s" : ""}
          </PageSubtitle>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Nueva Tasa
        </Button>
      </Flex>

      <SearchBar>
        <Search size={16} />
        <Input
          placeholder="Buscar por moneda o descripción…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBar>

      {isLoading ? (
        <Card>
          <CardBody style={{ textAlign: "center", padding: "3rem" }}>
            <p>Cargando tasas…</p>
          </CardBody>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState>
              <DollarSign size={40} />
              <h3>{search ? "Sin resultados" : "No hay tasas configuradas"}</h3>
              <p>
                {search
                  ? "Intenta con otros términos de búsqueda."
                  : "Agrega tu primera tasa de cambio para comenzar."}
              </p>
              {!search && (
                <Button
                  $variant="outline"
                  onClick={openCreate}
                  style={{ marginTop: "1rem" }}
                >
                  <Plus size={16} /> Nueva Tasa
                </Button>
              )}
            </EmptyState>
          </CardBody>
        </Card>
      ) : (
        <Grid $gap="0.75rem">
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
                        {r.rate % 1 === 0
                          ? r.rate.toFixed(0)
                          : r.rate.toFixed(2)}
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
                      $variant={
                        pendingDelete === r.id ? "destructive" : "ghost"
                      }
                      $size="sm"
                      onClick={() => handleDelete(r.id)}
                      disabled={deleting}
                      title={
                        pendingDelete === r.id ? "Confirm delete" : "Delete"
                      }
                    >
                      <Trash2 size={14} />
                    </Button>
                  </Actions>
                </TasaRow>
              </CardBody>
            </TasaCard>
          ))}
        </Grid>
      )}

      {modalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>{editing ? "Editar Tasa" : "Nueva Tasa"}</CardTitle>
              <Button $variant="ghost" $size="sm" onClick={closeModal}>
                <X size={16} />
              </Button>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <Grid
                  $cols={2}
                  $gap="0.75rem"
                  style={{ marginBottom: "0.75rem" }}
                >
                  <FormGroup>
                    <Label htmlFor="fromCurrency">Moneda Origen *</Label>
                    <Input
                      id="fromCurrency"
                      value={form.fromCurrency}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fromCurrency: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="DOP"
                    />
                    {errors.fromCurrency && (
                      <ErrorMsg>{errors.fromCurrency}</ErrorMsg>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="toCurrency">Moneda Destino *</Label>
                    <Input
                      id="toCurrency"
                      value={form.toCurrency}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          toCurrency: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="HTG"
                    />
                    {errors.toCurrency && (
                      <ErrorMsg>{errors.toCurrency}</ErrorMsg>
                    )}
                  </FormGroup>
                </Grid>
                <FormGroup>
                  <Label htmlFor="rate">Valor *</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    value={form.rate}
                    onChange={(e) => setForm({ ...form, rate: e.target.value })}
                    placeholder="2.35"
                  />
                  {errors.rate && <ErrorMsg>{errors.rate}</ErrorMsg>}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="description">Descripción *</Label>
                  <Input
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Tasa estándar Peso Dominicano → Gourde Haitiano"
                  />
                  {errors.description && (
                    <ErrorMsg>{errors.description}</ErrorMsg>
                  )}
                </FormGroup>
                <Flex
                  $align="center"
                  $gap="0.5rem"
                  style={{ marginBottom: "0.75rem" }}
                >
                  <ToggleBtn
                    $on={form.active}
                    onClick={() => setForm({ ...form, active: !form.active })}
                  />
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: form.active
                        ? "var(--color-success)"
                        : "var(--color-muted-fg)",
                    }}
                  >
                    {form.active ? "Tasa activa" : "Tasa inactiva"}
                  </span>
                </Flex>
                <Flex
                  $gap="0.5rem"
                  $justify="flex-end"
                  style={{ marginTop: "1rem" }}
                >
                  <Button type="button" $variant="outline" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving
                      ? "Guardando…"
                      : editing
                        ? "Guardar Cambios"
                        : "Crear Tasa"}
                  </Button>
                </Flex>
              </form>
            </CardBody>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
}
