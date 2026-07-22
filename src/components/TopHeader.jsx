
import {
  HeaderBar,
  HeaderTop,
  Brand,
  LogoImg,
  AvatarBtn,
  Avatar,
} from "@/components/styles/topHeaderStyled";

export default function TopHeader() {
  const user ={ nombre: "John", apellido: "Doe", rol: "admin" };

  const doLogout = () => {
    signOut();
    window.location.href = "/auth/login";
  };

  const initials = user
    ? `${user.nombre?.[0] || ""}${user.apellido?.[0] || ""}`
    : "??";

  return (
    <HeaderBar>
      <HeaderTop>
        <LogoImg src="/logo.png" alt="Perez Cash" />
        <Brand>Perez Cash</Brand>
      </HeaderTop>
      <AvatarBtn onClick={doLogout} title="Cerrar sesión">
        <Avatar>{initials}</Avatar>
      </AvatarBtn>
    </HeaderBar>
  );
}
