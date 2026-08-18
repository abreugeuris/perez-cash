import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { X } from "lucide-react";
import { createRate, updateRate } from "@/store/slices/ratesSlice";
import {
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
  ModalOverlay,
  ModalCard,
  FormGroup,
  ErrorMsg,
  ToggleBtn,
} from "@/pages/styles/ratesStyled";

const INITIAL_FORM = {
  fromCurrency: "",
  toCurrency: "",
  rate: "",
  description: "",
  active: true,
};

/**
 * Modal de creación/edición de una tasa de cambio.
 * Reutilizado por Rates.jsx.
 *
 * Props:
 *  - open: boolean
 *  - editing: objeto rate a editar, o null para modo "crear"
 *  - onClose: () => void
 *  - onSuccess: (rate) => void
 */
export default function RateFormModal({ open, editing, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state.rates);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        fromCurrency: editing.from_currency,
        toCurrency: editing.to_currency,
        rate: String(editing.rate),
        description: editing.description ?? "",
        active: editing.active,
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [open, editing]);

  const validate = useCallback(() => {
    const errs = {};
    if (!form.fromCurrency.trim())
      errs.fromCurrency = "La moneda de origen es requerida";
    if (!form.toCurrency.trim())
      errs.toCurrency = "La moneda de destino es requerida";
    const val = parseFloat(form.rate);
    if (!form.rate || isNaN(val) || val <= 0)
      errs.rate = "El valor debe ser un número positivo";
    if (!form.description.trim())
      errs.description = "La descripción es requerida";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...form, rate: parseFloat(form.rate) };

    const result = editing
      ? await dispatch(updateRate({ id: editing.id, payload }))
      : await dispatch(createRate(payload));

    const thunk = editing ? updateRate : createRate;
    if (thunk.fulfilled.match(result)) {
      toast.success(editing ? "Tasa actualizada" : "Tasa creada");
      onSuccess?.(result.payload);
      onClose();
    } else {
      toast.error(result.payload?.message ?? "Error al guardar la tasa");
    }
  };

  if (!open) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>{editing ? "Editar Tasa" : "Nueva Tasa"}</CardTitle>
          <Button $variant="ghost" $size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Grid $cols={2} $gap="0.75rem" style={{ marginBottom: "0.75rem" }}>
              <FormGroup>
                <Label htmlFor="rate-fromCurrency">Moneda Origen *</Label>
                <Input
                  id="rate-fromCurrency"
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
                <Label htmlFor="rate-toCurrency">Moneda Destino *</Label>
                <Input
                  id="rate-toCurrency"
                  value={form.toCurrency}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      toCurrency: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="HTG"
                />
                {errors.toCurrency && <ErrorMsg>{errors.toCurrency}</ErrorMsg>}
              </FormGroup>
            </Grid>
            <FormGroup>
              <Label htmlFor="rate-value">Valor *</Label>
              <Input
                id="rate-value"
                type="number"
                step="0.01"
                value={form.rate}
                onChange={(e) => setForm({ ...form, rate: e.target.value })}
                placeholder="2.35"
              />
              {errors.rate && <ErrorMsg>{errors.rate}</ErrorMsg>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="rate-description">Descripción *</Label>
              <Input
                id="rate-description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Tasa estándar Peso Dominicano → Gourde Haitiano"
              />
              {errors.description && <ErrorMsg>{errors.description}</ErrorMsg>}
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
              <Button type="button" $variant="outline" onClick={onClose}>
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
  );
}
