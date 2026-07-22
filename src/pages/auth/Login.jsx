import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  Input,
  Label,
  Flex,
  Divider,
} from "@/styles/components";
import {
  Wrapper,
  LoginCard,
  BrandBlock,
  FormGroup,
  ErrorMsg,
  HintBox,
} from "./styles/loginStyled";

export default function Login() {

  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Complete todos los campos.");
      return;
    }
    setLoading(true);
    const ok = await login(email.trim(), password);
    setLoading(false);
    if (ok) navigate(from, { replace: true });
    else setError("Credenciales inválidas. Verifique su email y contraseña.");
  };

  return (
    <Wrapper>
      <LoginCard>
        <CardHeader>
          <BrandBlock>
            <img src="/logo.png" alt="Perez Cash" />
            <h1>
              Perez <span className="accent">Cash</span>
            </h1>
            {/* <p>Gestión de remesas RD ↔ Haití</p> */}
          </BrandBlock>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@remesaflow.com"
                autoComplete="email"
              />
            </FormGroup>
            <FormGroup>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                autoComplete="current-password"
              />
            </FormGroup>
            {error && <ErrorMsg>{error}</ErrorMsg>}
            <Button
              type="submit"
              $fullWidth
              disabled={loading}
              style={{ marginTop: "0.75rem" }}
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
          </form>

          <Divider $my="1rem" />

          <Flex $justify="space-between" $align="center">
            <Link
              to="/auth/register"
              style={{
                fontSize: "0.8rem",
                color: "var(--color-primary)",
                textDecoration: "none",
              }}
            >
              Crear cuenta
            </Link>
            <Link
              to="/auth/recuperar"
              style={{
                fontSize: "0.8rem",
                color: "var(--color-muted-fg)",
                textDecoration: "none",
              }}
            >
              ¿Olvidó su contraseña?
            </Link>
          </Flex>

          {/* <HintBox style={{ marginTop: "1rem" }}>
            <strong>Demo:</strong> admin@perezcash.com / admin123 ·
            operador@perezcash.com / operador123
          </HintBox> */}
        </CardBody>
      </LoginCard>
    </Wrapper>
  );
}
