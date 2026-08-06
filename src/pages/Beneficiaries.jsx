import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  UserCheck,
  Phone,
  MapPin,
  Flag,
  X,
} from "lucide-react";
import {
  fetchBeneficiaries,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
  clearBeneficiariesError,
} from "@/store/slices/beneficiariesSlice";
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
  BenCard,
  BenRow,
  BenInfo,
  BenName,
  BenMeta,
  Actions,
  ModalOverlay,
  ModalCard,
  FormGroup,
  ErrorMsg,
  EmptyState,
  CountryFlag,
} from "./styles/recipientStyled";

const INITIAL_FORM = {
  name: "",
  phone: "",
  idDocument: "",
  country: "Haití",
  paymentMethod: "",
  bankAccount: "",
  bank: "",
  notes: "",
};

export default function Beneficiaries() {
  const dispatch = useDispatch();
  const {
    items: beneficiaries,
    status,
    saving,
    deleting,
  } = useSelector((state) => state.beneficiaries);
  const { user } = useSelector((state) => state.auth);
  const isOwner = user?.role === "owner";

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchBeneficiaries());
    return () => dispatch(clearBeneficiariesError());
  }, [dispatch, status]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return beneficiaries;
    return beneficiaries.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        (b.country ?? "").toLowerCase().includes(q),
    );
  }, [beneficiaries, search]);

  const openCreate = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    setEditing(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((b) => {
    setForm({
      name: b.name,
      phone: b.phone,
      idDocument: b.id_document ?? "",
      country: b.country ?? "Haití",
      paymentMethod: b.payment_method ?? "",
      bankAccount: b.bank_account ?? "",
      bank: b.bank ?? "",
      notes: b.notes ?? "",
    });
    setErrors({});
    setEditing(b);
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
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim() || form.phone.length < 6)
      errs.phone = "Invalid phone number";
    if (!form.country.trim()) errs.country = "Country is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editing) {
      const result = await dispatch(
        updateBeneficiary({ id: editing.id, payload: form }),
      );
      if (updateBeneficiary.fulfilled.match(result)) {
        toast.success("Beneficiary updated successfully");
        closeModal();
      } else {
        toast.error(result.payload?.message ?? "Error updating beneficiary");
      }
    } else {
      const result = await dispatch(createBeneficiary(form));
      if (createBeneficiary.fulfilled.match(result)) {
        toast.success("Beneficiary created successfully");
        closeModal();
      } else {
        toast.error(result.payload?.message ?? "Error creating beneficiary");
      }
    }
  };

  const handleDelete = async (id) => {
    if (pendingDelete === id) {
      const result = await dispatch(deleteBeneficiary(id));
      if (deleteBeneficiary.fulfilled.match(result)) {
        toast.success("Beneficiary deleted");
      } else {
        toast.error(result.payload?.message ?? "Error deleting beneficiary");
      }
      setPendingDelete(null);
    } else {
      setPendingDelete(id);
      toast("Delete beneficiary?", {
        description: "Click the icon again to confirm.",
        action: { label: "Cancel", onClick: () => setPendingDelete(null) },
      });
    }
  };

  const isLoading = status === "loading";

  return (
    <PageWrapper>
      <Flex
        $justify="space-between"
        $align="center"
        width="100%"
        $wrap
        style={{ marginBottom: "0.25rem" }}
      >
        <div>
          <PageTitle>Gestión de Beneficiarios</PageTitle>
          <PageSubtitle>
            {filtered.length} beneficiario{filtered.length !== 1 ? "s" : ""}{" "}
            registrado{filtered.length !== 1 ? "s" : ""}
          </PageSubtitle>
        </div>
        <Button size="lg" onClick={openCreate}>
          <Plus size={16} /> Nuevo Beneficiario
        </Button>
      </Flex>

      <SearchBar>
        <Search size={16} />
        <Input
          placeholder="Buscar por nombre, teléfono o país…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBar>

      {isLoading ? (
        <Card>
          <CardBody style={{ textAlign: "center", padding: "3rem" }}>
            <p>Cargando beneficiarios…</p>
          </CardBody>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardBody
            style={{
              padding: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "360px",
            }}
          >
            <EmptyState>
              <UserCheck size={52} />
              <h3>{search ? "Sin resultados" : "No hay beneficiarios"}</h3>
              <p>
                {search
                  ? "Intenta con otros términos de búsqueda."
                  : "Agrega tu primer beneficiario para comenzar."}
              </p>
              {!search && (
                <Button $variant="outline" onClick={openCreate} size="lg">
                  <Plus size={16} /> Nuevo Beneficiario
                </Button>
              )}
            </EmptyState>
          </CardBody>
        </Card>
      ) : (
        <Grid $gap="0.75rem">
          {filtered.map((b) => (
            <BenCard key={b.id}>
              <CardBody>
                <BenRow>
                  <BenInfo>
                    <BenName>{b.name}</BenName>
                    <BenMeta>
                      <span>
                        <Phone size={12} /> {b.phone}
                      </span>
                      <span>
                        <CountryFlag>
                          <Flag size={12} /> {b.country}
                        </CountryFlag>
                      </span>
                      {b.notes && (
                        <span>
                          <MapPin size={12} /> {b.notes}
                        </span>
                      )}
                    </BenMeta>
                  </BenInfo>
                  <Actions>
                    <Button
                      $variant="ghost"
                      $size="sm"
                      onClick={() => openEdit(b)}
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </Button>
                    {isOwner && (
                      <Button
                        $variant={
                          pendingDelete === b.id ? "destructive" : "ghost"
                        }
                        $size="sm"
                        onClick={() => handleDelete(b.id)}
                        disabled={deleting}
                        title={
                          pendingDelete === b.id ? "Confirm delete" : "Delete"
                        }
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </Actions>
                </BenRow>
              </CardBody>
            </BenCard>
          ))}
        </Grid>
      )}

      {modalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>
                {editing ? "Editar Beneficiario" : "Nuevo Beneficiario"}
              </CardTitle>
              <Button $variant="ghost" $size="sm" onClick={closeModal}>
                <X size={16} />
              </Button>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ej: Jean Baptiste"
                  />
                  {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="+509 4444-1100"
                  />
                  {errors.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="country">País *</Label>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    placeholder="Haití"
                  />
                  {errors.country && <ErrorMsg>{errors.country}</ErrorMsg>}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="idDocument">Documento de identidad</Label>
                  <Input
                    id="idDocument"
                    value={form.idDocument}
                    onChange={(e) =>
                      setForm({ ...form, idDocument: e.target.value })
                    }
                    placeholder="Opcional"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="paymentMethod">Método de pago</Label>
                  <Input
                    id="paymentMethod"
                    value={form.paymentMethod}
                    onChange={(e) =>
                      setForm({ ...form, paymentMethod: e.target.value })
                    }
                    placeholder="Ej: efectivo, banco"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="bank">Banco</Label>
                  <Input
                    id="bank"
                    value={form.bank}
                    onChange={(e) => setForm({ ...form, bank: e.target.value })}
                    placeholder="Opcional"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="bankAccount">Número de cuenta</Label>
                  <Input
                    id="bankAccount"
                    value={form.bankAccount}
                    onChange={(e) =>
                      setForm({ ...form, bankAccount: e.target.value })
                    }
                    placeholder="Opcional"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="notes">Notas</Label>
                  <Input
                    id="notes"
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    placeholder="Dirección u observaciones"
                  />
                </FormGroup>
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
                        : "Crear Beneficiario"}
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
