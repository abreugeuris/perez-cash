import styled from "styled-components";
import { Card } from "@/styles/components";

export const SearchBar = styled.div`
  position: relative;
  margin-bottom: 1rem;
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-muted-fg);
  }
  input {
    padding-left: 2.5rem;
  }
`;

export const BenCard = styled(Card)`
  transition: all 0.15s ease;
  &:hover {
    border-color: var(--color-primary);
  }
`;

export const BenRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const BenInfo = styled.div`
  flex: 1;
  min-width: 0;
`;
export const BenName = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-fg);
  margin-bottom: 0.25rem;
`;
export const BenMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  font-size: 0.75rem;
  color: var(--color-muted-fg);
  span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 50;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
`;

export const ModalCard = styled(Card)`
  width: 100%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
`;

export const FormGroup = styled.div`
  margin-bottom: 0.75rem;
`;
export const ErrorMsg = styled.p`
  font-size: 0.7rem;
  color: var(--color-destructive);
  margin-top: 0.15rem;
`;

export const EmptyState = styled.div`
  min-height: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
  color: var(--color-muted-fg);

  svg {
    margin-bottom: 1rem;
    color: var(--color-muted-fg);
    opacity: 0.55;
  }

  h3 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-fg);
    font-family: "DM Sans", sans-serif;
  }

  p {
    margin: 0;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
    color: var(--color-muted-fg);
  }
`;

export const CountryFlag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  span.flag {
    display: inline-block;
    width: 18px;
    height: 12px;
    border-radius: 2px;
    border: 1px solid var(--color-border);
  }
`;
