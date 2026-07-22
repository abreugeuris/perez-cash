import styled from "styled-components";
import { Card } from "@/styles/components";

/* ─── Filters ─── */
export const FiltersBar = styled(Card)`
  margin-bottom: 1rem;
`;

export const StyledSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 0.8rem;
  font-family: "DM Sans", sans-serif;
  color: var(--color-fg);
  background: var(--color-card);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%235a6b7d'%3E%3Cpath d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  padding-right: 1.75rem;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

export const StyledDate = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 0.8rem;
  font-family: "DM Sans", sans-serif;
  color: var(--color-fg);
  background: var(--color-card);
  width: 140px;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

/* ─── DESKTOP TABLE ─── */
export const DesktopTable = styled.div`
  display: block;
  @media (max-width: 768px) {
    display: none;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  th {
    text-align: left;
    padding: 0.6rem 0.75rem;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-muted-fg);
    background: color-mix(in srgb, var(--color-muted) 40%, transparent);
    border-bottom: 1px solid var(--color-border);
  }
  td {
    padding: 0.6rem 0.75rem;
    border-bottom: 1px solid var(--color-border);
  }
  tr {
    cursor: pointer;
    transition: background 0.1s;
  }
  tr:hover {
    background: color-mix(in srgb, var(--color-primary) 4%, transparent);
  }
  tr:nth-child(even) {
    background: color-mix(in srgb, var(--color-muted) 20%, transparent);
  }
  tr:nth-child(even):hover {
    background: color-mix(in srgb, var(--color-primary) 4%, transparent);
  }
`;

export const ScrollWrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

/* ─── MOBILE CARDS ─── */
export const MobileCards = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const EnvioCard = styled(Card)`
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    border-color: var(--color-primary);
  }
  &:active {
    transform: scale(0.985);
  }
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

export const ReciboBadge = styled.span`
  font-family: "DM Mono", monospace;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
`;

export const CardPeople = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.5rem;
`;

export const PersonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: var(--color-fg);

  svg {
    color: var(--color-muted-fg);
    flex-shrink: 0;
  }
  span.label {
    color: var(--color-muted-fg);
    font-size: 0.68rem;
    margin-right: 0.2rem;
  }
  span.name {
    font-weight: 600;
  }
`;

export const CardMontoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: color-mix(in srgb, var(--color-muted) 30%, transparent);
  border-radius: var(--radius);
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
`;

export const MontoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

export const MontoLabel = styled.span`
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-muted-fg);
`;

export const MontoValue = styled.span`
  font-family: "DM Mono", monospace;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-fg);
`;

export const MontoArrow = styled.div`
  color: var(--color-muted-fg);
  display: flex;
  align-items: center;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CardDate = styled.span`
  font-size: 0.7rem;
  color: var(--color-muted-fg);
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-weight: 600;
  ${({ $estado }) => {
    switch ($estado) {
      case "completado":
        return "background: color-mix(in srgb, var(--color-success) 15%, transparent); color: var(--color-success);";
      case "pendiente":
        return "background: color-mix(in srgb, var(--color-warning) 15%, transparent); color: var(--color-warning);";
      case "cancelado":
        return "background: color-mix(in srgb, var(--color-destructive) 15%, transparent); color: var(--color-destructive);";
      default:
        return "background: var(--color-muted); color: var(--color-muted-fg);";
    }
  }}
`;

export const EmptyWrap = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  svg {
    margin: 0 auto 0.75rem;
    opacity: 0.4;
  }
  h3 {
    font-size: 1rem;
    color: var(--color-fg);
    margin-bottom: 0.25rem;
  }
  p {
    font-size: 0.8rem;
    color: var(--color-muted-fg);
  }
`;
