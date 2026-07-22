import styled from 'styled-components';
import { Card } from '@/styles/components';

export const SearchBar = styled.div`
  position: relative;
  margin-bottom: 1rem;
  svg { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--color-muted-fg); }
  input { padding-left: 2.5rem; }
`;

export const RemitenteCard = styled(Card)`
  transition: all 0.15s ease;
  &:hover { border-color: var(--color-primary); }
`;

export const RemitenteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const RemitenteInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const RemitenteName = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-fg);
  margin-bottom: 0.25rem;
`;

export const RemitenteMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.75rem;
  color: var(--color-muted-fg);
  span { display: flex; align-items: center; gap: 0.25rem; }
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
  background: rgba(0,0,0,0.4);
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
  svg { margin: 0 auto 0.75rem; opacity: 0.5; }
  h3 { font-size: 1rem; color: var(--color-fg); margin-bottom: 0.25rem; }
  p { font-size: 0.8rem; }
`;
