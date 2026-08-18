import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { X } from "lucide-react";
import { createSender, updateSender } from "@/store/slices/sendersSlice";
import {
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  Input,
  Label,
  Flex,
} from "@/styles/components";
import {
  ModalOverlay,
  ModalCard,
  FormGroup,
  ErrorMsg,
} from "@/pages/styles/sendersStyled";

const INITIAL_FORM = {
  name: "",
  phone: "",
  idDocument: "",
  address: "",
  notes: "",
};

/**
 * Modal de creación/edición de un remitente.
 * Reutilizado por Senders.jsx (gestión completa) y NewShipment.jsx
 * (creación rápida inline, sin salir del formulario de envío).
 *
 * Props:
 *  - open: boolean
 *  - editing: objeto sender a editar, o null para modo "crear"
 *  - onClose: () => void
 *  - onSuccess: (sender) => void — se llama con el registro creado/editado
 */
export default function SenderFormModal({ open, editing, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state.senders);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        name: editing.name,
        phone: editing.phone,
        idDocument: editing.id_document ?? "",
        address: editing.address ?? "",
        notes: editing.notes ?? "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [open, editing]);

  const validate = useCallback(() => {
    const errs = {};
    if (!form.name.trim()) errs.name = "El nombre es requerido";
    if (!form.phone.trim() || form.phone.trim().length < 6)
      errs.phone = "Teléfono inválido";
    if (!form.idDocument.trim() || form.idDocument.trim().length < 6)
      errs.idDocument = "Cédula inválida";
    if (!form.address.trim()) errs.address = "La dirección es requerida";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = editing
      ? await dispatch(updateSender({ id: editing.id, payload: form }))
      : await dispatch(createSender(form));

    const thunk = editing ? updateSender : createSender;
    if (thunk.fulfilled.match(result)) {
      toast.success(editing ? "Remitente actualizado" : "Remitente creado");
      onSuccess?.(result.payload);
      onClose();
    } else {
      toast.error(result.payload?.message ?? "Error al guardar el remitente");
    }
  };

  if (!open) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>
            {editing ? "Editar Remitente" : "Nuevo Remitente"}
          </CardTitle>
          <Button $variant="ghost" $size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="sender-name">Nombre *</Label>
              <Input
                id="sender-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: José Pérez"
              />
              {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="sender-phone">Teléfono *</Label>
              <Input
                id="sender-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (809) 555-0101"
              />
              {errors.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="sender-idDocument">Cédula *</Label>
              <Input
                id="sender-idDocument"
                value={form.idDocument}
                onChange={(e) =>
                  setForm({ ...form, idDocument: e.target.value })
                }
                placeholder="402-1234567-8"
              />
              {errors.idDocument && <ErrorMsg>{errors.idDocument}</ErrorMsg>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="sender-address">Dirección *</Label>
              <Input
                id="sender-address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Calle Duarte #45, Santo Domingo"
              />
              {errors.address && <ErrorMsg>{errors.address}</ErrorMsg>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="sender-notes">Notas</Label>
              <Input
                id="sender-notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Observaciones opcionales"
              />
            </FormGroup>
            <Flex
              $gap="0.5rem"
              $justify="flex-end"
              style={{ marginTop: "1rem" }}
            >
              <Button type="button" $variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving
                  ? "Guardando…"
                  : editing
                    ? "Guardar Cambios"
                    : "Crear Remitente"}
              </Button>
            </Flex>
          </form>
        </CardBody>
      </ModalCard>
    </ModalOverlay>
  );
}
