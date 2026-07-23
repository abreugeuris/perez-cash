import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  DollarSign,
  Send,
  History,
  LogOut,
  PanelLeft,
} from "lucide-react";
import {
  SidebarWrap,
  SidebarHeader,
  Brand,
  LogoImg,
  SidebarNav,
  SidebarFooter,
  NavItem,
  IconBtn,
  UserInfo,
  Avatar,
} from "@/components/styles/sidebarStyled";
import { logoutUser } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/remitentes", icon: Users, label: "Remitentes" },
  { to: "/beneficiarios", icon: UserCheck, label: "Beneficiarios" },
  { to: "/tasas", icon: DollarSign, label: "Tasas" },
  { to: "/envios/nuevo", icon: Send, label: "Nuevo Envío" },
  { to: "/envios/historial", icon: History, label: "Historial" },
];

export default function Sidebar({ collapsed, onToggle }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const doLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };
  const user = { nombre: "John", apellido: "Doe", rol: "admin" };

  const initials = user
    ? `${user.nombre?.[0] || ""}${user.apellido?.[0] || ""}`
    : "??";
  const fullName = user ? `${user.nombre} ${user.apellido}` : "Usuario";
  const role = user?.rol === "admin" ? "Administrador" : "Operador";

  return (
    <SidebarWrap $collapsed={collapsed}>
      <SidebarHeader $collapsed={collapsed}>
        <LogoImg src="/logo.png" alt="Perez Cash" />
        <Brand $hidden={collapsed}>Perez Cash</Brand>
        <IconBtn onClick={onToggle} title={collapsed ? "Expandir" : "Colapsar"}>
          <PanelLeft
            size={16}
            style={{
              transform: collapsed ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </IconBtn>
      </SidebarHeader>

      <SidebarNav>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavItem key={to} to={to} $collapsed={collapsed}>
            <Icon size={16} />
            <span>{label}</span>
          </NavItem>
        ))}
      </SidebarNav>

      <SidebarFooter $collapsed={collapsed}>
        <Avatar>{initials}</Avatar>
        <UserInfo $hidden={collapsed}>
          <p>{fullName}</p>
          <small>{role}</small>
        </UserInfo>
        <IconBtn
          onClick={doLogout}
          title="Cerrar sesión"
          style={collapsed ? { marginTop: "0.25rem" } : { marginLeft: "auto" }}
        >
          <LogOut size={16} />
        </IconBtn>
      </SidebarFooter>
    </SidebarWrap>
  );
}
