import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { X } from "lucide-react";
import {
  createBeneficiary,
  updateBeneficiary,
} from "@/store/slices/beneficiariesSlice";
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
} from "@/pages/styles/recipientStyled";

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

/**
 * Modal de creación/edición de un beneficiario.
 * Reutilizado por Recipient.jsx (gestión completa) y NewShipment.jsx.
 *
 * Props:
 *  - open: boolean
 *  - editing: objeto beneficiary a editar, o null para modo "crear"
 *  - onClose: () => void
 *  - onSuccess: (beneficiary) => void
 */
export default function BeneficiaryFormModal({
  open,
  editing,
  onClose,
  onSuccess,
}) {
  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state.beneficiaries);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        name: editing.name,
        phone: editing.phone,
        idDocument: editing.id_document ?? "",
        country: editing.country ?? "Haití",
        paymentMethod: editing.payment_method ?? "",
        bankAccount: editing.bank_account ?? "",
        bank: editing.bank ?? "",
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
    if (!form.country.trim()) errs.country = "El país es requerido";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = editing
      ? await dispatch(updateBeneficiary({ id: editing.id, payload: form }))
      : await dispatch(createBeneficiary(form));

    const thunk = editing ? updateBeneficiary : createBeneficiary;
    if (thunk.fulfilled.match(result)) {
      toast.success(
        editing ? "Beneficiario actualizado" : "Beneficiario creado",
      );
      onSuccess?.(result.payload);
      onClose();
    } else {
      toast.error(
        result.payload?.message ?? "Error al guardar el beneficiario",
      );
    }
  };

  if (!open) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>
            {editing ? "Editar Beneficiario" : "Nuevo Beneficiario"}
          </CardTitle>
          <Button $variant="ghost" $size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="ben-name">Nombre *</Label>
              <Input
                id="ben-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Jean Baptiste"
              />
              {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="ben-phone">Teléfono *</Label>
              <Input
                id="ben-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+509 4444-1100"
              />
              {errors.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="ben-country">País *</Label>
              <Input
                id="ben-country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="Haití"
              />
              {errors.country && <ErrorMsg>{errors.country}</ErrorMsg>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="ben-idDocument">Documento de identidad</Label>
              <Input
                id="ben-idDocument"
                value={form.idDocument}
                onChange={(e) =>
                  setForm({ ...form, idDocument: e.target.value })
                }
                placeholder="Opcional"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="ben-paymentMethod">Método de pago</Label>
              <Input
                id="ben-paymentMethod"
                value={form.paymentMethod}
                onChange={(e) =>
                  setForm({ ...form, paymentMethod: e.target.value })
                }
                placeholder="Ej: efectivo, banco"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="ben-bank">Banco</Label>
              <Input
                id="ben-bank"
                value={form.bank}
                onChange={(e) => setForm({ ...form, bank: e.target.value })}
                placeholder="Opcional"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="ben-bankAccount">Número de cuenta</Label>
              <Input
                id="ben-bankAccount"
                value={form.bankAccount}
                onChange={(e) =>
                  setForm({ ...form, bankAccount: e.target.value })
                }
                placeholder="Opcional"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="ben-notes">Notas</Label>
              <Input
                id="ben-notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Dirección u observaciones"
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
                    : "Crear Beneficiario"}
              </Button>
            </Flex>
          </form>
        </CardBody>
      </ModalCard>
    </ModalOverlay>
  );
}
