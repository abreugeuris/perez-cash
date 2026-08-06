import { useMemo, useEffect } from "react";
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
  Grid,
  Divider,
} from "@/styles/components";
import { fetchSenders, createSender } from "@/store/slices/sendersSlice";
import {
  fetchBeneficiaries,
  createBeneficiary,
} from "@/store/slices/beneficiariesSlice";
import { fetchRates } from "@/store/slices/ratesSlice";
import { createTransfer } from "@/store/slices/transfersSlice";

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

  // Cargar catálogos solo si aún no están en Redux
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      senderMode: "select",
      senderId: "",
      senderName: "",
      senderPhone: "",
      senderIdDocument: "",
      senderAddress: "",
      beneficiaryMode: "select",
      beneficiaryId: "",
      beneficiaryName: "",
      beneficiaryPhone: "",
      beneficiaryCountry: "Haití",
      beneficiaryNotes: "",
      paymentMethod: "",
      rateId: defaultRateId,
      amountSent: "",
    },
  });

  const senderMode = watch("senderMode");
  const beneficiaryMode = watch("beneficiaryMode");
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

  const switchSenderMode = (mode) => {
    setValue("senderMode", mode);
    if (mode === "select") {
      setValue("senderName", "");
      setValue("senderPhone", "");
      setValue("senderIdDocument", "");
      setValue("senderAddress", "");
    } else {
      setValue("senderId", "");
    }
  };

  const switchBeneficiaryMode = (mode) => {
    setValue("beneficiaryMode", mode);
    if (mode === "select") {
      setValue("beneficiaryName", "");
      setValue("beneficiaryPhone", "");
      setValue("beneficiaryCountry", "Haití");
      setValue("beneficiaryNotes", "");
    } else {
      setValue("beneficiaryId", "");
    }
  };

  const onSubmit = async (data) => {
    // ── Validaciones manuales (equivalentes a las reglas de Senders/Recipient) ──
    if (data.senderMode === "select" && !data.senderId) {
      setError("senderId", { message: "Seleccione un remitente existente" });
      return;
    }
    if (data.senderMode === "create") {
      if (!data.senderName?.trim())
        return setError("senderName", { message: "Requerido" });
      if (!data.senderPhone?.trim() || data.senderPhone.trim().length < 6)
        return setError("senderPhone", { message: "Teléfono inválido" });
      if (
        !data.senderIdDocument?.trim() ||
        data.senderIdDocument.trim().length < 6
      )
        return setError("senderIdDocument", { message: "Cédula inválida" });
    }
    if (data.beneficiaryMode === "select" && !data.beneficiaryId) {
      setError("beneficiaryId", {
        message: "Seleccione un beneficiario existente",
      });
      return;
    }
    if (data.beneficiaryMode === "create") {
      if (!data.beneficiaryName?.trim())
        return setError("beneficiaryName", { message: "Requerido" });
      if (
        !data.beneficiaryPhone?.trim() ||
        data.beneficiaryPhone.trim().length < 6
      )
        return setError("beneficiaryPhone", { message: "Teléfono inválido" });
      if (!data.beneficiaryCountry?.trim())
        return setError("beneficiaryCountry", { message: "Requerido" });
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

    try {
      // 1. Resolver sender_id — crear primero si es "Nuevo"
      let senderId = data.senderId;
      if (data.senderMode === "create") {
        const result = await dispatch(
          createSender({
            name: data.senderName.trim(),
            phone: data.senderPhone.trim(),
            idDocument: data.senderIdDocument.trim(),
            address: (data.senderAddress || "").trim(),
          }),
        );
        if (!createSender.fulfilled.match(result)) {
          toast.error(result.payload?.message ?? "Error al crear el remitente");
          return;
        }
        senderId = result.payload.id;
        // El select de "Remitentes" ya se actualizó solo, porque
        // createSender.fulfilled empuja el nuevo registro a state.senders.items.
      }

      // 2. Resolver beneficiary_id — igual que arriba
      let beneficiaryId = data.beneficiaryId;
      if (data.beneficiaryMode === "create") {
        const result = await dispatch(
          createBeneficiary({
            name: data.beneficiaryName.trim(),
            phone: data.beneficiaryPhone.trim(),
            country: (data.beneficiaryCountry || "Haití").trim(),
            notes: (data.beneficiaryNotes || "").trim(),
          }),
        );
        if (!createBeneficiary.fulfilled.match(result)) {
          toast.error(
            result.payload?.message ?? "Error al crear el beneficiario",
          );
          return;
        }
        beneficiaryId = result.payload.id;
      }

      // 3. Crear el envío referenciando ambos ids
      const transferResult = await dispatch(
        createTransfer({
          senderId,
          beneficiaryId,
          fromCurrency: selectedRate.from_currency,
          toCurrency: selectedRate.to_currency,
          amountSent: amountVal,
          appliedRate: selectedRate.rate,
          paymentMethod: data.paymentMethod,
        }),
      );

      if (createTransfer.fulfilled.match(transferResult)) {
        toast.success("Envío registrado correctamente");
        navigate(`/envios/${transferResult.payload.id}/recibo`);
      } else {
        toast.error(
          transferResult.payload?.message ?? "Error al registrar el envío",
        );
      }
    } catch (err) {
      toast.error("Ocurrió un error inesperado");
    }
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
          {/* ═══ LEFT: Remitente ═══ */}
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
                <ModeBtn
                  $active={senderMode === "select"}
                  type="button"
                  onClick={() => switchSenderMode("select")}
                >
                  Seleccionar existente
                </ModeBtn>
                <ModeBtn
                  $active={senderMode === "create"}
                  type="button"
                  onClick={() => switchSenderMode("create")}
                >
                  <UserPlus size={12} /> Nuevo
                </ModeBtn>
              </ModeToggle>

              {senderMode === "select" ? (
                <>
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
                          <span className="value">
                            {selectedSender.address}
                          </span>
                        </p>
                      )}
                    </SelectedInfo>
                  )}
                </>
              ) : (
                <>
                  <FormGroup>
                    <Label>Nombre completo *</Label>
                    <Input
                      {...register("senderName")}
                      placeholder="Ej: José Pérez"
                    />
                    {errors.senderName && (
                      <FieldError>{errors.senderName.message}</FieldError>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>Teléfono *</Label>
                    <Input
                      {...register("senderPhone")}
                      placeholder="+1 (809) 555-0101"
                    />
                    {errors.senderPhone && (
                      <FieldError>{errors.senderPhone.message}</FieldError>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>Cédula / Pasaporte *</Label>
                    <Input
                      {...register("senderIdDocument")}
                      placeholder="402-1234567-8"
                    />
                    {errors.senderIdDocument && (
                      <FieldError>{errors.senderIdDocument.message}</FieldError>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>Dirección</Label>
                    <Input
                      {...register("senderAddress")}
                      placeholder="Calle, número, ciudad"
                    />
                  </FormGroup>
                </>
              )}
            </CardBody>
          </Card>

          {/* ═══ RIGHT: Beneficiario + Montos ═══ */}
          <RightCol>
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
                  <ModeBtn
                    $active={beneficiaryMode === "select"}
                    type="button"
                    onClick={() => switchBeneficiaryMode("select")}
                  >
                    Seleccionar existente
                  </ModeBtn>
                  <ModeBtn
                    $active={beneficiaryMode === "create"}
                    type="button"
                    onClick={() => switchBeneficiaryMode("create")}
                  >
                    <UserPlus size={12} /> Nuevo
                  </ModeBtn>
                </ModeToggle>

                {beneficiaryMode === "select" ? (
                  <>
                    <FormGroup>
                      <Label>Beneficiario</Label>
                      <Select
                        value={selectedBeneficiaryId}
                        onChange={(e) =>
                          setValue("beneficiaryId", e.target.value)
                        }
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
                          <span className="value">
                            {selectedBeneficiary.name}
                          </span>
                        </p>
                        <p>
                          <span className="label">Teléfono: </span>
                          <span className="value">
                            {selectedBeneficiary.phone}
                          </span>
                        </p>
                        <p>
                          <span className="label">País: </span>
                          <span className="value">
                            {selectedBeneficiary.country}
                          </span>
                        </p>
                      </SelectedInfo>
                    )}
                  </>
                ) : (
                  <>
                    <FormGroup>
                      <Label>Nombre completo *</Label>
                      <Input
                        {...register("beneficiaryName")}
                        placeholder="Ej: Jean Baptiste"
                      />
                      {errors.beneficiaryName && (
                        <FieldError>
                          {errors.beneficiaryName.message}
                        </FieldError>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label>Teléfono *</Label>
                      <Input
                        {...register("beneficiaryPhone")}
                        placeholder="+509 4444-1100"
                      />
                      {errors.beneficiaryPhone && (
                        <FieldError>
                          {errors.beneficiaryPhone.message}
                        </FieldError>
                      )}
                    </FormGroup>
                    <Grid $cols={2} $gap="0.6rem">
                      <FormGroup>
                        <Label>País *</Label>
                        <Input
                          {...register("beneficiaryCountry")}
                          placeholder="Haití"
                        />
                        {errors.beneficiaryCountry && (
                          <FieldError>
                            {errors.beneficiaryCountry.message}
                          </FieldError>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label>Notas</Label>
                        <Input
                          {...register("beneficiaryNotes")}
                          placeholder="Dirección u observaciones"
                        />
                      </FormGroup>
                    </Grid>
                  </>
                )}
              </CardBody>
            </Card>

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
    </PageWrapper>
  );
}
