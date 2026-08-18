import { Printer, X } from "lucide-react";
import { Button, Flex } from "@/styles/components";
import ReceiptContent from "@/components/ReceiptContent";
import ReceiptPrintArea from "@/components/ReceiptPrintArea";
import {
  PrintGlobalStyle,
  PreviewOverlay,
  PreviewCard,
  ReceiptPaper,
} from "@/components/styles/receiptStyled.js";

/**
 * Modal de vista previa del recibo, mostrado justo después de crear
 * un envío. `receipt` se arma en memoria en NewShipment.jsx (sin
 * fetch propio) combinando la respuesta de createTransfer con el
 * sender/beneficiary ya seleccionados en el form.
 *
 * Renderiza DOS copias del recibo:
 *  - Una visible dentro del modal, para que el operador la revise.
 *  - Otra en un portal invisible (ReceiptPrintArea) que es la única
 *    que realmente llega a la impresora — evita el bug de página en
 *    blanco al imprimir contenido anidado dentro de <Layout/>.
 */
export default function ReceiptPreviewModal({ open, receipt, onClose }) {
  if (!open || !receipt) return null;

  return (
    <>
      <PrintGlobalStyle />

      <PreviewOverlay onClick={onClose}>
        <PreviewCard onClick={(e) => e.stopPropagation()}>
          <ReceiptPaper>
            <ReceiptContent receipt={receipt} />
          </ReceiptPaper>

          <Flex $gap="0.5rem" style={{ width: "50mm" }}>
            <Button
              $variant="outline"
              $size="sm"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              <X size={14} /> Cerrar
            </Button>
            <Button
              $size="sm"
              onClick={() => window.print()}
              style={{ flex: 1 }}
            >
              <Printer size={14} /> Imprimir
            </Button>
          </Flex>
        </PreviewCard>
      </PreviewOverlay>

      <ReceiptPrintArea>
        <ReceiptPaper>
          <ReceiptContent receipt={receipt} />
        </ReceiptPaper>
      </ReceiptPrintArea>
    </>
  );
}
