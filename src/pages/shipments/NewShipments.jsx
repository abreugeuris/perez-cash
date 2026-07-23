import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { shipmentsController } from "@/backend/controllers/shipmentsController";
import { sendersController } from "@/backend/controllers/sendersController";
import { recipientsController } from "@/backend/controllers/recipients.controller";
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
  Select,
  Label,
  Flex,
  Grid,
  Divider,
} from "@/styles/components";
import {
  Send,
  UserPlus,
  ChevronDown,
  ArrowRightLeft,
  Calculator,
} from "lucide-react";

function formatCurrency(amount) {
  return `RD$ ${amount.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatHtg(amount) {
  return `${amount.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} HTG`;
}

const METODOS_PAGO = ["Efectivo", "Transferencia bancaria", "Billetera móvil"];

export default function NewShipment() {
  const navigate = useNavigate();
  const [remitentes, setRemitentes] = useState(() =>
    sendersController.listar(),
  );
  const [beneficiarios, setBeneficiarios] = useState(() =>
    recipientsController.getAll(),
  );
  const [tasas, setTasas] = useState(() => ratesController.listar());
  const tasasActivas = useMemo(() => tasas.filter((t) => t.activa), [tasas]);

  const defaultTasaId = useMemo(
    () =>
      tasasActivas.find((t) => t.monedaOrigen === "DOP")?.id ??
      tasasActivas[0]?.id ??
      "",
    [tasasActivas],
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      remitenteMode: "select",
      remitenteId: "",
      remitenteNombre: "",
      remitenteApellido: "",
      remitenteTelefono: "",
      remitenteCedula: "",
      remitenteDireccion: "",
      beneficiarioMode: "select",
      beneficiarioId: "",
      beneficiarioNombre: "",
      beneficiarioApellido: "",
      beneficiarioTelefono: "",
      beneficiarioPais: "Haití",
      beneficiarioDireccion: "",
      metodoPago: "",
      tasaId: defaultTasaId,
      cantidadEnviar: "",
    },
  });

  const remitenteMode = watch("remitenteMode");
  const beneficiarioMode = watch("beneficiarioMode");
  const selectedRemitenteId = watch("remitenteId");
  const selectedBeneficiarioId = watch("beneficiarioId");
  const selectedTasaId = watch("tasaId");
  const cantidadEnviar = watch("cantidadEnviar");

  const selectedRemitente = useMemo(
    () => remitentes.find((r) => r.id === selectedRemitenteId) ?? null,
    [remitentes, selectedRemitenteId],
  );
  const selectedBeneficiario = useMemo(
    () => beneficiarios.find((b) => b.id === selectedBeneficiarioId) ?? null,
    [beneficiarios, selectedBeneficiarioId],
  );
  const selectedTasa = useMemo(
    () => tasas.find((t) => t.id === selectedTasaId) ?? null,
    [tasas, selectedTasaId],
  );

  const montoRecibido = useMemo(() => {
    const cant = parseFloat(cantidadEnviar);
    if (!cant || cant <= 0 || !selectedTasa) return 0;
    return cant * selectedTasa.valor;
  }, [cantidadEnviar, selectedTasa]);

  const switchRemitenteMode = (mode) => {
    setValue("remitenteMode", mode);
    if (mode === "select") {
      resetField("remitenteNombre");
      resetField("remitenteApellido");
      resetField("remitenteTelefono");
      resetField("remitenteCedula");
      resetField("remitenteDireccion");
    } else {
      setValue("remitenteId", "");
    }
  };

  const switchBeneficiarioMode = (mode) => {
    setValue("beneficiarioMode", mode);
    if (mode === "select") {
      resetField("beneficiarioNombre");
      resetField("beneficiarioApellido");
      resetField("beneficiarioTelefono");
      resetField("beneficiarioDireccion");
    } else {
      setValue("beneficiarioId", "");
    }
  };

  const onSubmit = async (data) => {
    // Validate manually
    if (data.remitenteMode === "select" && !data.remitenteId) {
      setError("remitenteId", { message: "Seleccione un remitente existente" });
      return;
    }
    if (data.remitenteMode === "create") {
      if (!data.remitenteNombre?.trim()) {
        setError("remitenteNombre", { message: "Requerido" });
        return;
      }
      if (!data.remitenteApellido?.trim()) {
        setError("remitenteApellido", { message: "Requerido" });
        return;
      }
      if (!data.remitenteTelefono?.trim()) {
        setError("remitenteTelefono", { message: "Requerido" });
        return;
      }
      if (!data.remitenteCedula?.trim()) {
        setError("remitenteCedula", { message: "Requerido" });
        return;
      }
    }
    if (data.beneficiarioMode === "select" && !data.beneficiarioId) {
      setError("beneficiarioId", {
        message: "Seleccione un beneficiario existente",
      });
      return;
    }
    if (data.beneficiarioMode === "create") {
      if (!data.beneficiarioNombre?.trim()) {
        setError("beneficiarioNombre", { message: "Requerido" });
        return;
      }
      if (!data.beneficiarioApellido?.trim()) {
        setError("beneficiarioApellido", { message: "Requerido" });
        return;
      }
      if (!data.beneficiarioTelefono?.trim()) {
        setError("beneficiarioTelefono", { message: "Requerido" });
        return;
      }
    }
    if (!data.metodoPago) {
      setError("metodoPago", { message: "Seleccione un método de pago" });
      return;
    }
    if (!data.tasaId) {
      setError("tasaId", { message: "Seleccione una tasa" });
      return;
    }
    const cantVal = parseFloat(data.cantidadEnviar);
    if (!cantVal || cantVal <= 0) {
      setError("cantidadEnviar", { message: "Ingrese un monto válido" });
      return;
    }

    try {
      const result = shipmentsController.crear({
        remitente:
          data.remitenteMode === "create"
            ? {
                nombre: data.remitenteNombre.trim(),
                apellido: data.remitenteApellido.trim(),
                telefono: data.remitenteTelefono.trim(),
                cedula: data.remitenteCedula.trim(),
                direccion: (data.remitenteDireccion || "").trim(),
              }
            : { telefono: selectedRemitente?.telefono },
        beneficiario:
          data.beneficiarioMode === "create"
            ? {
                nombre: data.beneficiarioNombre.trim(),
                apellido: data.beneficiarioApellido.trim(),
                telefono: data.beneficiarioTelefono.trim(),
                pais: (data.beneficiarioPais || "Haití").trim(),
                direccion: (data.beneficiarioDireccion || "").trim(),
              }
            : { telefono: selectedBeneficiario?.telefono },
        tasaId: data.tasaId,
        montoEnviado: cantVal,
        metodoPago: data.metodoPago,
        estado: "pendiente",
        fecha: new Date().toISOString(),
      });

      if (result?.id) {
        navigate(`/envios/${result.id}/recibo`);
      }
    } catch (_) {
      // Error already shown by controller
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
                  $active={remitenteMode === "select"}
                  onClick={() => switchRemitenteMode("select")}
                >
                  Seleccionar existente
                </ModeBtn>
                <ModeBtn
                  $active={remitenteMode === "create"}
                  onClick={() => switchRemitenteMode("create")}
                >
                  <UserPlus size={12} /> Nuevo
                </ModeBtn>
              </ModeToggle>

              {remitenteMode === "select" ? (
                <>
                  <FormGroup>
                    <Label>Remitente</Label>
                    <Select
                      value={selectedRemitenteId}
                      onChange={(e) => setValue("remitenteId", e.target.value)}
                    >
                      <option value="">— Seleccione un remitente —</option>
                      {remitentes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nombre} {r.apellido} — {r.telefono}
                        </option>
                      ))}
                    </Select>
                    {errors.remitenteId && (
                      <FieldError>{errors.remitenteId.message}</FieldError>
                    )}
                  </FormGroup>
                  {selectedRemitente && (
                    <SelectedInfo>
                      <p>
                        <span className="label">Nombre: </span>
                        <span className="value">
                          {selectedRemitente.nombre}{" "}
                          {selectedRemitente.apellido}
                        </span>
                      </p>
                      <p>
                        <span className="label">Teléfono: </span>
                        <span className="value">
                          {selectedRemitente.telefono}
                        </span>
                      </p>
                      <p>
                        <span className="label">Cédula: </span>
                        <span className="value">
                          {selectedRemitente.cedula}
                        </span>
                      </p>
                      {selectedRemitente.direccion && (
                        <p>
                          <span className="label">Dirección: </span>
                          <span className="value">
                            {selectedRemitente.direccion}
                          </span>
                        </p>
                      )}
                    </SelectedInfo>
                  )}
                </>
              ) : (
                <>
                  <Grid $cols={2} $gap="0.6rem">
                    <FormGroup>
                      <Label>Nombre *</Label>
                      <Input
                        {...register("remitenteNombre")}
                        placeholder="Ej: José"
                      />
                      {errors.remitenteNombre && (
                        <FieldError>
                          {errors.remitenteNombre.message}
                        </FieldError>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label>Apellido *</Label>
                      <Input
                        {...register("remitenteApellido")}
                        placeholder="Ej: Pérez"
                      />
                      {errors.remitenteApellido && (
                        <FieldError>
                          {errors.remitenteApellido.message}
                        </FieldError>
                      )}
                    </FormGroup>
                  </Grid>
                  <FormGroup>
                    <Label>Teléfono *</Label>
                    <Input
                      {...register("remitenteTelefono")}
                      placeholder="+1 (809) 555-0101"
                    />
                    {errors.remitenteTelefono && (
                      <FieldError>
                        {errors.remitenteTelefono.message}
                      </FieldError>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>Cédula / Pasaporte *</Label>
                    <Input
                      {...register("remitenteCedula")}
                      placeholder="402-1234567-8"
                    />
                    {errors.remitenteCedula && (
                      <FieldError>{errors.remitenteCedula.message}</FieldError>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>Dirección</Label>
                    <Input
                      {...register("remitenteDireccion")}
                      placeholder="Calle, número, ciudad"
                    />
                  </FormGroup>
                </>
              )}
            </CardBody>
          </Card>

          {/* ═══ RIGHT: Beneficiario + Montos ═══ */}
          <RightCol>
            {/* Beneficiario */}
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
                    $active={beneficiarioMode === "select"}
                    onClick={() => switchBeneficiarioMode("select")}
                  >
                    Seleccionar existente
                  </ModeBtn>
                  <ModeBtn
                    $active={beneficiarioMode === "create"}
                    onClick={() => switchBeneficiarioMode("create")}
                  >
                    <UserPlus size={12} /> Nuevo
                  </ModeBtn>
                </ModeToggle>

                {beneficiarioMode === "select" ? (
                  <>
                    <FormGroup>
                      <Label>Beneficiario</Label>
                      <Select
                        value={selectedBeneficiarioId}
                        onChange={(e) =>
                          setValue("beneficiarioId", e.target.value)
                        }
                      >
                        <option value="">— Seleccione un beneficiario —</option>
                        {beneficiarios.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.nombre} {b.apellido} — {b.telefono} ({b.pais})
                          </option>
                        ))}
                      </Select>
                      {errors.beneficiarioId && (
                        <FieldError>{errors.beneficiarioId.message}</FieldError>
                      )}
                    </FormGroup>
                    {selectedBeneficiario && (
                      <SelectedInfo>
                        <p>
                          <span className="label">Nombre: </span>
                          <span className="value">
                            {selectedBeneficiario.nombre}{" "}
                            {selectedBeneficiario.apellido}
                          </span>
                        </p>
                        <p>
                          <span className="label">Teléfono: </span>
                          <span className="value">
                            {selectedBeneficiario.telefono}
                          </span>
                        </p>
                        <p>
                          <span className="label">País: </span>
                          <span className="value">
                            {selectedBeneficiario.pais}
                          </span>
                        </p>
                      </SelectedInfo>
                    )}
                  </>
                ) : (
                  <>
                    <Grid $cols={2} $gap="0.6rem">
                      <FormGroup>
                        <Label>Nombre *</Label>
                        <Input
                          {...register("beneficiarioNombre")}
                          placeholder="Ej: Jean"
                        />
                        {errors.beneficiarioNombre && (
                          <FieldError>
                            {errors.beneficiarioNombre.message}
                          </FieldError>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label>Apellido *</Label>
                        <Input
                          {...register("beneficiarioApellido")}
                          placeholder="Ej: Baptiste"
                        />
                        {errors.beneficiarioApellido && (
                          <FieldError>
                            {errors.beneficiarioApellido.message}
                          </FieldError>
                        )}
                      </FormGroup>
                    </Grid>
                    <FormGroup>
                      <Label>Teléfono *</Label>
                      <Input
                        {...register("beneficiarioTelefono")}
                        placeholder="+509 4444-1100"
                      />
                      {errors.beneficiarioTelefono && (
                        <FieldError>
                          {errors.beneficiarioTelefono.message}
                        </FieldError>
                      )}
                    </FormGroup>
                    <Grid $cols={2} $gap="0.6rem">
                      <FormGroup>
                        <Label>País</Label>
                        <Input
                          {...register("beneficiarioPais")}
                          placeholder="Haití"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Dirección</Label>
                        <Input
                          {...register("beneficiarioDireccion")}
                          placeholder="Rue du Centre #12"
                        />
                      </FormGroup>
                    </Grid>
                  </>
                )}
              </CardBody>
            </Card>

            {/* Montos */}
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
                    value={selectedTasaId}
                    onChange={(e) => setValue("tasaId", e.target.value)}
                  >
                    <option value="">— Seleccione una tasa —</option>
                    {tasasActivas.map((t) => (
                      <option key={t.id} value={t.id}>
                        1 {t.monedaOrigen} = {t.valor.toFixed(2)}{" "}
                        {t.monedaDestino} — {t.descripcion}
                      </option>
                    ))}
                  </Select>
                  {errors.tasaId && (
                    <FieldError>{errors.tasaId.message}</FieldError>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Monto a Enviar *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="1"
                    {...register("cantidadEnviar")}
                    placeholder="0.00"
                  />
                  {errors.cantidadEnviar && (
                    <FieldError>{errors.cantidadEnviar.message}</FieldError>
                  )}
                </FormGroup>

                {selectedTasa && montoRecibido > 0 && (
                  <AmountPreview>
                    <AmountLabel>El beneficiario recibe</AmountLabel>
                    <AmountValue>{formatHtg(montoRecibido)}</AmountValue>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--color-muted-fg)",
                        marginTop: "0.25rem",
                      }}
                    >
                      Tasa: 1 {selectedTasa.monedaOrigen} ={" "}
                      {selectedTasa.valor.toFixed(2)}{" "}
                      {selectedTasa.monedaDestino}
                    </div>
                  </AmountPreview>
                )}

                <Divider $my="0.75rem" />

                <FormGroup>
                  <Label>Método de Pago *</Label>
                  <Select
                    value={watch("metodoPago")}
                    onChange={(e) => setValue("metodoPago", e.target.value)}
                  >
                    <option value="">— Seleccione un método —</option>
                    {METODOS_PAGO.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </Select>
                  {errors.metodoPago && (
                    <FieldError>{errors.metodoPago.message}</FieldError>
                  )}
                </FormGroup>

                <Button
                  type="submit"
                  $fullWidth
                  $size="lg"
                  disabled={isSubmitting}
                  style={{ marginTop: "0.5rem" }}
                >
                  <Send size={16} />
                  {isSubmitting ? "Procesando..." : "Enviar Remesa"}
                </Button>
              </CardBody>
            </Card>
          </RightCol>
        </TwoCol>
      </form>
    </PageWrapper>
  );
}
