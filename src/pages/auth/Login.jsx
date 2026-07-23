import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
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
import { loginUser, clearAuthError } from "@/store/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async ({ email, password }) => {
    dispatch(clearAuthError());
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard"); // ajusta a tu ruta real del Dashboard
    }
    // si falla, el error ya queda disponible en state.auth.error
  };

  const isLoading = status === "loading";

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@remesaflow.com"
                autoComplete="email"
                {...register("email", { required: "El email es obligatorio" })}
              />
              {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                autoComplete="current-password"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
              />
              {errors.password && (
                <ErrorMsg>{errors.password.message}</ErrorMsg>
              )}
            </FormGroup>
            {error && <ErrorMsg>{error}</ErrorMsg>}
            <Button
              type="submit"
              $fullWidth
              disabled={isLoading}
              style={{ marginTop: "0.75rem" }}
            >
              {isLoading ? "Ingresando..." : "Iniciar Sesión"}
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
