import styled from "styled-components";
import { Card } from "@/styles/components";

export const Wrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 1rem;
`;

export const LoginCard = styled(Card)`
  width: 100%;
  max-width: 420px;
`;

export const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  gap: 0.5rem;

  font-family: "Lora", Georgia, serif;

  img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a3b8c;
  }

  .accent {
    color: #f47b34;
  }

  p {
    margin: 0;
    font-size: 0.8rem;
    color: var(--color-muted-fg);
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 0.75rem;
`;
export const ErrorMsg = styled.p`
  font-size: 0.75rem;
  color: var(--color-destructive);
  margin-top: 0.25rem;
`;

export const HintBox = styled.div`
  background: color-mix(in srgb, var(--color-primary) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
  border-radius: var(--radius);
  padding: 0.75rem;
  font-size: 0.7rem;
  color: var(--color-muted-fg);
  strong {
    color: var(--color-fg);
  }
`;
