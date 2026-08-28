import {
  Center,
  BusinessName,
  BusinessSubtitle,
  Dashed,
  Row,
  SectionTitle,
  AmountBlock,
  Footer,
} from "./styles/receiptStyled";

// Misma zona horaria que usa el RPC get_transfers y el Historial —
// para que la fecha del recibo impreso siempre coincida con lo que
// se ve en el resto de la app, sin importar la zona horaria del navegador.
const BUSINESS_TIMEZONE = "America/Santo_Domingo";

function formatDate(isoString) {
  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: BUSINESS_TIMEZONE,
  }).format(new Date(isoString));
}

function formatMoney(amount, currency) {
  return `${Number(amount).toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

const STATUS_LABELS = {
  pending: "Pendiente",
  completed: "Completado",
  cancelled: "Cancelado",
};

/**
 * Contenido puro del recibo — no hace fetch, no conoce Redux.
 * Recibe el objeto `receipt` ya armado (misma forma que devuelve
 * el RPC get_transfer_receipt, o construido en memoria como hace
 * NewShipment.jsx para el preview inmediato tras crear el envío).
 */
export default function ReceiptContent({ receipt }) {
  return (
    <>
      <Center>
        <BusinessName>PEREZ CASH</BusinessName>
        <BusinessSubtitle>Envío de Remesas</BusinessSubtitle>
      </Center>

      <Dashed />

      <Row>
        <span className="label">Referencia:</span>
        <span className="value">{receipt.reference_number}</span>
      </Row>
      <Row>
        <span className="label">Fecha:</span>
        <span className="value">{formatDate(receipt.created_at)}</span>
      </Row>
      {receipt.status && (
        <Row>
          <span className="label">Estado:</span>
          <span className="value">{STATUS_LABELS[receipt.status] ?? receipt.status}</span>
        </Row>
      )}

      <Dashed />

      <SectionTitle>Remitente</SectionTitle>
      <Row><span className="label">Nombre:</span><span className="value">{receipt.sender_name}</span></Row>
      <Row><span className="label">Teléfono:</span><span className="value">{receipt.sender_phone}</span></Row>
      {receipt.sender_id_document && (
        <Row><span className="label">Cédula:</span><span className="value">{receipt.sender_id_document}</span></Row>
      )}

      <SectionTitle>Beneficiario</SectionTitle>
      <Row><span className="label">Nombre:</span><span className="value">{receipt.beneficiary_name}</span></Row>
      <Row><span className="label">Teléfono:</span><span className="value">{receipt.beneficiary_phone}</span></Row>
      <Row><span className="label">País:</span><span className="value">{receipt.beneficiary_country}</span></Row>

      <Dashed />

      <Row>
        <span className="label">Monto enviado:</span>
        <span className="value">{formatMoney(receipt.amount_sent, receipt.from_currency)}</span>
      </Row>
      <Row>
        <span className="label">Tasa aplicada:</span>
        <span className="value">1 {receipt.from_currency} = {Number(receipt.applied_rate).toFixed(2)} {receipt.to_currency}</span>
      </Row>
      {receipt.fee > 0 && (
        <Row>
          <span className="label">Comisión:</span>
          <span className="value">{formatMoney(receipt.fee, receipt.from_currency)}</span>
        </Row>
      )}
      <Row>
        <span className="label">Método de pago:</span>
        <span className="value">{receipt.payment_method}</span>
      </Row>

      <Dashed />

      <AmountBlock>
        <div className="caption">EL BENEFICIARIO RECIBE</div>
        <div className="amount">{formatMoney(receipt.amount_received, receipt.to_currency)}</div>
      </AmountBlock>

      <Dashed />

      <Footer>
        Gracias por confiar en Perez Cash
        <br />
        Conserve este recibo
      </Footer>
    </>
  );
}
