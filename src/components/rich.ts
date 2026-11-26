// 3D dot only on wide screens without reduced-motion; everyone else gets flat CSS dots. Evaluated once.
export const rich = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches
