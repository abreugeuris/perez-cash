import styled from "styled-components";

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ModeToggle = styled.div`
  display: flex;
  gap: 0.25rem;
  background: var(--color-muted);
  border-radius: var(--radius);
  padding: 0.2rem;
  margin-bottom: 1rem;
`;

export const ModeBtn = styled.button.attrs({ type: "button" })`
  flex: 1;
  padding: 0.4rem 0.75rem;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: "DM Sans", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  ${({ $active }) =>
    $active
      ? "background: var(--color-card); color: var(--color-fg); box-shadow: var(--shadow-sm);"
      : "background: transparent; color: var(--color-muted-fg); &:hover { color: var(--color-fg); }"}
`;

export const FieldError = styled.p`
  font-size: 0.65rem;
  color: var(--color-destructive);
  margin-top: 0.15rem;
`;

export const SelectedInfo = styled.div`
  background: color-mix(in srgb, var(--color-muted) 40%, transparent);
  border-radius: var(--radius);
  padding: 0.75rem;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  p {
    margin-bottom: 0.2rem;
  }
  span.label {
    color: var(--color-muted-fg);
  }
  span.value {
    font-weight: 500;
    color: var(--color-fg);
  }
`;

export const AmountPreview = styled.div`
  background: color-mix(in srgb, var(--color-accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 20%, transparent);
  border-radius: var(--radius);
  padding: 1rem;
  text-align: center;
`;

export const AmountLabel = styled.div`
  font-size: 0.7rem;
  color: var(--color-muted-fg);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  margin-bottom: 0.35rem;
`;

export const AmountValue = styled.div`
  font-family: "DM Sans", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent);
`;

export const StepBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius);
  font-size: 0.65rem;
  font-weight: 700;
  ${({ $accent }) =>
    $accent
      ? "background: color-mix(in srgb, var(--color-accent) 12%, transparent); color: var(--color-accent);"
      : "background: color-mix(in srgb, var(--color-primary) 12%, transparent); color: var(--color-primary);"}
`;

export const FormGroup = styled.div`
  margin-bottom: 0.6rem;
`;
