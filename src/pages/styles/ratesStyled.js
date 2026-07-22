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

export const TasaCard = styled(Card)`
  transition: all 0.15s ease;
  ${({ $inactive }) => $inactive && "opacity: 0.55;"}
  &:hover {
    border-color: var(--color-primary);
    opacity: 1;
  }
`;

export const TasaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const TasaInfo = styled.div`
  flex: 1;
  min-width: 0;
`;
export const TasaRate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-family: "DM Sans", sans-serif;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

export const TasaDesc = styled.p`
  font-size: 0.75rem;
  color: var(--color-muted-fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
`;

export const TasaBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  ${({ $active }) =>
    $active
      ? "background: color-mix(in srgb, var(--color-success) 15%, transparent); color: var(--color-success);"
      : "background: var(--color-muted); color: var(--color-muted-fg);"}
`;

export const ToggleBtn = styled.button`
  width: 36px;
  height: 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
  ${({ $on }) =>
    $on
      ? "background: var(--color-success);"
      : "background: var(--color-border);"}
  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: ${({ $on }) => ($on ? "18px" : "2px")};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    transition: left 0.2s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
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
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-muted-fg);
  svg {
    margin: 0 auto 0.75rem;
    opacity: 0.5;
  }
  h3 {
    font-size: 1rem;
    color: var(--color-fg);
    margin-bottom: 0.25rem;
  }
  p {
    font-size: 0.8rem;
  }
`;
