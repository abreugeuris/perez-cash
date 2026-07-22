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

export const FormCard = styled(Card)`
  width: 100%;
  max-width: 440px;
`;

export const Brand = styled.div`
  text-align: center;
  h1 {
    font-family: "Lora", Georgia, serif;
    font-size: 1.5rem;
    color: var(--color-accent);
    font-weight: 700;
  }
  p {
    font-size: 0.8rem;
    color: var(--color-muted-fg);
    margin-top: 0.25rem;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 0.75rem;
`;
export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;
export const Err = styled.p`
  font-size: 0.75rem;
  color: var(--color-destructive);
  margin-top: 0.25rem;
`;
