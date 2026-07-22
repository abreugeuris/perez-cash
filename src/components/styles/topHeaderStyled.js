import styled from "styled-components";

export const HeaderBar = styled.header`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0 1rem;
    height: 48px;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg);
    position: sticky;
    top: 0;
    z-index: 40;
  }
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Brand = styled.span`
  font-family: "Lora", Georgia, serif;
  font-weight: 700;
  font-size: 0.85rem;
  color: #f47b34;
`;

export const LogoImg = styled.img`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
`;

export const AvatarBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;
