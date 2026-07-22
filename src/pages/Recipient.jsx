import { useState, useMemo, useCallback } from "react";
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
import { recipientsController } from "@/backend/controllers/recipientsController";
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

const initialForm = {
  nombre: "",
  apellido: "",
  telefono: "",
  pais: "Haití",
  direccion: "",
};

export const recipients = [
  {
    id: 1,
    nombre: "Jean",
    apellido: "Baptiste",
    telefono: "+509 4444-1100",
    pais: "Haití",
    direccion: "Rue du Centre #12, Port-au-Prince, Ouest",
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    nombre: "Marie",
    apellido: "Joseph",
    telefono: "+509 3888-2200",
    pais: "Haití",
    direccion: "Ave. de la République #45, Pétion-Ville, Ouest",
    createdAt: "2025-01-18T14:15:00Z",
  },
];
export default function Recipient() {
  const {
    getAll,
    create,
    update,
    delete: deleteRecipient,
  } = recipientsController;

  const [beneficiarios, setBeneficiarios] = useState(getAll());

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return beneficiarios;
    return beneficiarios.filter(
      (b) =>
        b.nombre.toLowerCase().includes(q) ||
        b.apellido.toLowerCase().includes(q) ||
        b.telefono.toLowerCase().includes(q) ||
        b.pais.toLowerCase().includes(q) ||
        b.direccion.toLowerCase().includes(q),
    );
  }, [beneficiarios, search]);

  const openCreate = useCallback(() => {
    setForm(initialForm);
    setErrors({});
    setEditing(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((b) => {
    setForm({
      nombre: b.nombre,
      apellido: b.apellido,
      telefono: b.telefono,
      pais: b.pais,
      direccion: b.direccion,
    });
    setErrors({});
    setEditing(b);
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
    if (!form.nombre.trim()) errs.nombre = "El nombre es requerido";
    if (!form.apellido.trim()) errs.apellido = "El apellido es requerido";
    if (!form.telefono.trim() || form.telefono.trim().length < 6)
      errs.telefono = "Teléfono inválido";
    if (!form.pais.trim()) errs.pais = "El país es requerido";
    if (!form.direccion.trim()) errs.direccion = "La dirección es requerida";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editing) {
      update(editing.id, { ...form, createdAt: editing.createdAt });
    } else {
      create(form);
    }
    setBeneficiarios(getAll());
    closeModal();
  };

  const handleDelete = (id) => {
    if (pendingDelete === id) {
      deleteRecipient(id);
      setBeneficiarios(getAll());
      setPendingDelete(null);
    } else {
      setPendingDelete(id);
      toast("¿Eliminar beneficiario?", {
        description: "Haz clic de nuevo en el ícono para confirmar.",
        action: { label: "Cancelar", onClick: () => setPendingDelete(null) },
      });
    }
  };

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
          placeholder="Buscar por nombre, apellido, teléfono o país…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBar>

      {filtered.length === 0 ? (
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
                <Button
                  $variant="outline"
                  onClick={openCreate}
                  size="lg"
                >
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
                    <BenName>
                      {b.nombre} {b.apellido}
                    </BenName>
                    <BenMeta>
                      <span>
                        <Phone size={12} /> {b.telefono}
                      </span>
                      <span>
                        <CountryFlag>
                          <Flag size={12} /> {b.pais}
                        </CountryFlag>
                      </span>
                      <span>
                        <MapPin size={12} /> {b.direccion}
                      </span>
                    </BenMeta>
                  </BenInfo>
                  <Actions>
                    <Button
                      $variant="ghost"
                      $size="sm"
                      onClick={() => openEdit(b)}
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      $variant={
                        pendingDelete === b.id ? "destructive" : "ghost"
                      }
                      $size="sm"
                      onClick={() => handleDelete(b.id)}
                      title={
                        pendingDelete === b.id
                          ? "Confirmar eliminación"
                          : "Eliminar"
                      }
                    >
                      <Trash2 size={14} />
                    </Button>
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
                  <Label>Nombre *</Label>
                  <Input
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    placeholder="Ej: Jean"
                  />
                  {errors.nombre && <ErrorMsg>{errors.nombre}</ErrorMsg>}
                </FormGroup>
                <FormGroup>
                  <Label>Apellido *</Label>
                  <Input
                    value={form.apellido}
                    onChange={(e) =>
                      setForm({ ...form, apellido: e.target.value })
                    }
                    placeholder="Ej: Baptiste"
                  />
                  {errors.apellido && <ErrorMsg>{errors.apellido}</ErrorMsg>}
                </FormGroup>
                <FormGroup>
                  <Label>Teléfono *</Label>
                  <Input
                    value={form.telefono}
                    onChange={(e) =>
                      setForm({ ...form, telefono: e.target.value })
                    }
                    placeholder="+509 4444-1100"
                  />
                  {errors.telefono && <ErrorMsg>{errors.telefono}</ErrorMsg>}
                </FormGroup>
                <FormGroup>
                  <Label>País *</Label>
                  <Input
                    value={form.pais}
                    onChange={(e) => setForm({ ...form, pais: e.target.value })}
                    placeholder="Haití"
                  />
                  {errors.pais && <ErrorMsg>{errors.pais}</ErrorMsg>}
                </FormGroup>
                <FormGroup>
                  <Label>Dirección *</Label>
                  <Input
                    value={form.direccion}
                    onChange={(e) =>
                      setForm({ ...form, direccion: e.target.value })
                    }
                    placeholder="Rue du Centre #12, Port-au-Prince"
                  />
                  {errors.direccion && <ErrorMsg>{errors.direccion}</ErrorMsg>}
                </FormGroup>
                <Flex
                  $gap="0.5rem"
                  $justify="flex-end"
                  style={{ marginTop: "1rem" }}
                >
                  <Button type="button" $variant="outline" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editing ? "Guardar Cambios" : "Crear Beneficiario"}
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
