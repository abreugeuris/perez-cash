import { useState, useMemo, useCallback } from "react";
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
import { ratesController } from "@/backend/controllers/rates.controller";
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

const initialForm = {
  monedaOrigen: "",
  monedaDestino: "",
  valor: "",
  descripcion: "",
  activa: true,
};

export default function Rates() {
  const [tasas, setTasas] = useState(() => ratesController.listar());

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return tasas;
    return tasas.filter(
      (t) =>
        t.monedaOrigen.toLowerCase().includes(q) ||
        t.monedaDestino.toLowerCase().includes(q) ||
        t.descripcion.toLowerCase().includes(q),
    );
  }, [tasas, search]);

  const openCreate = useCallback(() => {
    setForm(initialForm);
    setErrors({});
    setEditing(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((t) => {
    setForm({
      monedaOrigen: t.monedaOrigen,
      monedaDestino: t.monedaDestino,
      valor: String(t.valor),
      descripcion: t.descripcion,
      activa: t.activa,
    });
    setErrors({});
    setEditing(t);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditing(null);
    setForm(initialForm);
    setErrors({});
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.monedaOrigen.trim())
      errs.monedaOrigen = "La moneda de origen es requerida";
    if (!form.monedaDestino.trim())
      errs.monedaDestino = "La moneda de destino es requerida";
    const val = parseFloat(form.valor);
    if (!form.valor || isNaN(val) || val <= 0)
      errs.valor = "El valor debe ser un número positivo";
    if (!form.descripcion.trim())
      errs.descripcion = "La descripción es requerida";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = { ...form, valor: parseFloat(form.valor) };

    if (editing) {
      ratesController.actualizar({
        id: editing.id,
        ...data,
        createdAt: editing.createdAt,
        updatedAt: editing.updatedAt,
      });
    } else {
      ratesController.crear(data);
    }
    setTasas(ratesController.listar());
    closeModal();
  };

  const handleToggle = (id) => {
    ratesController.toggleActiva(id);
    setTasas(ratesController.listar());
  };

  const handleDelete = (id) => {
    if (pendingDelete === id) {
      ratesController.eliminar(id);
      setTasas(ratesController.listar());
      setPendingDelete(null);
    } else {
      setPendingDelete(id);
      toast("¿Eliminar tasa?", {
        description: "Haz clic de nuevo en el ícono para confirmar.",
        action: { label: "Cancelar", onClick: () => setPendingDelete(null) },
      });
    }
  };

  const activasCount = tasas.filter((t) => t.activa).length;

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
            {activasCount} activa{activasCount !== 1 ? "s" : ""}
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

      {filtered.length === 0 ? (
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
          {filtered.map((t) => (
            <TasaCard key={t.id} $inactive={!t.activa}>
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
                        1 {t.monedaOrigen}
                      </span>
                      <ArrowRightLeft
                        size={14}
                        style={{ color: "var(--color-muted-fg)" }}
                      />
                      <span
                        style={{ color: "var(--color-fg)", fontSize: "0.9rem" }}
                      >
                        {t.valor % 1 === 0
                          ? t.valor.toFixed(0)
                          : t.valor.toFixed(2)}
                      </span>
                      <span
                        style={{
                          color: "var(--color-muted-fg)",
                          fontSize: "0.75rem",
                        }}
                      >
                        {t.monedaDestino}
                      </span>
                      <ToggleBtn
                        $on={t.activa}
                        onClick={() => handleToggle(t.id)}
                        title={t.activa ? "Desactivar" : "Activar"}
                      />
                      <TasaBadge $active={t.activa}>
                        {t.activa ? "Activa" : "Inactiva"}
                      </TasaBadge>
                    </TasaRate>
                    <TasaDesc>{t.descripcion}</TasaDesc>
                  </TasaInfo>
                  <Actions>
                    <Button
                      $variant="ghost"
                      $size="sm"
                      onClick={() => openEdit(t)}
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      $variant={
                        pendingDelete === t.id ? "destructive" : "ghost"
                      }
                      $size="sm"
                      onClick={() => handleDelete(t.id)}
                      title={
                        pendingDelete === t.id
                          ? "Confirmar eliminación"
                          : "Eliminar"
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
                    <Label>Moneda Origen *</Label>
                    <Input
                      value={form.monedaOrigen}
                      onChange={(e) =>
                        setForm({ ...form, monedaOrigen: e.target.value })
                      }
                      placeholder="DOP"
                    />
                    {errors.monedaOrigen && (
                      <ErrorMsg>{errors.monedaOrigen}</ErrorMsg>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>Moneda Destino *</Label>
                    <Input
                      value={form.monedaDestino}
                      onChange={(e) =>
                        setForm({ ...form, monedaDestino: e.target.value })
                      }
                      placeholder="HTG"
                    />
                    {errors.monedaDestino && (
                      <ErrorMsg>{errors.monedaDestino}</ErrorMsg>
                    )}
                  </FormGroup>
                </Grid>
                <FormGroup>
                  <Label>Valor *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.valor}
                    onChange={(e) =>
                      setForm({ ...form, valor: e.target.value })
                    }
                    placeholder="2.35"
                  />
                  {errors.valor && <ErrorMsg>{errors.valor}</ErrorMsg>}
                </FormGroup>
                <FormGroup>
                  <Label>Descripción *</Label>
                  <Input
                    value={form.descripcion}
                    onChange={(e) =>
                      setForm({ ...form, descripcion: e.target.value })
                    }
                    placeholder="Tasa estándar Peso Dominicano → Gourde Haitiano"
                  />
                  {errors.descripcion && (
                    <ErrorMsg>{errors.descripcion}</ErrorMsg>
                  )}
                </FormGroup>
                <Flex
                  $align="center"
                  $gap="0.5rem"
                  style={{ marginBottom: "0.75rem" }}
                >
                  <ToggleBtn
                    $on={form.activa}
                    onClick={() => setForm({ ...form, activa: !form.activa })}
                  />
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: form.activa
                        ? "var(--color-success)"
                        : "var(--color-muted-fg)",
                    }}
                  >
                    {form.activa ? "Tasa activa" : "Tasa inactiva"}
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
                  <Button type="submit">
                    {editing ? "Guardar Cambios" : "Crear Tasa"}
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
