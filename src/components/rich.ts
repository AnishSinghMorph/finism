// 3D dot everywhere except for visitors who ask for reduced motion (they get a static CSS sphere). Evaluated once.
export const rich = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
