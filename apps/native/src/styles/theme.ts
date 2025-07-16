const sharedColors = {
    azureRadiance: '#007AFF',
    limedSpruce: '#38434D',
    cornflowerBlue: '#6366F1',
    astral: '#2E78B7',
} as const;

const utils = {
    spacing: (value: number) => value * 4,
};

const widths = {
    sm: 320,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
    '3xl': 1920,
} as const;

export const lightTheme = {
    utils,
    widths,
    colors: {
        ...sharedColors,
        typography: '#f5f5f5',
        background: '#0a0a0a',
        backgroundSecondary: '#e5e5e5',
    },
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12,
    },
} as const;

export const darkTheme = {
    utils,
    widths,
    colors: {
        ...sharedColors,
        typography: '#f5f5f5',
        background: '#0a0a0a',
        backgroundSecondary: '#171717',
    },
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12,
    },
} as const;
