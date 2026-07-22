import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
import { toast } from "sonner";
// import { shipmentsController } from "@/backend/controllers/shipmentsController";
// import { sendersController } from "@/backend/controllers/sendersController";
// import { beneficiariesController } from "@/backend/controllers/beneficiariesController";
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
  Label,
  Badge,
  Flex,
  Grid,
} from "@/styles/components";
import {
  Search,
  ArrowUpDown,
  Send,
  Eye,
  Inbox,
  ArrowRightLeft,
  Calendar,
  User,
  Users,
} from "lucide-react";

const ESTADO_LABELS = {
  completado: "Completado",
  pendiente: "Pendiente",
  cancelado: "Cancelado",
};

export default function ShipmentsHistory() {
  const navigate = useNavigate();
  const [envios] = useState([]);
  const [remitentes] = useState([]);
  const [beneficiarios] = useState([]);

  const [estadoFilter, setEstadoFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  const getName = (type, id) => {
    if (type === "remitente") {
      const r = remitentes.find((x) => x.id === id);
      return r ? `${r.nombre} ${r.apellido}` : "—";
    }
    const b = beneficiarios.find((x) => x.id === id);
    return b ? `${b.nombre} ${b.apellido}` : "—";
  };

  const filteredEnvios = useMemo(() => {
    let result = [...envios];
    if (estadoFilter) result = result.filter((e) => e.estado === estadoFilter);
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((e) => {
        const remName = getName("remitente", e.remitenteId).toLowerCase();
        const benName = getName("beneficiario", e.beneficiarioId).toLowerCase();
        return remName.includes(term) || benName.includes(term);
      });
    }
    if (dateFrom) result = result.filter((e) => e.fecha >= dateFrom);
    if (dateTo) {
      const toEnd = dateTo + "T23:59:59.999Z";
      result = result.filter((e) => e.fecha <= toEnd);
    }
    result.sort((a, b) => {
      const cmp = new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      return sortAsc ? -cmp : cmp;
    });
    return result;
  }, [envios, estadoFilter, searchTerm, dateFrom, dateTo, sortAsc]);

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
            {filteredEnvios.length} envío
            {filteredEnvios.length !== 1 ? "s" : ""} encontrado
            {filteredEnvios.length !== 1 ? "s" : ""}
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
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <StyledSelect
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="completado">Completado</option>
              <option value="pendiente">Pendiente</option>
              <option value="cancelado">Cancelado</option>
            </StyledSelect>
            <StyledDate
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              title="Fecha desde"
            />
            <StyledDate
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              title="Fecha hasta"
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
        </CardBody>
      </FiltersBar>

      {filteredEnvios.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyWrap>
              <Inbox size={48} />
              <h3>Sin envíos</h3>
              <p>
                {searchTerm || estadoFilter || dateFrom || dateTo
                  ? "No se encontraron envíos con los filtros actuales."
                  : "Aún no hay remesas registradas."}
              </p>
              {!searchTerm && !estadoFilter && !dateFrom && !dateTo && (
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
                      {filteredEnvios.map((envio) => (
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
                            RF-{envio.id.replace("env_", "")}
                          </td>
                          <td style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                            {getName("remitente", envio.remitenteId)}
                          </td>
                          <td style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                            {getName("beneficiario", envio.beneficiarioId)}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.7rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            RD${" "}
                            {envio.montoEnviado.toLocaleString("es-DO", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.7rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {envio.montoRecibido.toLocaleString("es-DO", {
                              minimumFractionDigits: 2,
                            })}{" "}
                            HTG
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <StatusBadge $estado={envio.estado}>
                              {ESTADO_LABELS[envio.estado] || envio.estado}
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
                            {format(new Date(envio.fecha), "dd/MM/yy HH:mm", {
                              locale: es,
                            })}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <Eye
                              size={14}
                              style={{ color: "var(--color-muted-fg)" }}
                            />
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
            {filteredEnvios.map((envio) => (
              <EnvioCard
                key={envio.id}
                onClick={() => navigate(`/envios/${envio.id}/recibo`)}
              >
                <CardBody>
                  <CardTop>
                    <ReciboBadge>RF-{envio.id.replace("env_", "")}</ReciboBadge>
                    <StatusBadge $estado={envio.estado}>
                      {ESTADO_LABELS[envio.estado] || envio.estado}
                    </StatusBadge>
                  </CardTop>

                  <CardPeople>
                    <PersonRow>
                      <User size={14} />
                      <span className="label">De:</span>
                      <span className="name">
                        {getName("remitente", envio.remitenteId)}
                      </span>
                    </PersonRow>
                    <PersonRow>
                      <Users size={14} />
                      <span className="label">Para:</span>
                      <span className="name">
                        {getName("beneficiario", envio.beneficiarioId)}
                      </span>
                    </PersonRow>
                  </CardPeople>

                  <CardMontoRow>
                    <MontoBlock>
                      <MontoLabel>Enviado</MontoLabel>
                      <MontoValue>
                        RD${" "}
                        {envio.montoEnviado.toLocaleString("es-DO", {
                          minimumFractionDigits: 2,
                        })}
                      </MontoValue>
                    </MontoBlock>
                    <MontoArrow>
                      <ArrowRightLeft size={16} />
                    </MontoArrow>
                    <MontoBlock>
                      <MontoLabel>Recibido</MontoLabel>
                      <MontoValue>
                        {envio.montoRecibido.toLocaleString("es-DO", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        HTG
                      </MontoValue>
                    </MontoBlock>
                  </CardMontoRow>

                  <CardFooter>
                    <CardDate>
                      <Calendar size={12} />
                      {format(new Date(envio.fecha), "d MMM, HH:mm", {
                        locale: es,
                      })}
                    </CardDate>
                    <Eye size={15} style={{ color: "var(--color-muted-fg)" }} />
                  </CardFooter>
                </CardBody>
              </EnvioCard>
            ))}
          </MobileCards>
        </>
      )}
    </PageWrapper>
  );
}
