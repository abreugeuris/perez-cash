import { Search, Plus } from "lucide-react";
import {
  PageWrapper,
  PageTitle,
  PageSubtitle,
  Card,
  CardBody,
  Button,
  Input,
  Flex,
  Grid,
} from "@/styles/components";

/**
 * Componente genérico para las pantallas de listado (Senders,
 * Recipient/Beneficiaries, Rates). Estandariza:
 *
 *  - Header: título + subtítulo + botón de acción principal + búsqueda
 *  - Body: estado de carga / estado vacío / grid de items (children)
 *  - Footer: slot opcional (ej. paginación a futuro)
 *
 * IMPORTANTE: SearchBarComponent y EmptyStateComponent son los
 * styled-components REALES de cada página (ej. importados desde
 * "./styles/sendersStyled"), no un estilo genérico — así cada
 * pantalla conserva exactamente su diseño actual. Este componente
 * solo estandariza el "andamiaje" (el orden y la lógica de
 * loading/empty/lista), no el CSS.
 */
export default function DataListPage({
  title,
  subtitle,
  actionLabel,
  onAction,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  SearchBarComponent,
  loading = false,
  loadingText = "Cargando…",
  isEmpty = false,
  EmptyStateComponent,
  emptyIcon: EmptyIcon,
  emptyIconSize = 40,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  footer,
  children,
}) {
  return (
    <PageWrapper>
      {/* ── Header ── */}
      <Flex $justify="space-between" $align="center" $wrap style={{ marginBottom: "0.25rem" }}>
        <div>
          <PageTitle>{title}</PageTitle>
          {subtitle && <PageSubtitle>{subtitle}</PageSubtitle>}
        </div>
        {actionLabel && (
          <Button onClick={onAction}>
            <Plus size={16} /> {actionLabel}
          </Button>
        )}
      </Flex>

      {SearchBarComponent && onSearchChange && (
        <SearchBarComponent>
          <Search size={16} />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </SearchBarComponent>
      )}

      {/* ── Body ── */}
      {loading ? (
        <Card>
          <CardBody style={{ textAlign: "center", padding: "3rem" }}>
            <p>{loadingText}</p>
          </CardBody>
        </Card>
      ) : isEmpty ? (
        <Card>
          <CardBody
            style={{
              padding: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
            <EmptyStateComponent>
              {EmptyIcon && <EmptyIcon size={emptyIconSize} />}
              <h3>{emptyTitle}</h3>
              <p>{emptyDescription}</p>
              {emptyActionLabel && (
                <Button $variant="outline" onClick={onEmptyAction} style={{ marginTop: "1rem" }}>
                  <Plus size={16} /> {emptyActionLabel}
                </Button>
              )}
            </EmptyStateComponent>
          </CardBody>
        </Card>
      ) : (
        <Grid $gap="0.75rem">{children}</Grid>
      )}

      {/* ── Footer (opcional) ── */}
      {footer && <div style={{ marginTop: "1rem" }}>{footer}</div>}
    </PageWrapper>
  );
}