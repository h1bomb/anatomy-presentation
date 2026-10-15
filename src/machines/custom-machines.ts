import * as k from "../kit/iso-kit.ts";

const W = 1120;
const H = 860;

const S = (paths: k.SolidPaths, style?: any) => k.solidSvg(paths, style);
const L = (d: string, style?: any) => k.lineSvg(d, style);
const D = (points: k.Flat[], style?: any) => k.dotsSvg(points, style);
const G = (children: string | string[], extra: any = {}) => k.groupSvg(children, extra);

function makeBenchBase(P: k.Projection, plate = { x: -135, y: -88, w: 270, d: 176, r: 10 }, plateH = 12, footH = 6, labelText = "ANATOMY BENCH") {
  const at = (pt: k.Point3) => k.iso(pt, P);
  const byDepth = (pts: k.Plane[]) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  const out = [`<path class="iso-halo" d="${k.haloOf(plate, -plateH - footH, plateH, P)}"/>`];

  for (const [x, y] of byDepth(k.corners(plate, 20))) {
    out.push(S(k.cylinder(x, y, 8, -plateH - footH, 2, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 6.2, -plateH - footH + 2, footH - 2, P, 28), { tone: "mid" }));
  }

  out.push(S(k.slabOf(plate, -plateH, plateH, P, 8, 1.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(plate, 5), 0, P), { tone: "lo" }));
  out.push(L(k.sideSeam(plate, -plateH / 2, P), { tone: "faint" }));

  const screws = k.corners(plate, 11);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.4, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.55, tone: "hi" }));

  const strip = { x: plate.x + 18, y: plate.y + plate.d - 16, w: plate.w - 36, d: 8, r: 1.2 };
  out.push(S(k.slabOf(strip, 0, 0.8, P, 4), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 6, strip.x + strip.w - 6, 4, 5, strip.y + 1, 0.8, [2.2, 4.2], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));

  const badge = { x: plate.x + 18, y: plate.y + 10, w: 66, d: 14, r: 1.5 };
  out.push(S(k.slabOf(badge, 0, 1.0, P, 4), { tone: "lo", crease: "none" }));
  out.push(k.faceTextSvg(k.topMatrix([badge.x + 5, badge.y + 9], 1.1, P), labelText, { size: 4.2, tone: "hi" }));
  return out.join("");
}

function gearRing(cx: number, cy: number, rOuter: number, rInner: number, teeth: number, phaseRad: number = 0): k.Plane[] {
  const pts: k.Plane[] = [];
  const total = teeth * 4;
  for (let i = 0; i < total; i++) {
    const a = phaseRad + (i / total) * Math.PI * 2;
    const mod = i % 4;
    const r = mod === 0 || mod === 1 ? rOuter : rInner;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

function buildWatchEscapement() {
  const plate = { x: -140, y: -92, w: 280, d: 184, r: 12 };
  const P = k.fitProjection([...k.boxCorners(plate, -18, 95)], W, H, { pad: 70, azimuth: 43, elevation: 32 });
  const at = (pt: any) => k.iso(pt, P);
  const [ux, uy] = k.axisVector(P, [1, 0, 0]);
  const [vx, vy] = k.axisVector(P, [0, 1, 0]);
  const [zx, zy] = k.axisVector(P, [0, 0, 1]);

  const out = [makeBenchBase(P, plate, 12, 6, "CALIBRE 15T · CH01")];

  // Brass movement mainplate
  out.push(S(k.cylinder(0, -4, 76, 0, 6, P, 48, 1.0), { tone: "mid" }));
  out.push(L(k.ring(0, -4, 70, 6, P, 48), { tone: "lo" }));
  out.push(L(k.radialTicks(0, -4, 70, 60, 5, 6, [2.2, 4.5], P).minor, { tone: "faint" }));
  out.push(L(k.radialTicks(0, -4, 70, 60, 5, 6, [2.2, 4.5], P).major, { tone: "lo" }));

  // Power reserve 8-segment indicator on left
  const reserveSegs = [];
  for (let i = 0; i < 8; i++) {
    const segPlan = { x: -118, y: -52 + i * 11, w: 24, d: 8, r: 1.2 };
    reserveSegs.push(
      G(S(k.slabOf(segPlan, 0, 3 + i * 0.7, P, 4, 0.4), { tone: i >= 5 ? "hi" : "mid", lit: i === 7 }), {
        "data-anim": `reserve-${i}`,
      })
    );
  }
  out.push(G(reserveSegs, { "data-anim": "reserve-bank" }));

  // Crown & winding stem on left-front
  const crownGroup = [];
  crownGroup.push(S(k.slabOf({ x: -102, y: -12, w: 32, d: 10, r: 2 }, 6, 8, P, 4, 0.5), { tone: "mid" }));
  crownGroup.push(S(k.cylinder(-112, -7, 13, 4, 14, P, 32, 0.8), { tone: "hi" }));
  crownGroup.push(L(k.knurl(-112, -7, 13, 4, 18, 28, P), { tone: "lo" }));
  crownGroup.push(L(k.radialTicks(-112, -7, 11, 12, 3, 18, [2, 3.8], P).major, { tone: "hi" }));
  const [crownCx, crownCy] = at([-112, -7, 11]);
  out.push(G(crownGroup, { "data-anim": "crown-assembly", "data-cx": crownCx.toFixed(1), "data-cy": crownCy.toFixed(1) }));

  // Mainspring barrel & ratchet wheel
  const barrelGroup = [];
  barrelGroup.push(S(k.cylinder(-42, -18, 26, 6, 9, P, 36, 0.6), { tone: "mid" }));
  barrelGroup.push(S(k.extrude(gearRing(-42, -18, 23, 19.5, 18), 15, 3.5, P, { convex: false }), { tone: "hi" }));
  barrelGroup.push(S(k.cylinder(-42, -18, 6, 18.5, 4, P, 24), { tone: "mid" }));
  const [barCx, barCy] = at([-42, -18, 17]);
  out.push(G(barrelGroup, { "data-anim": "barrel-wheel", "data-cx": barCx.toFixed(1), "data-cy": barCy.toFixed(1) }));

  // Center wheel (1 rph) and seconds wheel (1 rpm)
  const centerGroup = [];
  centerGroup.push(S(k.extrude(gearRing(-2, 16, 22, 18.5, 16), 8, 3.2, P, { convex: false }), { tone: "mid" }));
  centerGroup.push(S(k.cylinder(-2, 16, 4.5, 6, 14, P, 20), { tone: "hi" }));
  const [cenCx, cenCy] = at([-2, 16, 11]);
  out.push(G(centerGroup, { "data-anim": "center-wheel", "data-cx": cenCx.toFixed(1), "data-cy": cenCy.toFixed(1) }));

  // 15-Tooth Escapement Wheel (The Lit Subject)
  const escGroup = [];
  escGroup.push(S(k.extrude(gearRing(32, -14, 24, 17.5, 15), 11, 4.2, P, { convex: false }), { tone: "hi", lit: true }));
  escGroup.push(S(k.cylinder(32, -14, 5.5, 6, 14, P, 24), { tone: "hi", lit: true }));
  escGroup.push(D([at([32, -14, 20])], { size: 0.9, tone: "hi" }));
  const [escCx, escCy] = at([32, -14, 14]);
  out.push(G(escGroup, { "data-anim": "escape-wheel", "data-cx": escCx.toFixed(1), "data-cy": escCy.toFixed(1) }));

  // Pallet Fork (擒纵叉)
  const forkGroup = [];
  forkGroup.push(S(k.slabOf({ x: 8, y: -38, w: 30, d: 7, r: 2 }, 12, 3.5, P, 4, 0.4), { tone: "hi", lit: true }));
  forkGroup.push(S(k.cylinder(14, -34.5, 4.5, 6, 11, P, 20), { tone: "mid" }));
  const [forkCx, forkCy] = at([14, -34.5, 13.5]);
  out.push(G(forkGroup, { "data-anim": "pallet-fork", "data-cx": forkCx.toFixed(1), "data-cy": forkCy.toFixed(1) }));

  // Balance wheel & hairspring coil
  const balGroup = [];
  balGroup.push(S(k.cylinder(42, 26, 22, 14, 3.5, P, 36, 0.5), { tone: "hi" }));
  const hair = k.coil(16, 23, [42, 26], 10, 3, "y", P, 16);
  balGroup.push(L(hair.back, { tone: "lo" }), L(hair.front, { tone: "hi" }));
  balGroup.push(S(k.cylinder(42, 26, 4.2, 6, 18, P, 24), { tone: "hi", lit: true }));
  const [balCx, balCy] = at([42, 26, 16]);
  out.push(G(balGroup, { "data-anim": "balance-wheel", "data-cx": balCx.toFixed(1), "data-cy": balCy.toFixed(1) }));

  // Support pillars for top bridge
  for (const [px, py] of [[-52, -48], [52, -48], [-52, 42], [52, 42]]) {
    out.push(S(k.cylinder(px, py, 3.8, 6, 20, P, 20), { tone: "mid" }));
  }

  // Lifting Top Bridge (按 E 键升起的夹板)
  const bridgeGroup = [];
  bridgeGroup.push(S(k.slabOf({ x: -58, y: -54, w: 116, d: 34, r: 6 }, 26, 6, P, 6, 0.8), { tone: "mid" }));
  bridgeGroup.push(S(k.slabOf({ x: -24, y: -20, w: 82, d: 66, r: 6 }, 26, 6, P, 6, 0.8), { tone: "mid" }));
  for (const [bx, by] of [[-42, -18], [32, -14], [42, 26], [-2, 16]]) {
    bridgeGroup.push(L(k.ring(bx, by, 5, 32, P, 20), { tone: "hi" }));
    bridgeGroup.push(D([at([bx, by, 32])], { size: 0.7, tone: "hi" }));
  }
  bridgeGroup.push(k.faceTextSvg(k.topMatrix([-48, -36], 32.2, P), "15 JEWELS · 60:1 TRAIN", { size: 4.2, tone: "hi" }));
  out.push(
    G(bridgeGroup, {
      "data-anim": "top-bridge",
      "data-zx": zx.toFixed(3),
      "data-zy": zy.toFixed(3),
      "data-ux": ux.toFixed(3),
      "data-uy": uy.toFixed(3),
      "data-vx": vx.toFixed(3),
      "data-vy": vy.toFixed(3),
    })
  );

  return {
    svg: k.figureSvg({ width: W, height: H, label: "Mechanical Watch Escapement", body: out }),
    meta: { key: "watch-escapement" },
  };
}

function buildBoxToMachine() {
  const plate = { x: -142, y: -90, w: 284, d: 180, r: 10 };
  const P = k.fitProjection([...k.boxCorners(plate, -18, 92)], W, H, { pad: 68, azimuth: 44, elevation: 30 });
  const at = (pt: any) => k.iso(pt, P);
  const [ux, uy] = k.axisVector(P, [1, 0, 0]);
  const [zx, zy] = k.axisVector(P, [0, 0, 1]);

  const out = [makeBenchBase(P, plate, 12, 6, "ACTUATOR RIG · CH02")];

  // Real physical machine: twin piston push-pull + polling cam gearbox
  const machineGroup = [];
  // Guide rails
  for (const ry of [-36, 18]) {
    machineGroup.push(S(k.slabOf({ x: -108, y: ry, w: 216, d: 7, r: 1.5 }, 0, 5, P, 4, 0.5), { tone: "mid" }));
    machineGroup.push(D([-96, -48, 0, 48, 96].map((rx) => at([rx, ry + 3.5, 5])), { size: 0.45, tone: "lo" }));
  }

  // Left Cylinder Block A (Source)
  const blockA = { x: -112, y: -30, w: 58, d: 44, r: 5 };
  machineGroup.push(S(k.slabOf(blockA, 5, 28, P, 6, 1.0), { tone: "mid" }));
  machineGroup.push(S(k.cylinder(-83, -8, 14, 33, 8, P, 28, 0.6), { tone: "hi" }));
  machineGroup.push(L(k.radialTicks(-83, -8, 12, 16, 4, 41, [1.8, 3.4], P).major, { tone: "hi" }));
  machineGroup.push(k.faceTextSvg(k.topMatrix([-104, 6], 33.2, P), "NODE A · PUMP", { size: 4.2, tone: "hi" }));

  // Right Cylinder Block B (Target)
  const blockB = { x: 54, y: -30, w: 58, d: 44, r: 5 };
  machineGroup.push(S(k.slabOf(blockB, 5, 28, P, 6, 1.0), { tone: "mid" }));
  machineGroup.push(S(k.cylinder(83, -8, 14, 33, 8, P, 28, 0.6), { tone: "hi" }));
  machineGroup.push(L(k.radialTicks(83, -8, 12, 16, 4, 41, [1.8, 3.4], P).major, { tone: "hi" }));
  machineGroup.push(k.faceTextSvg(k.topMatrix([62, 6], 33.2, P), "NODE B · VALVE", { size: 4.2, tone: "hi" }));

  // Sliding Push/Pull Piston Carriage in the middle
  const pistonGroup = [];
  pistonGroup.push(S(k.slabOf({ x: -54, y: -16, w: 108, d: 16, r: 3 }, 14, 8, P, 4, 0.5), { tone: "hi", lit: true }));
  pistonGroup.push(S(k.slabOf({ x: -24, y: -26, w: 48, d: 36, r: 4 }, 8, 22, P, 6, 0.8), { tone: "hi", lit: true }));
  const springCoil = k.coil(-50, 50, [-8, 18], 7, 7, "x", P, 14);
  pistonGroup.push(L(springCoil.back, { tone: "lo" }), L(springCoil.front, { tone: "lit" }));
  machineGroup.push(G(pistonGroup, { "data-anim": "piston-a", "data-ux": ux.toFixed(3), "data-uy": uy.toFixed(3) }));

  // Polling Cam Rotor at rear
  const rotorGroup = [];
  rotorGroup.push(S(k.extrude(gearRing(0, -56, 24, 19, 14), 6, 6, P, { convex: false }), { tone: "hi" }));
  rotorGroup.push(S(k.cylinder(0, -56, 7, 12, 8, P, 24, 0.5), { tone: "hi", lit: true }));
  const [rotCx, rotCy] = at([0, -56, 15]);
  machineGroup.push(G(rotorGroup, { "data-anim": "gear-rotor", "data-cx": rotCx.toFixed(1), "data-cy": rotCy.toFixed(1) }));

  out.push(G(machineGroup, { "data-anim": "real-machine", "data-zx": zx.toFixed(3), "data-zy": zy.toFixed(3) }));

  // Floating Flat Box-and-Arrow Anti-pattern Plate above (Fades/folds away in Beat 2)
  const flatGroup = [];
  const slabA = { x: -96, y: 34, w: 58, d: 28, r: 2 };
  const slabB = { x: 38, y: 34, w: 58, d: 28, r: 2 };
  flatGroup.push(S(k.slabOf(slabA, 38, 1.5, P, 4), { tone: "lo", flat: true }));
  flatGroup.push(S(k.slabOf(slabB, 38, 1.5, P, 4), { tone: "lo", flat: true }));
  flatGroup.push(k.wireSvg(at([-38, 48, 39.5]), at([38, 48, 39.5]), { tone: "red", dashed: true, flow: true }));
  flatGroup.push(k.faceTextSvg(k.topMatrix([-82, 52], 40, P), "BOX A", { size: 5.5, tone: "hi" }));
  flatGroup.push(k.faceTextSvg(k.topMatrix([52, 52], 40, P), "BOX B", { size: 5.5, tone: "hi" }));
  flatGroup.push(k.faceTextSvg(k.topMatrix([-28, 44], 40, P), "PUSH? PULL? POLL?", { size: 4.5, tone: "hi" }));
  out.push(G(flatGroup, { "data-anim": "flat-diagram", "data-zx": zx.toFixed(3), "data-zy": zy.toFixed(3) }));

  return {
    svg: k.figureSvg({ width: W, height: H, label: "Box and Arrow vs Real Mechanism", body: out }),
    meta: { key: "box-to-machine" },
  };
}

function buildPipelineGantry() {
  const plate = { x: -155, y: -88, w: 310, d: 176, r: 10 };
  const P = k.fitProjection([...k.boxCorners(plate, -18, 96)], W, H, { pad: 62, azimuth: 42, elevation: 30 });
  const at = (pt: any) => k.iso(pt, P);
  const [ux, uy] = k.axisVector(P, [1, 0, 0]);
  const [zx, zy] = k.axisVector(P, [0, 0, 1]);

  const out = [makeBenchBase(P, plate, 12, 6, "10-STEP PIPELINE · CH06")];

  // Three Tier Calibration Weights on Rear Left (Figure / Hero / Epic)
  const tiers = [
    { x: -132, y: -70, w: 28, d: 24, h: 12, label: "FIG 40-80" },
    { x: -96, y: -70, w: 28, d: 24, h: 22, label: "HERO 150" },
    { x: -60, y: -70, w: 28, d: 24, h: 34, label: "EPIC 6H+" },
  ];
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    out.push(
      G(
        [
          S(k.slabOf({ x: t.x, y: t.y, w: t.w, d: t.d, r: 3 }, 0, t.h, P, 4, 0.6), { tone: i === 1 ? "hi" : "mid" }),
          S(k.cylinder(t.x + t.w / 2, t.y + t.d / 2, 4.5, t.h, 4, P, 20), { tone: "hi" }),
          k.faceTextSvg(k.topMatrix([t.x + 3, t.y + 15], t.h + 0.2, P), t.label, { size: 3.3, tone: "hi" }),
        ],
        { "data-anim": `tier-weight-${i}` }
      )
    );
  }

  // Long guide rails for 10 stations
  out.push(S(k.slabOf({ x: -138, y: -26, w: 276, d: 6, r: 1.2 }, 0, 4, P, 4, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf({ x: -138, y: 28, w: 276, d: 6, r: 1.2 }, 0, 4, P, 4, 0.4), { tone: "mid" }));

  // 10 Pipeline Stations along X (-126 to +126)
  for (let i = 0; i < 10; i++) {
    const sx = -126 + i * 26.5;
    const isFirstFour = i < 4;
    const stPlan = { x: sx, y: -18, w: 21, d: 42, r: 2.5 };
    const stH = isFirstFour ? 14 : 9;
    const stParts = [
      S(k.slabOf(stPlan, 0, stH, P, 4, 0.5), { tone: isFirstFour ? "hi" : "mid", lit: isFirstFour }),
      S(k.cylinder(sx + 10.5, 3, 5.2, stH, isFirstFour ? 6 : 3.5, P, 20), { tone: "hi", lit: isFirstFour }),
      k.faceTextSvg(k.topMatrix([sx + 4, 18], stH + 0.2, P), `S${i + 1}`, { size: 3.8, tone: "hi" }),
    ];
    out.push(G(stParts, { "data-anim": `station-${i}` }));
  }

  // Sliding Overhead Gantry Bridge
  const gantry = [];
  gantry.push(S(k.slabOf({ x: -16, y: -32, w: 32, d: 70, r: 3 }, 4, 6, P, 4, 0.5), { tone: "mid" }));
  gantry.push(S(k.slabOf({ x: -8, y: -30, w: 16, d: 8, r: 2 }, 10, 38, P, 4, 0.5), { tone: "mid" }));
  gantry.push(S(k.slabOf({ x: -8, y: 28, w: 16, d: 8, r: 2 }, 10, 38, P, 4, 0.5), { tone: "mid" }));
  gantry.push(S(k.slabOf({ x: -12, y: -32, w: 24, d: 70, r: 3 }, 48, 7, P, 4, 0.7), { tone: "hi", lit: true }));
  gantry.push(S(k.cylinder(0, 3, 9, 34, 14, P, 28, 0.6), { tone: "hi", lit: true }));
  gantry.push(L(k.knurl(0, 3, 9, 35, 47, 24, P), { tone: "lo" }));
  out.push(
    G(gantry, {
      "data-anim": "gantry-carriage",
      "data-ux": ux.toFixed(3),
      "data-uy": uy.toFixed(3),
    })
  );

  // Step 10 Critic 4x Magnifier Lens Assembly on Right End
  const critic = [];
  critic.push(S(k.cylinder(118, -54, 6, 0, 42, P, 24), { tone: "mid" }));
  critic.push(S(k.slabOf({ x: 96, y: -58, w: 28, d: 8, r: 2 }, 38, 5, P, 4), { tone: "mid" }));
  critic.push(S(k.cylinder(96, -24, 18, 36, 4, P, 32, 0.5), { tone: "hi", lit: true }));
  critic.push(L(k.ring(96, -24, 14, 40.2, P, 32), { tone: "lit" }));
  out.push(G(critic, { "data-anim": "critic-lens", "data-zx": zx.toFixed(3), "data-zy": zy.toFixed(3) }));

  return {
    svg: k.figureSvg({ width: W, height: H, label: "10-Step Pipeline Gantry", body: out }),
    meta: { key: "pipeline-gantry" },
  };
}

function buildMetaphorCarousel() {
  const plate = { x: -148, y: -96, w: 296, d: 192, r: 12 };
  const P = k.fitProjection([...k.boxCorners(plate, -18, 88)], W, H, { pad: 64, azimuth: 45, elevation: 32 });
  const at = (pt: any) => k.iso(pt, P);
  const [zx, zy] = k.axisVector(P, [0, 0, 1]);

  const out = [makeBenchBase(P, plate, 12, 6, "5 METAPHORS · CH07")];

  // Central indexing turntable
  out.push(S(k.cylinder(0, 0, 96, 0, 7, P, 48, 1.0), { tone: "mid" }));
  out.push(L(k.radialTicks(0, 0, 92, 40, 8, 7, [2.5, 5], P).major, { tone: "lo" }));
  out.push(S(k.cylinder(0, 0, 18, 7, 16, P, 32, 0.8), { tone: "hi" }));
  out.push(L(k.knurl(0, 0, 18, 8, 22, 28, P), { tone: "lo" }));

  // 5 Metaphor mini-machines arranged around the turntable
  const centers = [
    { x: -62, y: -42, title: "MOD-8 PIGEONHOLE" },
    { x: 56, y: -46, title: "BLOOM 3-REEL SLOT" },
    { x: -64, y: 38, title: "MUTEX KEY TANK" },
    { x: 0, y: 58, title: "TCP ROPEWAY" },
    { x: 64, y: 34, title: "TEMP ROULETTE" },
  ];

  centers.forEach((c, idx) => {
    const parts = [];
    const padPlan = { x: c.x - 28, y: c.y - 20, w: 56, d: 40, r: 4 };
    parts.push(S(k.slabOf(padPlan, 7, 5, P, 4, 0.5), { tone: "mid" }));

    if (idx === 0) {
      // 1. Hash Sorter: 8 pigeonholes
      for (let slot = 0; slot < 4; slot++) {
        parts.push(S(k.slabOf({ x: c.x - 22 + slot * 11, y: c.y - 12, w: 9, d: 24, r: 1 }, 12, 14, P, 4, 0.3), { tone: "hi", lit: slot === 2 }));
      }
    } else if (idx === 1) {
      // 2. Bloom Filter: 3 slot reels + lever
      for (let r = 0; r < 3; r++) {
        parts.push(S(k.cylinder(c.x - 14 + r * 14, c.y, 6, 12, 14, P, 20, 0.4), { tone: "hi", lit: true }));
      }
      parts.push(S(k.cylinder(c.x + 24, c.y + 8, 2.5, 12, 22, P, 16), { tone: "mid" }));
    } else if (idx === 2) {
      // 3. Mutex Lock: Water tank + 2 pumps + 1 interlock key
      parts.push(S(k.cylinder(c.x, c.y - 2, 15, 12, 20, P, 28, 0.6), { tone: "hi", lit: true }));
      parts.push(S(k.cylinder(c.x - 18, c.y + 10, 5, 12, 10, P, 18), { tone: "mid" }));
      parts.push(S(k.cylinder(c.x + 18, c.y + 10, 5, 12, 10, P, 18), { tone: "mid" }));
    } else if (idx === 3) {
      // 4. TCP Handshake: 2 towers + aerial cable + 3 cars
      parts.push(S(k.slabOf({ x: c.x - 24, y: c.y - 6, w: 8, d: 12, r: 1 }, 12, 22, P, 4), { tone: "mid" }));
      parts.push(S(k.slabOf({ x: c.x + 16, y: c.y - 6, w: 8, d: 12, r: 1 }, 12, 22, P, 4), { tone: "mid" }));
      parts.push(k.wireSvg(at([c.x - 20, c.y, 32]), at([c.x + 20, c.y, 32]), { tone: "lit", flow: true }));
      parts.push(S(k.cylinder(c.x, c.y, 4.5, 24, 7, P, 18), { tone: "hi", lit: true }));
    } else {
      // 5. Temperature Roulette: 16-pocket wheel
      parts.push(S(k.cylinder(c.x, c.y, 18, 12, 6, P, 32, 0.6), { tone: "hi", lit: true }));
      parts.push(L(k.radialTicks(c.x, c.y, 17, 16, 2, 18, [4, 11], P).major, { tone: "lit" }));
      parts.push(S(k.cylinder(c.x, c.y, 4, 18, 6, P, 20), { tone: "mid" }));
    }

    parts.push(k.faceTextSvg(k.topMatrix([c.x - 24, c.y + 16], 12.2, P), c.title, { size: 3.3, tone: "hi" }));
    const [mcx, mcy] = at([c.x, c.y, 16]);
    out.push(
      G(parts, {
        "data-anim": `meta-${idx}`,
        "data-cx": mcx.toFixed(1),
        "data-cy": mcy.toFixed(1),
        "data-zx": zx.toFixed(3),
        "data-zy": zy.toFixed(3),
      })
    );
  });

  return {
    svg: k.figureSvg({ width: W, height: H, label: "Five Algorithm Metaphor Machines", body: out }),
    meta: { key: "metaphor-carousel" },
  };
}

function buildCameraAudit() {
  const plate = { x: -145, y: -90, w: 290, d: 180, r: 10 };
  const P = k.fitProjection([...k.boxCorners(plate, -18, 95)], W, H, { pad: 64, azimuth: 45, elevation: 30 });
  const at = (pt: any) => k.iso(pt, P);
  const [ux, uy] = k.axisVector(P, [1, 0, 0]);
  const [zx, zy] = k.axisVector(P, [0, 0, 1]);

  const out = [makeBenchBase(P, plate, 12, 6, "45°/30° AUDIT RIG · CH09")];

  // Left: Four-tone shading reference solids (lo, mid, hi, lit)
  const tones = ["lo", "mid", "hi", "hi"];
  for (let i = 0; i < 4; i++) {
    const bx = -118 + i * 26;
    out.push(
      G(
        [
          S(k.slabOf({ x: bx, y: -62, w: 20, d: 20, r: 2.5 }, 0, 12 + i * 6, P, 4, 0.5), {
            tone: tones[i],
            lit: i === 3,
          }),
        ],
        { "data-anim": `shade-block-${i}` }
      )
    );
  }

  // Center: Split Helical Spring around Central Post (Painter's Algorithm Proof)
  const postX = -6;
  const postY = 6;
  const spring = k.coil(-22, 26, [postX, postZCenter(postY)], 22, 5.5, "y", P, 20);
  // Also build an upright vertical coil wrapping the post in Z
  const zCoilBack = [];
  const zCoilFront = [];
  for (let i = 0; i < 6; i++) {
    const zBase = 8 + i * 9;
    zCoilBack.push(S(k.slabOf({ x: postX - 20, y: postY - 20, w: 40, d: 12, r: 4 }, zBase, 4, P, 4, 0.4), { tone: "mid" }));
    zCoilFront.push(S(k.slabOf({ x: postX - 20, y: postY + 8, w: 40, d: 12, r: 4 }, zBase + 3, 4, P, 4, 0.4), { tone: "hi", lit: true }));
  }

  out.push(G([L(spring.back, { tone: "lo" }), ...zCoilBack], { "data-anim": "coil-back", "data-ux": ux.toFixed(3), "data-uy": uy.toFixed(3) }));
  out.push(
    G(
      [
        S(k.cylinder(postX, postY, 10, 0, 68, P, 32, 0.8), { tone: "hi" }),
        L(k.knurl(postX, postY, 10, 56, 66, 24, P), { tone: "lo" }),
      ],
      { "data-anim": "center-post", "data-zx": zx.toFixed(3), "data-zy": zy.toFixed(3) }
    )
  );
  out.push(G([L(spring.front, { tone: "lit" }), ...zCoilFront], { "data-anim": "coil-front", "data-ux": ux.toFixed(3), "data-uy": uy.toFixed(3) }));

  // Right: Ray-Cast Overlap Scanner Tower (6,320 overlaps)
  const scanner = [];
  scanner.push(S(k.slabOf({ x: 64, y: -42, w: 48, d: 84, r: 5 }, 0, 16, P, 6, 0.8), { tone: "mid" }));
  scanner.push(S(k.cylinder(88, 0, 14, 16, 36, P, 28, 0.6), { tone: "hi" }));
  for (let r = 0; r < 5; r++) {
    const rz = 16 + r * 9;
    scanner.push(k.wireSvg(at([74, -24 + r * 12, rz]), at([postX + 10, postY, rz]), { tone: r % 2 === 0 ? "lit" : "green", dashed: true, flow: true }));
  }
  out.push(G(scanner, { "data-anim": "audit-rays" }));

  return {
    svg: k.figureSvg({ width: W, height: H, label: "Orthographic Camera and Ray-Cast Audit", body: out }),
    meta: { key: "camera-audit" },
  };
}

function postZCenter(y: number): number {
  return y;
}

function buildTimeTruth() {
  const plate = { x: -148, y: -88, w: 296, d: 176, r: 10 };
  const P = k.fitProjection([...k.boxCorners(plate, -18, 98)], W, H, { pad: 64, azimuth: 43, elevation: 30 });
  const at = (pt: any) => k.iso(pt, P);
  const [ux, uy] = k.axisVector(P, [1, 0, 0]);
  const [zx, zy] = k.axisVector(P, [0, 0, 1]);

  const out = [makeBenchBase(P, plate, 12, 6, "NET AI HOURS · CH11")];

  const columns = [
    { x: -104, label: "WATCH 1h54m", h: 16 },
    { x: -42, label: "EARTH 1h57m", h: 17 },
    { x: 20, label: "RAPTOR 10h33m", h: 56 },
    { x: 82, label: "TRENT 14h00m", h: 72 },
  ];

  columns.forEach((col, i) => {
    const colPlan = { x: col.x, y: -22, w: 38, d: 38, r: 4 };
    // Base 1-hour foundation (every figure reaches working page in Hour 1)
    const parts = [
      S(k.slabOf(colPlan, 0, 9, P, 6, 0.5), { tone: "hi", lit: true }),
      // Refinement hours above Hour 1
      S(k.slabOf(k.insetPlan(colPlan, 2), 9, col.h - 9, P, 6, 0.7), { tone: i >= 2 ? "hi" : "mid" }),
      S(k.cylinder(col.x + 19, -3, 11, col.h, 5, P, 24, 0.5), { tone: "hi", lit: i === 3 }),
      k.faceTextSvg(k.topMatrix([col.x - 2, 26], 0.5, P), col.label, { size: 3.6, tone: "hi" }),
    ];
    out.push(G(parts, { "data-anim": `time-col-${i}`, "data-zx": zx.toFixed(3), "data-zy": zy.toFixed(3) }));
  });

  // 1-Hour Threshold Rail across all 4 columns
  out.push(
    G(
      [
        k.wireSvg(at([-118, 20, 9]), at([132, 20, 9]), { tone: "lit", dashed: true, flow: true }),
        k.faceTextSvg(k.topMatrix([-118, 36], 1, P), "1.0h WORKING PROTOTYPE THRESHOLD", { size: 4.0, tone: "hi" }),
      ],
      { "data-anim": "hour-one-ring" }
    )
  );

  // 4x Inspection Microscope Carriage above columns
  const scope = [];
  scope.push(S(k.slabOf({ x: -115, y: -58, w: 240, d: 8, r: 1.5 }, 0, 62, P, 4, 0.5), { tone: "lo" }));
  scope.push(
    G(
      [
        S(k.slabOf({ x: 10, y: -62, w: 46, d: 34, r: 4 }, 62, 10, P, 4, 0.6), { tone: "hi", lit: true }),
        S(k.cylinder(33, -34, 16, 54, 8, P, 32, 0.6), { tone: "hi", lit: true }),
        L(k.ring(33, -34, 12, 62.2, P, 28), { tone: "lit" }),
      ],
      { "data-anim": "zoom-carriage", "data-ux": ux.toFixed(3), "data-uy": uy.toFixed(3) }
    )
  );
  out.push(G(scope));

  return {
    svg: k.figureSvg({ width: W, height: H, label: "Time Truth and 4x Inspection", body: out }),
    meta: { key: "time-truth" },
  };
}

function buildCodeNotPixels() {
  const plate = { x: -146, y: -90, w: 292, d: 180, r: 10 };
  const P = k.fitProjection([...k.boxCorners(plate, -18, 92)], W, H, { pad: 64, azimuth: 44, elevation: 31 });
  const at = (pt: any) => k.iso(pt, P);
  const [zx, zy] = k.axisVector(P, [0, 0, 1]);

  const out = [makeBenchBase(P, plate, 12, 6, "CODE NOT PIXELS · CH12")];

  // Left: Coarse Dead Pixel Grid (Disintegrates under zoom)
  const pixelParts = [];
  for (let gx = 0; gx < 4; gx++) {
    for (let gy = 0; gy < 4; gy++) {
      const px = -124 + gx * 14;
      const py = -32 + gy * 14;
      pixelParts.push(S(k.slabOf({ x: px, y: py, w: 12, d: 12, r: 0.5 }, 0, 5 + ((gx + gy) % 3) * 3, P, 2), { tone: "lo" }));
    }
  }
  pixelParts.push(k.wireSvg(at([-126, -34, 16]), at([-70, 22, 16]), { tone: "red" }));
  pixelParts.push(k.wireSvg(at([-126, 22, 16]), at([-70, -34, 16]), { tone: "red" }));
  out.push(G(pixelParts, { "data-anim": "pixel-grid", "data-zx": zx.toFixed(3), "data-zy": zy.toFixed(3) }));

  // Center: Master Parametric Model Knob (Single Source of Truth)
  const knobParts = [];
  knobParts.push(S(k.cylinder(-10, -4, 26, 0, 14, P, 36, 0.8), { tone: "mid" }));
  knobParts.push(S(k.cylinder(-10, -4, 20, 14, 12, P, 36, 0.8), { tone: "hi", lit: true }));
  knobParts.push(L(k.knurl(-10, -4, 20, 15, 25, 32, P), { tone: "lo" }));
  knobParts.push(L(k.radialTicks(-10, -4, 18, 24, 6, 26, [2.2, 4.5], P).major, { tone: "lit" }));
  const [kcx, kcy] = at([-10, -4, 20]);
  out.push(G(knobParts, { "data-anim": "param-knob", "data-cx": kcx.toFixed(1), "data-cy": kcy.toFixed(1) }));

  // Right: Three Synchronized Outputs (Geometry + Readout + Motion)
  const linked = [];
  linked.push(S(k.slabOf({ x: 38, y: -52, w: 86, d: 104, r: 6 }, 0, 8, P, 6, 0.6), { tone: "mid" }));
  linked.push(S(k.extrude(gearRing(68, -22, 20, 16, 12), 8, 6, P, { convex: false }), { tone: "hi", lit: true }));
  linked.push(S(k.cylinder(96, 18, 16, 8, 24, P, 28, 0.6), { tone: "hi", lit: true }));
  linked.push(L(k.radialTicks(96, 18, 14, 20, 5, 32, [2, 4], P).major, { tone: "lit" }));
  linked.push(k.wireSvg(at([16, -4, 14]), at([48, -22, 14]), { tone: "lit", flow: true }));
  linked.push(k.wireSvg(at([16, -4, 14]), at([80, 18, 14]), { tone: "lit", flow: true }));
  const [lcx, lcy] = at([68, -22, 12]);
  out.push(
    G(linked, {
      "data-anim": "linked-part",
      "data-cx": lcx.toFixed(1),
      "data-cy": lcy.toFixed(1),
      "data-zx": zx.toFixed(3),
      "data-zy": zy.toFixed(3),
    })
  );

  return {
    svg: k.figureSvg({ width: W, height: H, label: "Code Not Pixels Parametric Rig", body: out }),
    meta: { key: "code-not-pixels" },
  };
}

function buildStarCounter() {
  const plate = { x: -146, y: -90, w: 292, d: 180, r: 10 };
  const P = k.fitProjection([...k.boxCorners(plate, -18, 94)], W, H, { pad: 64, azimuth: 43, elevation: 31 });
  const at = (pt: any) => k.iso(pt, P);
  const [ux, uy] = k.axisVector(P, [1, 0, 0]);
  const [zx, zy] = k.axisVector(P, [0, 0, 1]);

  const out = [makeBenchBase(P, plate, 12, 6, "★ 8,203 ODOMETER · CH13")];

  // Housing for 5-drum mechanical star counter (0 8 2 0 3)
  out.push(S(k.slabOf({ x: -118, y: -48, w: 156, d: 56, r: 6 }, 0, 14, P, 6, 0.8), { tone: "mid" }));
  const digits = ["0", "8", "2", "0", "3"];
  digits.forEach((d, i) => {
    const dx = -96 + i * 28;
    const drumParts = [
      S(k.cylinder(dx, -20, 11.5, 14, 22, P, 28, 0.5), { tone: "hi", lit: i >= 1 }),
      L(k.knurl(dx, -20, 11.5, 15, 35, 18, P), { tone: "lo" }),
      k.faceTextSvg(k.topMatrix([dx - 3.5, -16], 36.2, P), d, { size: 7.5, tone: "hi" }),
    ];
    const [dcx, dcy] = at([dx, -20, 25]);
    out.push(
      G(drumParts, {
        "data-anim": `drum-${i}`,
        "data-cx": dcx.toFixed(1),
        "data-cy": dcy.toFixed(1),
        "data-zx": zx.toFixed(3),
        "data-zy": zy.toFixed(3),
      })
    );
  });

  // Right: 1.4M Views Auxiliary Dial Gauge
  const dialParts = [
    S(k.cylinder(82, -22, 32, 0, 16, P, 36, 0.8), { tone: "mid" }),
    S(k.cylinder(82, -22, 27, 16, 5, P, 36, 0.5), { tone: "hi", lit: true }),
    L(k.radialTicks(82, -22, 25, 30, 5, 21, [2.5, 5.2], P).major, { tone: "lit" }),
    k.faceTextSvg(k.topMatrix([66, -6], 21.3, P), "1.4M VIEWS", { size: 4.5, tone: "hi" }),
  ];
  const [vcx, vcy] = at([82, -22, 21]);
  out.push(G(dialParts, { "data-anim": "views-needle", "data-cx": vcx.toFixed(1), "data-cy": vcy.toFixed(1) }));

  // Front: Human Eye Calibration Slider ("Claude builds well, sees poorly")
  out.push(S(k.slabOf({ x: -108, y: 26, w: 216, d: 22, r: 3 }, 0, 6, P, 4, 0.4), { tone: "mid" }));
  const slider = [
    S(k.slabOf({ x: -24, y: 22, w: 48, d: 30, r: 4 }, 6, 12, P, 4, 0.6), { tone: "hi", lit: true }),
    S(k.cylinder(0, 37, 8, 18, 6, P, 24, 0.4), { tone: "hi", lit: true }),
    k.faceTextSvg(k.topMatrix([-18, 42], 18.2, P), "EYE CALIB", { size: 3.8, tone: "hi" }),
  ];
  out.push(G(slider, { "data-anim": "eye-slider", "data-ux": ux.toFixed(3), "data-uy": uy.toFixed(3) }));

  return {
    svg: k.figureSvg({ width: W, height: H, label: "GitHub Star Odometer and Eye Calibrator", body: out }),
    meta: { key: "star-counter" },
  };
}

function buildTasteFoundry() {
  const plate = { x: -148, y: -90, w: 296, d: 180, r: 10 };
  const P = k.fitProjection([...k.boxCorners(plate, -18, 98)], W, H, { pad: 64, azimuth: 44, elevation: 31 });
  const at = (pt: any) => k.iso(pt, P);
  const [ux, uy] = k.axisVector(P, [1, 0, 0]);
  const [zx, zy] = k.axisVector(P, [0, 0, 1]);

  const out = [makeBenchBase(P, plate, 12, 6, "SKILL FOUNDRY · CH14")];

  // Three Input Feed Rails on Left (155L SKILL.md, 8 REFS, 16,000L KIT)
  const feeds = [
    { y: -52, label: "155L SKILL.md" },
    { y: -12, label: "8 REF GUIDES" },
    { y: 28, label: "16,000L KIT" },
  ];
  feeds.forEach((f, i) => {
    out.push(S(k.slabOf({ x: -132, y: f.y, w: 84, d: 24, r: 3 }, 0, 8, P, 4, 0.5), { tone: "mid" }));
    out.push(
      G(
        [
          S(k.slabOf({ x: -122, y: f.y + 3, w: 54, d: 18, r: 2 }, 8, 7, P, 4, 0.4), { tone: "hi", lit: i === 0 }),
          k.faceTextSvg(k.topMatrix([-118, f.y + 14], 15.2, P), f.label, { size: 3.4, tone: "hi" }),
        ],
        { "data-anim": `feed-tray-${i}`, "data-ux": ux.toFixed(3), "data-uy": uy.toFixed(3) }
      )
    );
  });

  // Central Hydraulic Stamping Press
  out.push(S(k.slabOf({ x: -34, y: -56, w: 68, d: 14, r: 3 }, 0, 58, P, 4, 0.6), { tone: "mid" }));
  out.push(S(k.slabOf({ x: -34, y: 26, w: 68, d: 14, r: 3 }, 0, 58, P, 4, 0.6), { tone: "mid" }));
  out.push(S(k.slabOf({ x: -38, y: -60, w: 76, d: 104, r: 5 }, 58, 12, P, 6, 0.8), { tone: "hi" }));

  // Moving Stamping Ram
  const ram = [
    S(k.cylinder(0, -8, 18, 34, 24, P, 32, 0.6), { tone: "hi", lit: true }),
    S(k.slabOf({ x: -26, y: -32, w: 52, d: 48, r: 4 }, 22, 12, P, 6, 0.8), { tone: "hi", lit: true }),
    L(k.knurl(0, -8, 18, 36, 56, 28, P), { tone: "lo" }),
  ];
  out.push(G(ram, { "data-anim": "press-ram", "data-zx": zx.toFixed(3), "data-zy": zy.toFixed(3) }));

  // Outgoing Conveyor of Stamped Inheritable Skill Modules on Right
  out.push(S(k.slabOf({ x: 42, y: -28, w: 92, d: 44, r: 3 }, 0, 8, P, 4, 0.5), { tone: "mid" }));
  for (let m = 0; m < 2; m++) {
    const mx = 52 + m * 40;
    out.push(
      G(
        [
          S(k.slabOf({ x: mx, y: -20, w: 30, d: 28, r: 3 }, 8, 12, P, 4, 0.6), { tone: "hi", lit: m === 1 }),
          S(k.cylinder(mx + 15, -6, 8, 20, 5, P, 24, 0.4), { tone: "hi", lit: true }),
        ],
        { "data-anim": "stamped-module", "data-ux": ux.toFixed(3), "data-uy": uy.toFixed(3) }
      )
    );
  }

  return {
    svg: k.figureSvg({ width: W, height: H, label: "Taste and Skill Stamping Foundry", body: out }),
    meta: { key: "taste-foundry" },
  };
}

export function buildAllCustomMachines() {
  return {
    "watch-escapement": buildWatchEscapement(),
    "box-to-machine": buildBoxToMachine(),
    "pipeline-gantry": buildPipelineGantry(),
    "metaphor-carousel": buildMetaphorCarousel(),
    "camera-audit": buildCameraAudit(),
    "time-truth": buildTimeTruth(),
    "code-not-pixels": buildCodeNotPixels(),
    "star-counter": buildStarCounter(),
    "taste-foundry": buildTasteFoundry(),
  };
}
