import styled, { createGlobalStyle } from "styled-components";

/**
 * Reglas GLOBALES de impresión.
 *
 * El truco "body * { visibility: hidden }" + "solo el recibo visible"
 * es necesario porque esta pantalla vive dentro de <Layout/> (con
 * Sidebar y TopHeader) — sin esto, al imprimir saldría también el
 * menú lateral y el header, no solo el recibo.
 *
 * @page { size: 50mm auto } le dice al navegador/impresora térmica
 * el ancho físico del rollo de papel. "auto" en el alto porque el
 * recibo puede ser más largo o corto según cuántos datos tenga.
 */
export const PrintGlobalStyle = createGlobalStyle`
  @media print {
    @page {
      size: 58mm auto;
      margin: 0;
    }

    /* El recibo ahora vive en un portal (#receipt-print-portal) que
       es hijo DIRECTO de <body>, fuera de <Layout/>. Ocultamos todos
       los demás hijos directos de body (el #root de la app con
       Sidebar/TopHeader incluido) — mucho más confiable que el truco
       "visibility: hidden" recursivo, que falla si algún ancestro
       tiene overflow/height fijo. */
    body > *:not(#receipt-print-portal) {
      display: none !important;
    }

    .no-print {
      display: none !important;
    }
  }
`;

/** Fondo gris de la pantalla (fuera del papel), solo se ve en preview */
export const ScreenBackdrop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1rem;
  background: var(--color-bg, #f4f4f5);
  min-height: 100%;
`;

/** El "papel" de 50mm — esto es lo único que se imprime */
export const ReceiptPaper = styled.div`
  width: 50mm;
  background: #fff;
  color: #000;
  padding: 2mm 2.5mm;
  font-family: "Courier New", Courier, monospace;
  font-size: 9px;
  line-height: 1.4;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15); /* solo en pantalla */

  @media print {
    box-shadow: none;
  }
`;

export const Center = styled.div`
  text-align: center;
`;

export const BusinessName = styled.div`
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 0.5px;
`;

export const BusinessSubtitle = styled.div`
  font-size: 8px;
  margin-top: 1px;
`;

export const Dashed = styled.div`
  border-top: 1px dashed #000;
  margin: 2mm 0;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5mm;
  margin: 0.6mm 0;

  .label {
    color: #333;
  }

  .value {
    font-weight: bold;
    text-align: right;
  }
`;

export const SectionTitle = styled.div`
  font-size: 8px;
  font-weight: bold;
  text-transform: uppercase;
  margin: 1.5mm 0 0.8mm;
`;

export const AmountBlock = styled.div`
  text-align: center;
  margin: 2mm 0;

  .amount {
    font-size: 14px;
    font-weight: bold;
  }

  .caption {
    font-size: 7.5px;
    color: #333;
  }
`;

export const Footer = styled.div`
  text-align: center;
  font-size: 8px;
  margin-top: 2mm;
`;

export const ActionsBar = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 50mm;
`;

/* ── Modal de preview (usado en NewShipment justo tras crear el envío) ── */

export const PreviewOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;

  @media print {
    background: transparent;
    position: static;
    padding: 0;
  }
`;

export const PreviewCard = styled.div`
  background: var(--color-bg, #f4f4f5);
  padding: 1.25rem;
  border-radius: var(--radius, 12px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-height: 90vh;
  overflow-y: auto;

  @media print {
    background: none;
    padding: 0;
    max-height: none;
    overflow: visible;
  }
`;
