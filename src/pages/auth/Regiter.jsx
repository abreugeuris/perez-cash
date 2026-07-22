import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  Input,
  Label,
  Divider,
  Flex,
} from "@/styles/components";
import {
  Wrapper,
  FormCard,
  Brand,
  FormGroup,
  Row,
  Err,
} from "./styles/registerStyled";

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setError("Complete todos los campos.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const ok = await doRegister({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (ok) navigate("/dashboard", { replace: true });
    else setError("Hubo un error al crear la cuenta.");
  };

  return (
    <Wrapper>
      <FormCard>
        <CardHeader>
          <Brand>
            <h1>
              Perez <span style={{ color:"#F47B34"}}>Cash</span>
            </h1>
            <p>Crear cuenta nueva</p>
          </Brand>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Row>
              <FormGroup>
                <Label>Nombre</Label>
                <Input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Carlos"
                />
              </FormGroup>
              <FormGroup>
                <Label>Apellido</Label>
                <Input
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Ej: Pérez"
                />
              </FormGroup>
            </Row>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </FormGroup>
            <FormGroup>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </FormGroup>
            <FormGroup>
              <Label>Confirmar contraseña</Label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repita la contraseña"
              />
            </FormGroup>
            {error && <Err>{error}</Err>}
            <Button
              type="submit"
              $fullWidth
              disabled={loading}
              style={{ marginTop: "0.75rem" }}
            >
              {loading ? "Creando..." : "Crear Cuenta"}
            </Button>
          </form>
          <Divider $my="1rem" />
          <Flex $justify="center">
            <Link
              to="/auth/login"
              style={{
                fontSize: "0.8rem",
                color: "var(--color-primary)",
                textDecoration: "none",
              }}
            >
              ¿Ya tiene cuenta? Iniciar Sesión
            </Link>
          </Flex>
        </CardBody>
      </FormCard>
    </Wrapper>
  );
}
