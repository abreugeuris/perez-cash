import { useState } from "react";
import { Link } from "react-router-dom";
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
  SuccessBox,
} from "./styles/recoveryStyled";
import { CheckCircle } from "lucide-react";
import { BrandBlock } from "./styles/loginStyled";

export default function Recovery() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSent(true);
  };

  return (
    <Wrapper>
      <FormCard>
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
          {sent ? (
            <SuccessBox>
              <CheckCircle />
              <p>
                Se enviaron instrucciones a <strong>{email}</strong>
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-muted-fg)",
                  marginTop: "0.5rem",
                }}
              >
                Revise su bandeja de entrada y siga el enlace para restablecer
                su contraseña.
              </p>
            </SuccessBox>
          ) : (
            <form onSubmit={handleSubmit}>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--color-muted-fg)",
                  marginBottom: "1rem",
                }}
              >
                Ingrese su email y le enviaremos instrucciones para restablecer
                su contraseña.
              </p>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </FormGroup>
              <Button type="submit" $fullWidth style={{ marginTop: "0.5rem" }}>
                Enviar Instrucciones
              </Button>
            </form>
          )}
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
              Volver al inicio de sesión
            </Link>
          </Flex>
        </CardBody>
      </FormCard>
    </Wrapper>
  );
}
