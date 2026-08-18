import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

/**
 * En pantalla, el contenido del portal se mantiene fuera del área
 * visible (left: -10000px) — el usuario ve la copia normal del
 * recibo dentro del modal/página, no esta. Al imprimir, vuelve a su
 * posición normal y es lo ÚNICO que la impresora térmica recibe.
 */
const PrintOnlyWrapper = styled.div`
  position: fixed;
  left: -10000px;
  top: 0;

  @media print {
    position: static;
    left: 0;
  }
`;

/**
 * Renderiza su contenido como hijo DIRECTO de document.body, fuera
 * del árbol de <Layout/> (Sidebar, TopHeader, contenedores con
 * overflow/height fijo).
 *
 * Por qué: el truco clásico de impresión "body * { visibility:hidden }"
 * falla en Chrome cuando el contenido a imprimir vive anidado dentro
 * de contenedores con overflow:hidden o altura fija (como el shell
 * de una SPA) — el navegador calcula una página en blanco porque el
 * área "visible" queda recortada por el ancestro, aunque visibility
 * diga "visible". Sacando el recibo a un portal en el body, ese
 * problema desaparece: ya no tiene ancestros restrictivos.
 *
 * El id="receipt-print-portal" es el que excluye PrintGlobalStyle
 * (ver receiptStyled.js) de la regla que oculta todo lo demás al
 * imprimir.
 */
export default function ReceiptPrintArea({ children }) {
  const [container] = useState(() => {
    const el = document.createElement("div");
    el.id = "receipt-print-portal";
    return el;
  });

  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  return createPortal(
    <PrintOnlyWrapper>{children}</PrintOnlyWrapper>,
    container,
  );
}
