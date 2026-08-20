import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

export default {
    darkMode: "class",
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "inverse-surface": "#213145",
                "on-secondary-fixed-variant": "#005048",
                "surface": "#f8f9ff",
                "on-tertiary-fixed-variant": "#802a00",
                "on-primary": "#ffffff",
                "surface-container-low": "#eff4ff",
                "secondary-container": "#6df5e1",
                "on-tertiary-fixed": "#380d00",
                "surface-container-highest": "#d3e4fe",
                "on-tertiary": "#ffffff",
                "primary-fixed": "#dde1ff",
                "on-error": "#ffffff",
                "tertiary": "#611e00",
                "on-surface": "#0b1c30",
                "on-secondary-container": "#006f64",
                "on-primary-container": "#a8b8ff",
                "on-primary-fixed": "#001453",
                "inverse-primary": "#b8c4ff",
                "background": "#f8f9ff",
                "secondary-fixed-dim": "#4fdbc8",
                "error": "#ba1a1a",
                "tertiary-fixed-dim": "#ffb59a",
                "primary-container": "#1e40af",
                "on-primary-fixed-variant": "#173bab",
                "surface-variant": "#d3e4fe",
                "secondary": "#006b5f",
                "surface-container": "#e5eeff",
                "inverse-on-surface": "#eaf1ff",
                "surface-tint": "#3755c3",
                "on-tertiary-container": "#ffa583",
                "on-secondary-fixed": "#00201c",
                "primary": "#00288e",
                "error-container": "#ffdad6",
                "on-secondary": "#ffffff",
                "secondary-fixed": "#71f8e4",
                "surface-container-lowest": "#ffffff",
                "surface-dim": "#cbdbf5",
                "outline": "#757684",
                "on-error-container": "#93000a",
                "on-surface-variant": "#444653",
                "tertiary-fixed": "#ffdbce",
                "surface-container-high": "#dce9ff",
                "on-background": "#0b1c30",
                "primary-fixed-dim": "#b8c4ff",
                "outline-variant": "#c4c5d5",
                "tertiary-container": "#872d00",
                "surface-bright": "#f8f9ff"
            },
            "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            "spacing": {
                "base": "4px",
                "margin-mobile": "1rem",
                "margin-desktop": "2.5rem",
                "md": "1rem",
                "xs": "0.25rem",
                "gutter": "1.5rem",
                "lg": "1.5rem",
                "xl": "2.5rem",
                "sm": "0.5rem"
            },
            "fontFamily": {
                "headline-lg-mobile": ["Inter", "sans-serif"],
                "label-sm": ["Inter", "sans-serif"],
                "body-sm": ["Inter", "sans-serif"],
                "body-md": ["Inter", "sans-serif"],
                "headline-lg": ["Inter", "sans-serif"],
                "body-lg": ["Inter", "sans-serif"],
                "display-lg": ["Inter", "sans-serif"],
                "label-md": ["Inter", "sans-serif"],
                "headline-md": ["Inter", "sans-serif"]
            },
            "fontSize": {
                "headline-lg-mobile": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "600" }],
                "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
                "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
                "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                "label-md": ["14px", { "lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "500" }],
                "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }]
            }
        }
    },
    plugins: [
        forms,
        containerQueries
    ]
}
