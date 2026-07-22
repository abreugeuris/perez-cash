import { useMemo } from "react";
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { shipmentsController } from "@/backend/controllers/shipmentsController";
import {
  PageWrapper,
  PageTitle,
  PageSubtitle,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Flex,
} from "@/styles/components";
import { Send, TrendingUp, CalendarDays, DollarSign } from "lucide-react";
import {
  KPIGrid,
  KPIValue,
  KPILabel,
  KPITrend,
  KPIIcon,
  ChartCard,
} from "./styles/dashboardStyled";

function formatCurrency(amount) {
  console.log("formatCurrency called with amount:", amount);
  if (amount < 0 && (amount = 0)) {
    return `RD$ 0.00`;
  }
  return `RD$ ${amount.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Dashboard() {
  const envios = useMemo(() => shipmentsController.getAll(), []);
  let kpis = useMemo(() => shipmentsController.getKPIs(), []);

  kpis = { ...kpis, gananciasMes: 0 };

  const todayEnvios = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    return envios.filter((e) => {
      const date = new Date(e.fecha);
      return isWithinInterval(date, { start: todayStart, end: todayEnd });
    });
  }, [envios]);

  const monthEnvios = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    return envios.filter((e) => {
      const date = new Date(e.fecha);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    });
  }, [envios]);

  const revenue = kpis.gananciasMes * 0.03;

  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      const dayEnvios = envios.filter((e) => {
        const d = new Date(e.fecha);
        return isWithinInterval(d, { start: dayStart, end: dayEnd });
      });
      days.push({
        day: format(date, "EEE", { locale: es }),
        date: format(date, "d MMM", { locale: es }),
        count: dayEnvios.length,
        total: dayEnvios.reduce((s, e) => s + e.montoEnviado, 0),
      });
    }
    return days;
  }, [envios]);

  const stats = [
    {
      label: "Envíos Hoy",
      value: todayEnvios.length,
      icon: Send,
      trend:
        todayEnvios.length > 0
          ? `${todayEnvios.filter((e) => e.estado === "completado").length} completados`
          : "Sin envíos hoy",
      bg: "var(--color-primary-soft)",
      color: "var(--color-primary)",
    },
    {
      label: "Envíos del Mes",
      value: monthEnvios.length,
      icon: CalendarDays,
      trend: `${monthEnvios.filter((e) => e.estado === "completado").length} completados de ${monthEnvios.length}`,
      bg: "var(--color-success-soft)",
      color: "var(--color-success)",
    },
    {
      label: "Ganancias del Mes",
      value: formatCurrency(revenue),
      icon: DollarSign,
      trend: `Comisión 3% sobre RD$ ${monthEnvios.reduce((s, e) => s + e.montoEnviado, 0).toLocaleString("es-DO", { minimumFractionDigits: 2 })}`,
      bg: "var(--color-accent-soft)",
      color: "var(--color-accent)",
    },
  ];

  return (
    <PageWrapper>
      <PageTitle>Panel Principal</PageTitle>
      <PageSubtitle>
        Resumen de actividad de remesas ·{" "}
        {format(new Date(), "d 'de' MMMM, yyyy", { locale: es })}
      </PageSubtitle>

      <KPIGrid $cols={3} $colsMd={3} $gap="1rem">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardBody>
              <Flex $justify="space-between" $align="flex-start" $gap="1rem">
                <div>
                  <KPILabel>{stat.label}</KPILabel>
                  <KPIValue>{stat.value}</KPIValue>
                  <KPITrend>
                    <TrendingUp size={12} />
                    {stat.trend}
                  </KPITrend>
                </div>
                <KPIIcon $bg={stat.bg} $color={stat.color}>
                  <stat.icon size={18} />
                </KPIIcon>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </KPIGrid>

      <ChartCard>
        <CardHeader>
          <CardTitle>Últimos 7 Días · Envíos por Día</CardTitle>
        </CardHeader>
        <CardBody>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="day"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                  stroke="var(--color-muted-fg)"
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  stroke="var(--color-muted-fg)"
                />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)", opacity: 0.3 }}
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                    fontSize: "13px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.date ?? ""
                  }
                  formatter={(value) => [`${value} envíos`, "Cantidad"]}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </ChartCard>
    </PageWrapper>
  );
}
