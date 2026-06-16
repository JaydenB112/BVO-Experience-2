/**
 * canvas.manifest.js
 * BVO Experience 2 — Screen & Section layout manifest.
 * Used by useScreenInit to resolve ?mp_screen= query param → initial state.
 */
export const manifest = {
  screens: {
    scr_5tbx7k: {
      name: "Hero — The Universe",
      route: "/",
      state: { currentFrame: 0 },
      position: { x: 160, y: 220 },
    },
    scr_g3gemd: {
      name: "Planet Close-up",
      route: "/",
      state: { currentFrame: 1 },
      position: { x: 1560, y: 220 },
    },
    scr_ys92n4: {
      name: "The Meridian",
      route: "/",
      state: { currentFrame: 2 },
      position: { x: 2960, y: 220 },
    },
    scr_kvb3zx: {
      name: "Layer 2 Zoom",
      route: "/",
      state: { currentFrame: 3 },
      position: { x: 4360, y: 220 },
    },
  },
  sections: {
    sec_oalmux: {
      name: "Space Exploration Flow",
      x: 0,
      y: 0,
      width: 5720,
      height: 1180,
    },
  },
  layers: [
    {
      kind: "section",
      id: "sec_oalmux",
      children: [
        { kind: "screen", id: "scr_5tbx7k" },
        { kind: "screen", id: "scr_g3gemd" },
        { kind: "screen", id: "scr_ys92n4" },
        { kind: "screen", id: "scr_kvb3zx" },
      ],
    },
  ],
}
