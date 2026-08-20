import { useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import {
  Home,
  Users,
  History,
  DollarSign,
  PlusCircle,
  UserCheck,
} from "lucide-react";
import {
  LayoutWrap,
  MainContent,
  BottomTabBar,
  TabItem,
  FloatingFab,
} from "@/components/styles/layoutStyled";

const SIDEBAR_KEY = "remesaflow_collapsed";

const TABS = [
  { to: "/dashboard", icon: Home, label: "Inicio" },
  { to: "/remitentes", icon: Users, label: "Remitentes" },
  { to: "/beneficiarios", icon: UserCheck, label: "Beneficiarios" },
  { to: "/tasas", icon: DollarSign, label: "Tasas" },
  { to: "/envios/historial", icon: History, label: "Historial" },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_KEY) === "true",
  );
  const location = useLocation();

  const isNuevoEnvio = location.pathname === "/envios/nuevo";

  const toggle = useCallback(() => {
    setCollapsed((v) => {
      localStorage.setItem(SIDEBAR_KEY, !v);
      return !v;
    });
  }, []);

  return (
    <LayoutWrap>
      <Sidebar collapsed={collapsed} onToggle={toggle} />

      <MainContent>
        <TopHeader />

        <Outlet />

        {!isNuevoEnvio && (
          <FloatingFab to="/envios/nuevo">
            <PlusCircle size={26} />
          </FloatingFab>
        )}

        <BottomTabBar>
          {TABS.map(({ to, icon: Icon, label }) => (
            <TabItem key={to} to={to} end={to === "/dashboard"}>
              <Icon size={22} />
              <span>{label}</span>
            </TabItem>
          ))}
        </BottomTabBar>
      </MainContent>
    </LayoutWrap>
  );
}
