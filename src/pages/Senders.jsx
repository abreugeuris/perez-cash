import { useState, useMemo, useCallback } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Users,
  Phone,
  MapPin,
  IdCard,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { sendersController } from "@/backend/controllers/sendersController";
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
  RemitenteCard,
  RemitenteRow,
  RemitenteInfo,
  RemitenteName,
  RemitenteMeta,
  Actions,
  ModalOverlay,
  ModalCard,
  FormGroup,
  ErrorMsg,
  EmptyState,
} from "./styles/sendersStyled";

const initialForm = {
  nombre: "",
  apellido: "",
  telefono: "",
  cedula: "",
  direccion: "",
};

export default function Senders() {
  const [remitentes, setRemitentes] = useState(() =>
    sendersController.listar(),
  );

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return remitentes;
    return remitentes.filter(
      (r) =>
        r.nombre.toLowerCase().includes(q) ||
        r.apellido.toLowerCase().includes(q) ||
        r.telefono.toLowerCase().includes(q) ||
        r.cedula.toLowerCase().includes(q),
    );
  }, [remitentes, search]);

  const openCreate = useCallback(() => {
    setForm(initialForm);
    setErrors({});
    setEditing(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((r) => {
    setForm({
      nombre: r.nombre,
      apellido: r.apellido,
      telefono: r.telefono,
      cedula: r.cedula,
      direccion: r.direccion,
    });
    setErrors({});
    setEditing(r);
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
    if (!form.cedula.trim() || form.cedula.trim().length < 6)
      errs.cedula = "Cédula inválida";
    if (!form.direccion.trim()) errs.direccion = "La dirección es requerida";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editing) {
      sendersController.actualizar({
        id: editing.id,
        ...form,
        createdAt: editing.createdAt,
      });
    } else {
      sendersController.crear(form);
    }
    setRemitentes(sendersController.listar());
    closeModal();
  };

  const handleDelete = (id) => {
    const rem = remitentes.find((r) => r.id === id);
    if (pendingDelete === id) {
      sendersController.eliminar(id);
      setRemitentes(sendersController.listar());
      setPendingDelete(null);
    } else {
      setPendingDelete(id);
      toast("¿Eliminar remitente?", {
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
        $wrap
        style={{ marginBottom: "0.25rem" }}
      >
        <div>
          <PageTitle>Gestión de Remitentes</PageTitle>
          <PageSubtitle>
            {filtered.length} remitente{filtered.length !== 1 ? "s" : ""}
            registrado{filtered.length !== 1 ? "s" : ""}
          </PageSubtitle>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Nuevo Remitente
        </Button>
      </Flex>

      <SearchBar>
        <Search size={16} />
        <Input
          placeholder="Buscar por nombre, apellido, teléfono o cédula…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBar>

      {filtered.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState>
              <Users size={40} />
              <h3>{search ? "Sin resultados" : "No hay remitentes"}</h3>
              <p>
                {search
                  ? "Intenta con otros términos de búsqueda."
                  : "Agrega tu primer remitente para comenzar."}
              </p>
              {!search && (
                <Button
                  $variant="outline"
                  onClick={openCreate}
                  style={{ marginTop: "1rem" }}
                >
                  <Plus size={16} /> Nuevo Remitente
                </Button>
              )}
            </EmptyState>
          </CardBody>
        </Card>
      ) : (
        <Grid $gap="0.75rem">
          {filtered.map((r) => (
            <RemitenteCard key={r.id}>
              <CardBody>
                <RemitenteRow>
                  <RemitenteInfo>
                    <RemitenteName>
                      {r.nombre} {r.apellido}
                    </RemitenteName>
                    <RemitenteMeta>
                      <span>
                        <IdCard size={12} /> {r.cedula}
                      </span>
                      <span>
                        <Phone size={12} /> {r.telefono}
                      </span>
                      <span>
                        <MapPin size={12} /> {r.direccion}
                      </span>
                    </RemitenteMeta>
                  </RemitenteInfo>
                  <Actions>
                    <Button
                      $variant="ghost"
                      $size="sm"
                      onClick={() => openEdit(r)}
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      $variant={
                        pendingDelete === r.id ? "destructive" : "ghost"
                      }
                      $size="sm"
                      onClick={() => handleDelete(r.id)}
                      title={
                        pendingDelete === r.id
                          ? "Confirmar eliminación"
                          : "Eliminar"
                      }
                    >
                      <Trash2 size={14} />
                    </Button>
                  </Actions>
                </RemitenteRow>
              </CardBody>
            </RemitenteCard>
          ))}
        </Grid>
      )}

      {modalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>
                {editing ? "Editar Remitente" : "Nuevo Remitente"}
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
                    placeholder="Ej: José"
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
                    placeholder="Ej: Pérez"
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
                    placeholder="+1 (809) 555-0101"
                  />
                  {errors.telefono && <ErrorMsg>{errors.telefono}</ErrorMsg>}
                </FormGroup>
                <FormGroup>
                  <Label>Cédula *</Label>
                  <Input
                    value={form.cedula}
                    onChange={(e) =>
                      setForm({ ...form, cedula: e.target.value })
                    }
                    placeholder="402-1234567-8"
                  />
                  {errors.cedula && <ErrorMsg>{errors.cedula}</ErrorMsg>}
                </FormGroup>
                <FormGroup>
                  <Label>Dirección *</Label>
                  <Input
                    value={form.direccion}
                    onChange={(e) =>
                      setForm({ ...form, direccion: e.target.value })
                    }
                    placeholder="Calle Duarte #45, Santo Domingo"
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
                    {editing ? "Guardar Cambios" : "Crear Remitente"}
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
