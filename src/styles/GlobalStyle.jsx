import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --color-bg: #FAFAFA;
    --color-card: #FFFFFF;

    --color-fg: #101828;
    --color-muted-fg: #667085;

    --color-border: #E6E8EC;
    --color-muted: #F2F4F7;

    --color-primary: #3157D5;
    --color-primary-soft: #EEF4FF;
    --color-primary-fg: #FFFFFF;

    --color-success: #16A34A;
    --color-success-soft: #ECFDF3;
    --color-success-fg: #FFFFFF;

    --color-accent: #F97316;
    --color-accent-soft: #FFF4ED;
    --color-accent-fg: #FFFFFF;


    --color-warning: #F59E0B;
    --color-warning-soft: #FFFAEB;
    --color-warning-fg: #FFFFFF;


    --color-destructive: #D92D20;
    --color-danger-soft: #FEF3F2;
    --color-destructive-fg: #FFFFFF;


    --color-sidebar: #0A1628;
    --color-sidebar-fg: #E0E6F0;
    --color-sidebar-border: #162440;



    --radius: 10px;



    --shadow-sm: 0 1px 2px rgba(16,24,40,.05);
    --shadow-md: 0 4px 12px rgba(16,24,40,.08);
    --shadow-lg: 0 8px 24px rgba(16,24,40,.12);

    font-family: "DM Sans", system-ui, sans-serif;
  }


  .dark {

    --color-bg: #0D1520;
    --color-card: #111D2B;

    --color-fg: #E4E7EC;
    --color-muted-fg: #98A2B3;

    --color-border: #2A3545;
    --color-muted: #1A2535;

    --color-primary: #4B74F3;
    --color-primary-soft: rgba(75,116,243,.15);
    --color-primary-fg: #FFFFFF;

    --color-success: #22C55E;
    --color-success-soft: rgba(34,197,94,.15);
    --color-success-fg: #FFFFFF;

    --color-accent: #F97316;
    --color-accent-soft: rgba(249,115,22,.15);
    --color-accent-fg: #FFFFFF;

    --color-warning: #F59E0B;
    --color-warning-soft: rgba(245,158,11,.15);
    --color-warning-fg: #FFFFFF;

    --color-destructive: #D92D20;
    --color-danger-soft: rgba(217,45,32,.15);
    --color-destructive-fg: #FFFFFF;

    --color-sidebar: #0A1628;
    --color-sidebar-fg: #E0E6F0;
    --color-sidebar-border: #162440;
  }


  html {
    height: 100%;
  }

  body {
    min-height: 100dvh;
    background: var(--color-bg);
    color: var(--color-fg);

    font-family: "DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

    line-height: 1.5;

    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  #root {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  @media print {

    @page {
      size: 58mm auto;
      margin: 0;
    }

    .receipt-print {
      width: 58mm;
      font-size: 10px;
      padding: 4mm;
    }

    .no-print {
      display: none !important;
    }

  }

  @media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
      animation-duration: .01ms !important;
      transition-duration: .01ms !important;
    }

  }

`;

export default GlobalStyle;
