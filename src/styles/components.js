import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  max-width: 1400px;

  margin: 0 auto;

  padding: 32px;

  @media (max-width: 768px) {
    padding: 16px 16px 90px;
  }
`;

export const PageTitle = styled.h1`
  font-family: "Lora", Georgia, serif;

  font-size: 2rem;

  font-weight: 700;

  color: var(--color-fg);

  margin-bottom: 0.35rem;

  line-height: 1.2;
`;

export const PageSubtitle = styled.p`
  font-size: 0.95rem;

  color: var(--color-muted-fg);

  margin-bottom: 1.75rem;
`;

export const Card = styled.div`
  background: var(--color-card);

  border: 1px solid var(--color-border);

  border-radius: var(--radius);

  box-shadow: var(--shadow-sm);

  overflow: hidden;
`;

export const CardHeader = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 18px 22px;

  border-bottom: 1px solid var(--color-border);
`;

export const CardTitle = styled.h3`
  font-family: "DM Sans", sans-serif;

  font-size: 1.05rem;

  font-weight: 600;

  color: var(--color-fg);
`;

export const CardBody = styled.div`
  padding: 22px;
`;

export const Button = styled.button`
  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 0.5rem;

  padding: 0.55rem 1rem;

  border-radius: var(--radius);

  border: 1px solid transparent;

  font-family: "DM Sans", sans-serif;

  font-size: 0.875rem;

  font-weight: 600;

  cursor: pointer;

  transition: all 0.15s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $variant }) => {
    switch ($variant) {
      case "outline":
        return `
          background: transparent;
          border-color: var(--color-border);
          color: var(--color-fg);

          &:hover:not(:disabled){
            background: var(--color-muted);
          }
        `;

      case "ghost":
        return `
          background: transparent;
          color: var(--color-muted-fg);

          &:hover:not(:disabled){
            background: var(--color-muted);
            color: var(--color-fg);
          }
        `;

      case "destructive":
        return `
          background: var(--color-destructive);
          color: var(--color-destructive-fg);

          &:hover:not(:disabled){
            opacity:.9;
          }
        `;

      case "accent":
        return `
          background: var(--color-accent);
          color: var(--color-accent-fg);

          &:hover:not(:disabled){
            opacity:.9;
          }
        `;

      default:
        return `
          background: var(--color-primary);
          color: var(--color-primary-fg);

          &:hover:not(:disabled){
            opacity:.9;
          }
        `;
    }
  }}

  ${({ $size }) => {
    switch ($size) {
      case "sm":
        return `
          padding:.35rem .75rem;
          font-size:.8rem;
        `;

      case "lg":
        return `
          padding:.7rem 1.5rem;
          font-size:1rem;
        `;

      default:
        return "";
    }
  }}


  ${({ $fullWidth }) =>
    $fullWidth &&
    `
      width:100%;
    `}


  ${({ $rounded }) =>
    $rounded &&
    `
      border-radius:999px;
    `}
`;

export const Input = styled.input`
  width: 100%;

  padding: 0.65rem 0.8rem;

  border: 1px solid var(--color-border);

  border-radius: var(--radius);

  font-size: 0.875rem;

  font-family: "DM Sans", sans-serif;

  color: var(--color-fg);

  background: var(--color-card);

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    outline: none;

    border-color: var(--color-primary);

    box-shadow: 0 0 0 3px var(--color-primary-soft);
  }

  &::placeholder {
    color: var(--color-muted-fg);
  }
`;

export const Select = styled.select`
  width: 100%;

  padding: 0.65rem 0.8rem;

  padding-right: 2.5rem;

  border: 1px solid var(--color-border);

  border-radius: var(--radius);

  font-size: 0.875rem;

  font-family: "DM Sans", sans-serif;

  color: var(--color-fg);

  background: var(--color-card);

  cursor: pointer;

  appearance: none;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23667085'%3E%3Cpath d='M6 8L1 3h10z'/%3E%3C/svg%3E");

  background-repeat: no-repeat;

  background-position: right 0.8rem center;

  &:focus {
    outline: none;

    border-color: var(--color-primary);
  }
`;

export const Label = styled.label`
  display: block;

  font-size: 0.85rem;

  font-weight: 600;

  color: var(--color-fg);

  margin-bottom: 0.35rem;
`;

export const Badge = styled.span`
  display: inline-flex;

  align-items: center;

  padding: 0.2rem 0.65rem;

  border-radius: 999px;

  font-size: 0.75rem;

  font-weight: 600;

  ${({ $variant }) => {
    switch ($variant) {
      case "success":
        return `
          background:var(--color-success-soft);
          color:var(--color-success);
        `;

      case "warning":
        return `
          background:var(--color-warning-soft);
          color:var(--color-warning);
        `;

      case "destructive":
        return `
          background:var(--color-danger-soft);
          color:var(--color-destructive);
        `;

      case "primary":
        return `
          background:var(--color-primary-soft);
          color:var(--color-primary);
        `;

      default:
        return `
          background:var(--color-muted);
          color:var(--color-muted-fg);
        `;
    }
  }}
`;

export const Flex = styled.div`
  display: flex;

  ${({ $gap }) => $gap && `gap:${$gap};`}

  ${({ $align }) => $align && `align-items:${$align};`}


  ${({ $justify }) => $justify && `justify-content:${$justify};`}


  ${({ $wrap }) => $wrap && "flex-wrap:wrap;"}


  ${({ $col }) => $col && "flex-direction:column;"}
`;

export const Grid = styled.div`
  display: grid;

  gap: ${({ $gap }) => $gap || "24px"};

  grid-template-columns: repeat(${({ $cols }) => $cols || 1}, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(${({ $colsMd }) => $colsMd || 1}, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Spinner = styled.div`
  width: ${({ $size }) => $size || "24px"};

  height: ${({ $size }) => $size || "24px"};

  border: 2px solid var(--color-border);

  border-top-color: var(--color-primary);

  border-radius: 50%;

  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Divider = styled.hr`
  border: none;

  border-top: 1px solid var(--color-border);

  margin: ${({ $my }) => $my || ".5rem"} 0;
`;
