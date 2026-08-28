import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiltersBar,
  StyledSelect,
  StyledDate,
  DesktopTable,
  Table,
  ScrollWrap,
  MobileCards,
  EnvioCard,
  CardTop,
  ReciboBadge,
  CardPeople,
  PersonRow,
  CardMontoRow,
  MontoBlock,
  MontoLabel,
  MontoValue,
  MontoArrow,
  CardFooter,
  CardDate,
  StatusBadge,
  EmptyWrap,
} from "./styles/shipmentsHistoryStyle.js";
import {
  fetchTransfers,
  clearTransfersError,
} from "@/store/slices/transfersSlice";
import ReceiptPreviewModal from "@/components/modals/ReceiptPreviewModal";
import {
  PageWrapper,
  PageTitle,
  PageSubtitle,
  Card,
  CardBody,
  Button,
  Input,
  Flex,
} from "@/styles/components";
import {
  Search,
  ArrowUpDown,
  Send,
  Eye,
  Printer,
  Inbox,
  ArrowRightLeft,
  Calendar,
  User,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const STATUS_TO_BADGE_KEY = {
  pending: "pendiente",
  completed: "completado",
  cancelled: "cancelado",
};

const STATUS_LABELS = {
  pending: "Pendiente",
  completed: "Completado",
  cancelled: "Cancelado",
};

const MAX_RANGE_DAYS = 90; // debe coincidir con el límite del RPC get_transfers
const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

// Misma zona horaria que usa el RPC get_transfers para cortar el día
// (AT TIME ZONE 'America/Santo_Domingo') — así la fecha que se ve en
// esta tabla siempre coincide con el filtro, sin importar en qué
// zona horaria tenga configurado su navegador quien esté usando la app.
const BUSINESS_TIMEZONE = "America/Santo_Domingo";

function formatTableDate(isoString) {
  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: BUSINESS_TIMEZONE,
  }).format(new Date(isoString));
}

function formatCardDate(isoString) {
  return new Intl.DateTimeFormat("es-DO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: BUSINESS_TIMEZONE,
  }).format(new Date(isoString));
}

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(isoDateStr, days) {
  const d = new Date(`${isoDateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

const TODAY_STR = toISODate(new Date());
const DEFAULT_FROM_STR = addDays(TODAY_STR, -MAX_RANGE_DAYS);

export default function ShipmentsHistory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    items: transfers,
    totalCount,
    status,
    error,
  } = useSelector((s) => s.transfers);

  const [estadoFilter, setEstadoFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // valor tal cual escribe el usuario
  const [debouncedSearch, setDebouncedSearch] = useState(""); // el que realmente se manda al RPC
  const [dateFrom, setDateFrom] = useState(DEFAULT_FROM_STR);
  const [dateTo, setDateTo] = useState(TODAY_STR);
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [reprintTarget, setReprintTarget] = useState(null);

  // Espera 400ms sin que el usuario escriba antes de mandar la
  // búsqueda al servidor — evita un RPC por cada tecla presionada.
  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearch(searchTerm.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Límites nativos del <input type="date"> — el calendario no deja
  // elegir un rango mayor a 3 meses.
  const dateFromMin = dateTo ? addDays(dateTo, -MAX_RANGE_DAYS) : undefined;
  const dateFromMax = dateTo || TODAY_STR;
  const dateToMin = dateFrom || undefined;
  const dateToMax = dateFrom
    ? [addDays(dateFrom, MAX_RANGE_DAYS), TODAY_STR].sort()[0]
    : TODAY_STR;

  // Firma de los filtros que, al cambiar, deben resetear a página 1.
  const filtersKey = `${estadoFilter}|${dateFrom}|${dateTo}|${debouncedSearch}|${sortAsc}`;
  const prevFiltersKey = useRef(filtersKey);

  useEffect(() => {
    if (filtersKey !== prevFiltersKey.current) {
      prevFiltersKey.current = filtersKey;
      if (page !== 1) {
        setPage(1);
        return; // el cambio de página vuelve a disparar este efecto — se hace un solo fetch, no dos
      }
    }

    dispatch(
      fetchTransfers({
        status: estadoFilter || undefined,
        dateFrom,
        dateTo,
        search: debouncedSearch || undefined,
        sortDir: sortAsc ? "asc" : "desc",
        page,
        pageSize: PAGE_SIZE,
      }),
    );

    return () => dispatch(clearTransfersError());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filtersKey, page]);

  const isLoading = status === "loading";
  const hasExtraFilters = searchTerm || estadoFilter;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <PageWrapper>
      <Flex
        $justify="space-between"
        $align="center"
        $wrap
        style={{ marginBottom: "0.25rem" }}
      >
        <div>
          <PageTitle>Historial de Envíos</PageTitle>
          <PageSubtitle>
            {totalCount} envío{totalCount !== 1 ? "s" : ""} encontrado
            {totalCount !== 1 ? "s" : ""}
          </PageSubtitle>
        </div>
        <Button
          $variant="accent"
          $size="lg"
          onClick={() => navigate("/envios/nuevo")}
        >
          <Send size={16} /> Nuevo Envío
        </Button>
      </Flex>

      <FiltersBar>
        <CardBody>
          <Flex $gap="0.5rem" $wrap $align="center">
            <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-muted-fg)",
                }}
              />
              <Input
                style={{ paddingLeft: "2rem", fontSize: "0.8rem" }}
                placeholder="Buscar por nombre o referencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <StyledSelect
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="completed">Completado</option>
              <option value="pending">Pendiente</option>
              <option value="cancelled">Cancelado</option>
            </StyledSelect>
            <StyledDate
              type="date"
              value={dateFrom}
              min={dateFromMin}
              max={dateFromMax}
              onChange={(e) => setDateFrom(e.target.value)}
              title="Fecha desde (máx. 3 meses de rango)"
            />
            <StyledDate
              type="date"
              value={dateTo}
              min={dateToMin}
              max={dateToMax}
              onChange={(e) => setDateTo(e.target.value)}
              title="Fecha hasta (máx. 3 meses de rango)"
            />
            <Button
              $variant={sortAsc ? "accent" : "ghost"}
              $size="sm"
              onClick={() => setSortAsc((v) => !v)}
              title={sortAsc ? "Más antiguos primero" : "Más recientes primero"}
            >
              <ArrowUpDown size={14} />
            </Button>
          </Flex>
          <p
            style={{
              fontSize: "0.7rem",
              color: "var(--color-muted-fg)",
              marginTop: "0.4rem",
            }}
          >
            El rango de fechas no puede superar 3 meses.
          </p>
        </CardBody>
      </FiltersBar>

      {error && (
        <Card
          style={{
            marginBottom: "1rem",
            borderColor: "var(--color-destructive)",
          }}
        >
          <CardBody
            style={{ color: "var(--color-destructive)", fontSize: "0.85rem" }}
          >
            {error}
          </CardBody>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <CardBody style={{ textAlign: "center", padding: "3rem" }}>
            <p>Cargando envíos…</p>
          </CardBody>
        </Card>
      ) : transfers.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyWrap>
              <Inbox size={48} />
              <h3>Sin envíos</h3>
              <p>
                {hasExtraFilters
                  ? "No se encontraron envíos con los filtros actuales."
                  : "Aún no hay remesas registradas en este rango de fechas."}
              </p>
              {!hasExtraFilters && (
                <Button
                  $variant="accent"
                  $size="lg"
                  onClick={() => navigate("/envios/nuevo")}
                  style={{ marginTop: "1rem" }}
                >
                  <Send size={16} /> Crear Primer Envío
                </Button>
              )}
            </EmptyWrap>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* ═══ DESKTOP TABLE ═══ */}
          <DesktopTable>
            <Card>
              <CardBody style={{ padding: 0 }}>
                <ScrollWrap>
                  <Table>
                    <thead>
                      <tr>
                        <th>Recibo</th>
                        <th>Remitente</th>
                        <th>Beneficiario</th>
                        <th style={{ textAlign: "right" }}>Monto Enviado</th>
                        <th style={{ textAlign: "right" }}>Monto Recibido</th>
                        <th style={{ textAlign: "center" }}>Estado</th>
                        <th style={{ textAlign: "right" }}>Fecha</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {transfers.map((envio) => (
                        <tr
                          key={envio.id}
                          onClick={() => navigate(`/envios/${envio.id}/recibo`)}
                        >
                          <td
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.7rem",
                              color: "var(--color-primary)",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {envio.reference_number}
                          </td>
                          <td style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                            {envio.sender_name}
                          </td>
                          <td style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                            {envio.beneficiary_name}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.7rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {Number(envio.amount_sent).toLocaleString("es-DO", {
                              minimumFractionDigits: 2,
                            })}{" "}
                            {envio.from_currency}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.7rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {Number(envio.amount_received).toLocaleString(
                              "es-DO",
                              { minimumFractionDigits: 2 },
                            )}{" "}
                            {envio.to_currency}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <StatusBadge
                              $estado={
                                STATUS_TO_BADGE_KEY[envio.status] ??
                                envio.status
                              }
                            >
                              {STATUS_LABELS[envio.status] ?? envio.status}
                            </StatusBadge>
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              fontSize: "0.7rem",
                              color: "var(--color-muted-fg)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatTableDate(envio.created_at)}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Flex
                              $gap="0.5rem"
                              $align="center"
                              $justify="flex-end"
                            >
                              <Button
                                $variant="ghost"
                                $size="sm"
                                title="Reimprimir recibo"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReprintTarget(envio);
                                }}
                              >
                                <Printer size={14} />
                              </Button>
                              <Eye
                                size={14}
                                style={{ color: "var(--color-muted-fg)" }}
                              />
                            </Flex>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ScrollWrap>
              </CardBody>
            </Card>
          </DesktopTable>

          {/* ═══ MOBILE CARDS ═══ */}
          <MobileCards>
            {transfers.map((envio) => (
              <EnvioCard
                key={envio.id}
                onClick={() => navigate(`/envios/${envio.id}/recibo`)}
              >
                <CardBody>
                  <CardTop>
                    <ReciboBadge>{envio.reference_number}</ReciboBadge>
                    <StatusBadge
                      $estado={
                        STATUS_TO_BADGE_KEY[envio.status] ?? envio.status
                      }
                    >
                      {STATUS_LABELS[envio.status] ?? envio.status}
                    </StatusBadge>
                  </CardTop>

                  <CardPeople>
                    <PersonRow>
                      <User size={14} />
                      <span className="label">De:</span>
                      <span className="name">{envio.sender_name}</span>
                    </PersonRow>
                    <PersonRow>
                      <Users size={14} />
                      <span className="label">Para:</span>
                      <span className="name">{envio.beneficiary_name}</span>
                    </PersonRow>
                  </CardPeople>

                  <CardMontoRow>
                    <MontoBlock>
                      <MontoLabel>Enviado</MontoLabel>
                      <MontoValue>
                        {Number(envio.amount_sent).toLocaleString("es-DO", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {envio.from_currency}
                      </MontoValue>
                    </MontoBlock>
                    <MontoArrow>
                      <ArrowRightLeft size={16} />
                    </MontoArrow>
                    <MontoBlock>
                      <MontoLabel>Recibido</MontoLabel>
                      <MontoValue>
                        {Number(envio.amount_received).toLocaleString("es-DO", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {envio.to_currency}
                      </MontoValue>
                    </MontoBlock>
                  </CardMontoRow>

                  <CardFooter>
                    <CardDate>
                      <Calendar size={12} />
                      {formatCardDate(envio.created_at)}
                    </CardDate>
                    <Flex $gap="0.6rem" $align="center">
                      <Printer
                        size={15}
                        style={{ color: "var(--color-muted-fg)" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setReprintTarget(envio);
                        }}
                      />
                      <Eye
                        size={15}
                        style={{ color: "var(--color-muted-fg)" }}
                      />
                    </Flex>
                  </CardFooter>
                </CardBody>
              </EnvioCard>
            ))}
          </MobileCards>

          {/* ═══ PAGINACIÓN ═══ */}
          <Flex
            $justify="space-between"
            $align="center"
            $wrap
            style={{ marginTop: "1rem" }}
          >
            <span
              style={{ fontSize: "0.75rem", color: "var(--color-muted-fg)" }}
            >
              Página {page} de {totalPages} — {totalCount} en total
            </span>
            <Flex $gap="0.4rem">
              <Button
                $variant="outline"
                $size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft size={14} /> Anterior
              </Button>
              <Button
                $variant="outline"
                $size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Siguiente <ChevronRight size={14} />
              </Button>
            </Flex>
          </Flex>
        </>
      )}

      <ReceiptPreviewModal
        open={!!reprintTarget}
        receipt={reprintTarget}
        onClose={() => setReprintTarget(null)}
      />
    </PageWrapper>
  );
}
