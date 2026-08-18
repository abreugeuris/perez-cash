import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Send, UserPlus } from "lucide-react";
import {
  TwoCol,
  RightCol,
  ModeToggle,
  ModeBtn,
  FieldError,
  SelectedInfo,
  AmountPreview,
  AmountLabel,
  AmountValue,
  StepBadge,
  FormGroup,
} from "./styles/newShipmentsStyle.js";
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
  Select,
  Label,
  Flex,
  Divider,
} from "@/styles/components";
import { fetchSenders } from "@/store/slices/sendersSlice";
import { fetchBeneficiaries } from "@/store/slices/beneficiariesSlice";
import { fetchRates } from "@/store/slices/ratesSlice";
import { createTransfer } from "@/store/slices/transfersSlice";
import SenderFormModal from "@/components/modals/SenderFormModal";
import BeneficiaryFormModal from "@/components/modals/BeneficiaryFormModal";
import ReceiptPreviewModal from "@/components/modals/ReceiptPreviewModal";

const PAYMENT_METHODS = [
  "Efectivo",
  "Transferencia bancaria",
  "Billetera móvil",
];

function formatAmount(amount, currency) {
  return `${amount.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export default function NewShipment() {
  const dispatch = useDispatch();
  // navigate queda disponible por si en el modal de preview agregas
  // un botón "Ver historial completo" u otro redirect a futuro.
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const { items: senders, status: sendersStatus } = useSelector(
    (s) => s.senders,
  );
  const { items: beneficiaries, status: beneficiariesStatus } = useSelector(
    (s) => s.beneficiaries,
  );
  const { items: rates, status: ratesStatus } = useSelector((s) => s.rates);
  const { saving } = useSelector((s) => s.transfers);

  const activeRates = useMemo(() => rates.filter((r) => r.active), [rates]);

  useEffect(() => {
    if (sendersStatus === "idle") dispatch(fetchSenders());
    if (beneficiariesStatus === "idle") dispatch(fetchBeneficiaries());
    if (ratesStatus === "idle") dispatch(fetchRates());
  }, [dispatch, sendersStatus, beneficiariesStatus, ratesStatus]);

  const defaultRateId = useMemo(
    () =>
      activeRates.find((r) => r.from_currency === "DOP")?.id ??
      activeRates[0]?.id ??
      "",
    [activeRates],
  );

  const [senderModalOpen, setSenderModalOpen] = useState(false);
  const [beneficiaryModalOpen, setBeneficiaryModalOpen] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      senderId: "",
      beneficiaryId: "",
      paymentMethod: "",
      rateId: defaultRateId,
      amountSent: "",
    },
  });

  const selectedSenderId = watch("senderId");
  const selectedBeneficiaryId = watch("beneficiaryId");
  const selectedRateId = watch("rateId");
  const amountSent = watch("amountSent");
  const paymentMethod = watch("paymentMethod");

  const selectedSender = useMemo(
    () => senders.find((s) => s.id === selectedSenderId) ?? null,
    [senders, selectedSenderId],
  );
  const selectedBeneficiary = useMemo(
    () => beneficiaries.find((b) => b.id === selectedBeneficiaryId) ?? null,
    [beneficiaries, selectedBeneficiaryId],
  );
  const selectedRate = useMemo(
    () => activeRates.find((r) => r.id === selectedRateId) ?? null,
    [activeRates, selectedRateId],
  );

  const amountReceived = useMemo(() => {
    const amt = parseFloat(amountSent);
    if (!amt || amt <= 0 || !selectedRate) return 0;
    return amt * selectedRate.rate;
  }, [amountSent, selectedRate]);

  const onSubmit = async (data) => {
    if (!data.senderId) {
      setError("senderId", { message: "Seleccione o cree un remitente" });
      return;
    }
    if (!data.beneficiaryId) {
      setError("beneficiaryId", {
        message: "Seleccione o cree un beneficiario",
      });
      return;
    }
    if (!data.paymentMethod) {
      setError("paymentMethod", { message: "Seleccione un método de pago" });
      return;
    }
    if (!data.rateId) {
      setError("rateId", { message: "Seleccione una tasa" });
      return;
    }
    const amountVal = parseFloat(data.amountSent);
    if (!amountVal || amountVal <= 0) {
      setError("amountSent", { message: "Ingrese un monto válido" });
      return;
    }

    const result = await dispatch(
      createTransfer({
        senderId: data.senderId,
        beneficiaryId: data.beneficiaryId,
        fromCurrency: selectedRate.from_currency,
        toCurrency: selectedRate.to_currency,
        amountSent: amountVal,
        appliedRate: selectedRate.rate,
        paymentMethod: data.paymentMethod,
      }),
    );

    if (createTransfer.fulfilled.match(result)) {
      toast.success("Envío registrado correctamente");

      // Armamos el recibo en memoria combinando la respuesta del
      // transfer con el sender/beneficiary ya seleccionados en el
      // form — evita un segundo round-trip a Supabase solo para
      // mostrar el preview inmediato.
      const t = result.payload;
      setReceiptPreview({
        reference_number: t.reference_number,
        created_at: t.created_at,
        status: t.status,
        sender_name: selectedSender?.name,
        sender_phone: selectedSender?.phone,
        sender_id_document: selectedSender?.id_document,
        beneficiary_name: selectedBeneficiary?.name,
        beneficiary_phone: selectedBeneficiary?.phone,
        beneficiary_country: selectedBeneficiary?.country,
        amount_sent: t.amount_sent,
        applied_rate: t.applied_rate,
        fee: t.fee,
        amount_received: t.amount_received,
        from_currency: t.from_currency,
        to_currency: t.to_currency,
        payment_method: t.payment_method,
      });
    } else {
      toast.error(result.payload?.message ?? "Error al registrar el envío");
    }
  };

  const closeReceiptPreview = () => {
    setReceiptPreview(null);
    // Deja el form listo para registrar el siguiente envío.
    reset();
  };

  return (
    <PageWrapper>
      <PageTitle>Nuevo Envío</PageTitle>
      <PageSubtitle>
        Complete los datos del remitente, beneficiario y montos para procesar la
        remesa.
      </PageSubtitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TwoCol>
          {/* ═══ LEFT: Remitente + Beneficiario, misma columna ═══ */}
          <RightCol>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Flex $gap="0.5rem" $align="center">
                    <StepBadge>1</StepBadge>
                    Remitente
                  </Flex>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <ModeToggle>
                  <ModeBtn $active type="button" disabled>
                    Seleccionar existente
                  </ModeBtn>
                  <ModeBtn
                    type="button"
                    onClick={() => setSenderModalOpen(true)}
                  >
                    <UserPlus size={12} /> Nuevo
                  </ModeBtn>
                </ModeToggle>

                <FormGroup>
                  <Label>Remitente</Label>
                  <Select
                    value={selectedSenderId}
                    onChange={(e) => setValue("senderId", e.target.value)}
                  >
                    <option value="">— Seleccione un remitente —</option>
                    {senders.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.phone}
                      </option>
                    ))}
                  </Select>
                  {errors.senderId && (
                    <FieldError>{errors.senderId.message}</FieldError>
                  )}
                </FormGroup>
                {selectedSender && (
                  <SelectedInfo>
                    <p>
                      <span className="label">Nombre: </span>
                      <span className="value">{selectedSender.name}</span>
                    </p>
                    <p>
                      <span className="label">Teléfono: </span>
                      <span className="value">{selectedSender.phone}</span>
                    </p>
                    <p>
                      <span className="label">Cédula: </span>
                      <span className="value">
                        {selectedSender.id_document}
                      </span>
                    </p>
                    {selectedSender.address && (
                      <p>
                        <span className="label">Dirección: </span>
                        <span className="value">{selectedSender.address}</span>
                      </p>
                    )}
                  </SelectedInfo>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <Flex $gap="0.5rem" $align="center">
                    <StepBadge $accent>2</StepBadge>
                    Beneficiario
                  </Flex>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <ModeToggle>
                  <ModeBtn $active type="button" disabled>
                    Seleccionar existente
                  </ModeBtn>
                  <ModeBtn
                    type="button"
                    onClick={() => setBeneficiaryModalOpen(true)}
                  >
                    <UserPlus size={12} /> Nuevo
                  </ModeBtn>
                </ModeToggle>

                <FormGroup>
                  <Label>Beneficiario</Label>
                  <Select
                    value={selectedBeneficiaryId}
                    onChange={(e) => setValue("beneficiaryId", e.target.value)}
                  >
                    <option value="">— Seleccione un beneficiario —</option>
                    {beneficiaries.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} — {b.phone} ({b.country})
                      </option>
                    ))}
                  </Select>
                  {errors.beneficiaryId && (
                    <FieldError>{errors.beneficiaryId.message}</FieldError>
                  )}
                </FormGroup>
                {selectedBeneficiary && (
                  <SelectedInfo>
                    <p>
                      <span className="label">Nombre: </span>
                      <span className="value">{selectedBeneficiary.name}</span>
                    </p>
                    <p>
                      <span className="label">Teléfono: </span>
                      <span className="value">{selectedBeneficiary.phone}</span>
                    </p>
                    <p>
                      <span className="label">País: </span>
                      <span className="value">
                        {selectedBeneficiary.country}
                      </span>
                    </p>
                  </SelectedInfo>
                )}
              </CardBody>
            </Card>
          </RightCol>

          {/* ═══ RIGHT: Montos y Tasa ═══ */}
          <RightCol>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Flex $gap="0.5rem" $align="center">
                    <StepBadge $accent>3</StepBadge>
                    Montos y Tasa
                  </Flex>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>Tasa de Cambio *</Label>
                  <Select
                    value={selectedRateId}
                    onChange={(e) => setValue("rateId", e.target.value)}
                  >
                    <option value="">— Seleccione una tasa —</option>
                    {activeRates.map((r) => (
                      <option key={r.id} value={r.id}>
                        1 {r.from_currency} = {r.rate.toFixed(2)}{" "}
                        {r.to_currency} — {r.description}
                      </option>
                    ))}
                  </Select>
                  {errors.rateId && (
                    <FieldError>{errors.rateId.message}</FieldError>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Monto a Enviar *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="1"
                    {...register("amountSent")}
                    placeholder="0.00"
                  />
                  {errors.amountSent && (
                    <FieldError>{errors.amountSent.message}</FieldError>
                  )}
                </FormGroup>

                {selectedRate && amountReceived > 0 && (
                  <AmountPreview>
                    <AmountLabel>El beneficiario recibe</AmountLabel>
                    <AmountValue>
                      {formatAmount(amountReceived, selectedRate.to_currency)}
                    </AmountValue>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--color-muted-fg)",
                        marginTop: "0.25rem",
                      }}
                    >
                      Tasa: 1 {selectedRate.from_currency} ={" "}
                      {selectedRate.rate.toFixed(2)} {selectedRate.to_currency}
                    </div>
                  </AmountPreview>
                )}

                <Divider $my="0.75rem" />

                <FormGroup>
                  <Label>Método de Pago *</Label>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setValue("paymentMethod", e.target.value)}
                  >
                    <option value="">— Seleccione un método —</option>
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </Select>
                  {errors.paymentMethod && (
                    <FieldError>{errors.paymentMethod.message}</FieldError>
                  )}
                </FormGroup>

                <Button
                  type="submit"
                  $fullWidth
                  $size="lg"
                  disabled={isSubmitting || saving}
                  style={{ marginTop: "0.5rem" }}
                >
                  <Send size={16} />
                  {isSubmitting || saving ? "Procesando..." : "Enviar Remesa"}
                </Button>
              </CardBody>
            </Card>
          </RightCol>
        </TwoCol>
      </form>

      {/* Mismos modales que usan Senders.jsx y Recipient.jsx.
          onSuccess selecciona automáticamente el registro recién creado. */}
      <SenderFormModal
        open={senderModalOpen}
        editing={null}
        onClose={() => setSenderModalOpen(false)}
        onSuccess={(sender) =>
          setValue("senderId", sender.id, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          })
        }
      />
      <BeneficiaryFormModal
        open={beneficiaryModalOpen}
        editing={null}
        onClose={() => setBeneficiaryModalOpen(false)}
        onSuccess={(beneficiary) =>
          setValue("beneficiaryId", beneficiary.id, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          })
        }
      />

      <ReceiptPreviewModal
        open={!!receiptPreview}
        receipt={receiptPreview}
        onClose={closeReceiptPreview}
      />
    </PageWrapper>
  );
}
