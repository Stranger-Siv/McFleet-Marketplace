// Discord-inspired theme constants
export const theme = {
  colors: {
    bg: {
      primary: '#36393f',
      secondary: '#2f3136',
      tertiary: '#202225',
      hover: '#40444b',
      input: '#40444b',
    },
    text: {
      primary: '#dcddde',
      secondary: '#b9bbbe',
      muted: '#72767d',
    },
    accent: {
      primary: '#5865f2',
      primaryHover: '#4752c4',
      success: '#3ba55d',
      danger: '#ed4245',
      warning: '#faa61a',
    },
    border: '#40444b',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.2)',
    md: '0 4px 8px rgba(0, 0, 0, 0.3)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.4)',
  },
};

// Common component styles
export const commonStyles = {
  card: {
    backgroundColor: theme.colors.bg.secondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: '20px',
    boxShadow: theme.shadows.md,
  },
  button: {
    primary: {
      backgroundColor: theme.colors.accent.primary,
      color: '#ffffff',
      border: 'none',
      borderRadius: theme.borderRadius.md,
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    success: {
      backgroundColor: theme.colors.accent.success,
      color: '#ffffff',
    },
    danger: {
      backgroundColor: theme.colors.accent.danger,
      color: '#ffffff',
    },
    secondary: {
      backgroundColor: theme.colors.bg.hover,
      color: theme.colors.text.primary,
    },
  },
  input: {
    backgroundColor: theme.colors.bg.input,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: '10px',
    color: theme.colors.text.primary,
    fontSize: '14px',
  },
  table: {
    backgroundColor: theme.colors.bg.secondary,
    borderCollapse: 'collapse',
    width: '100%',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: theme.colors.bg.tertiary,
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '600',
    color: theme.colors.text.primary,
    borderBottom: `1px solid ${theme.colors.border}`,
    fontSize: '14px',
  },
  tableCell: {
    padding: '12px 16px',
    borderBottom: `1px solid ${theme.colors.border}`,
    color: theme.colors.text.primary,
    fontSize: '14px',
  },
  tableRow: {
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.colors.bg.hover,
    },
  },
};

