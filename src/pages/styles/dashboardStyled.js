import styled from "styled-components";
import { Grid, Card } from "@/styles/components";

export const KPIGrid = styled(Grid)`
  margin: 1.5rem 0;
  gap: 1.5rem;
`;

export const KPILabel = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: #475467;
  margin-bottom: 0.35rem;
`;

export const KPIValue = styled.div`
  font-family: "DM Sans", sans-serif;
  font-size: 2.3rem;
  font-weight: 700;
  line-height: 1;
  color: #101828;
  margin: 0.2rem 0 0.5rem;
`;

export const KPITrend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;

  font-size: 0.8rem;
  color: #667085;

  svg {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
  }
`;

export const KPIIcon = styled.div`
  width: 44px;
  height: 44px;

  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
  }
`;

export const ChartCard = styled(Card)`
  margin-top: 0;
`;
