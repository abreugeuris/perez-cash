import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const LayoutWrap = styled.div`
  display: flex;
  min-height: 100dvh;
  padding-bottom: env(safe-area-inset-bottom, 0);
`;

export const MainContent = styled.main`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const BottomTabBar = styled.nav`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: #0A1628;
    border-top: 1px solid #162440;
    padding: 0.25rem 0.5rem;
    padding-bottom: calc(0.25rem + env(safe-area-inset-bottom, 0px));
    justify-content: space-around;
    align-items: center;
    height: 60px;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
  }
`;

export const TabItem = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  text-decoration: none;
  color: rgba(255,255,255,0.55);
  font-size: 0.6rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  min-width: 56px;
  transition: all 0.15s ease;
  position: relative;

  svg { transition: all 0.15s ease; }

  &.active {
    color: #F47B34;
    font-weight: 700;
    svg { stroke-width: 2.5px; }
  }

  &:active { transform: scale(0.92); }
`;

export const FloatingFab = styled(NavLink)`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 80px;
    left: 16px;
    z-index: 60;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--color-accent);
    color: var(--color-accent-fg);
    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.08);
      box-shadow: 0 8px 28px rgba(0,0,0,0.3);
    }
    &:active { transform: scale(0.92); }
    &.active {
      background: var(--color-primary);
      box-shadow: 0 6px 24px color-mix(in srgb, var(--color-primary) 40%, transparent);
    }
  }
`;
