import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const SidebarWrap = styled.aside`
  width: ${({ $collapsed }) => ($collapsed ? '3rem' : '15rem')};
  min-width: ${({ $collapsed }) => ($collapsed ? '3rem' : '15rem')};
  background: var(--color-sidebar);
  border-right: 1px solid var(--color-sidebar-border);
  display: flex;
  flex-direction: column;
  height: 100dvh;
  position: sticky;
  top: 0;
  transition: width 0.2s ease;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: ${({ $collapsed }) => ($collapsed ? '0.75rem 0.5rem' : '0.75rem 0.75rem')};
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'space-between')};
  border-bottom: 1px solid var(--color-sidebar-border);
  min-height: 52px;
`;

export const Brand = styled.span`
  font-family: 'Lora', Georgia, serif;
  font-weight: 700;
  font-size: 0.85rem;
  color: #F47B34;
  display: ${({ $hidden }) => ($hidden ? 'none' : 'block')};
`;

export const LogoImg = styled.img`
  width: 28px; height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const SidebarNav = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
`;

export const SidebarFooter = styled.div`
  border-top: 1px solid var(--color-sidebar-border);
  padding: ${({ $collapsed }) => ($collapsed ? '0.5rem' : '0.75rem')};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  ${({ $collapsed }) => $collapsed && 'flex-direction: column;'}
`;

export const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: ${({ $collapsed }) => ($collapsed ? '0.4rem' : '0.45rem 0.75rem')};
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  border-radius: var(--radius);
  font-size: 0.82rem;
  text-decoration: none;
  color: rgba(255,255,255,0.65);
  transition: all 0.15s ease;
  margin-bottom: 2px;
  &:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }
  &.active { background: rgba(244,123,52,0.18); color: #F47B34; font-weight: 600; }
  span { display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')}; }
`;

export const IconBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-muted-fg);
  padding: 0.25rem;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: var(--color-muted); color: var(--color-fg); }
`;

export const UserInfo = styled.div`
  display: ${({ $hidden }) => ($hidden ? 'none' : 'block')};
  font-size: 0.75rem;
  p { font-weight: 600; line-height: 1.2; }
  small { color: var(--color-muted-fg); }
`;

export const Avatar = styled.div`
  width: 28px; height: 28px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
