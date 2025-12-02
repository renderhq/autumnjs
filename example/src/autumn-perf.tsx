import clsx from "clsx";
import Stats from "stats.js";
import { Analytics } from "@vercel/analytics/react";
import { COLUMNS, generateRows } from "./generateRows";
import { Grid } from "../../src/grid";
import {
  useAutumnSignal,
  AutumnEffect,
  AutumnComponent,
} from "../../autumn-core/core/autumn";

/* ---------------- AutoScroller ---------------- */
class AutoScroller {
  grid: Grid;
  toBottom = true;
  version = 0;

  constructor(grid: Grid) {
    this.grid = grid;
  }

  start(speed: number) {
    if (speed === 0) return;
    this.version++;
    const currentVersion = this.version;

    const cb = () => {
      if (this.version !== currentVersion) return;
      const state = this.grid.getState();
      if (this.grid.offsetY > state.tableHeight - this.grid.viewportHeight - 1) this.toBottom = false;
      else if (this.grid.offsetY <= 0) this.toBottom = true;

      const delta = this.toBottom ? speed : -speed;
      this.grid.container.dispatchEvent(new WheelEvent("wheel", { deltaY: delta }));
      requestAnimationFrame(cb);
    };
    requestAnimationFrame(cb);
  }
}

/* ---------------- DOM Impulses ---------------- */
function showImpulse(label: string, color = "#4ade80") {
  const el = document.createElement("div");
  el.textContent = `⚡ ${label}`;
  Object.assign(el.style, {
    fontFamily: "monospace",
    fontSize: "12px",
    fontWeight: "700",
    color: "white",
    background: color,
    padding: "3px 8px",
    borderRadius: "8px",
    opacity: "1",
    transform: "scale(1)",
    transition: "opacity 0.6s ease, transform 0.6s ease",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  });

  const container =
    document.getElementById("impulse-layer") ||
    (() => {
      const c = document.createElement("div");
      c.id = "impulse-layer";
      Object.assign(c.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        zIndex: "9999",
        pointerEvents: "none",
        alignItems: "center",
      });
      document.body.appendChild(c);
      return c;
    })();

  container.prepend(el);

  requestAnimationFrame(() => {
    el.style.opacity = "0";
    el.style.transform = "scale(1.4)";
  });
  setTimeout(() => el.remove(), 700);
}

/* ---------------- FPS Monitor ---------------- */
export const setupFPS = () => {
  if (document.getElementById("draggable-fps")) return;

  const stats = new Stats();
  stats.showPanel(0);
  stats.dom.id = "draggable-fps";
  Object.assign(stats.dom.style, {
    position: "fixed",
    top: "60px",
    left: "60px",
    zIndex: "9999",
    cursor: "move",
    userSelect: "none",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
    transition: "transform 0.3s ease",
  });

  for (const child of stats.dom.children) {
    // @ts-expect-error
    child.style.width = "180px";
    // @ts-expect-error
    child.style.height = "100px";
  }

  document.body.appendChild(stats.dom);

  stats.dom.addEventListener("mouseenter", () => (stats.dom.style.transform = "scale(1.1)"));
  stats.dom.addEventListener("mouseleave", () => (stats.dom.style.transform = "scale(1)"));

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const onMouseDown = (e: MouseEvent) => {
    isDragging = true;
    offsetX = e.clientX - stats.dom.offsetLeft;
    offsetY = e.clientY - stats.dom.offsetTop;
    e.preventDefault();
  };
  const onMouseUp = () => (isDragging = false);
  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    stats.dom.style.left = e.clientX - offsetX + "px";
    stats.dom.style.top = e.clientY - offsetY + "px";
  };

  stats.dom.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);

  const animate = () => {
    stats.update();
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);

  return () => {
    stats.dom.remove();
    stats.dom.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mousemove", onMouseMove);
  };
};

function createParticleField() {
  if (document.getElementById("particle-bg")) return;

  const canvas = document.createElement("canvas");
  canvas.id = "particle-bg";
  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "0",
    pointerEvents: "none",
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string }[] = [];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 1 + Math.random() * 3,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    });
  }

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

function burstConfetti() {
  const colors = ["#facc15","#f43f5e","#3b82f6","#22c55e","#a855f7"];
  for(let i=0;i<30;i++){
    const dot = document.createElement("div");
    dot.style.position="fixed";
    dot.style.width="6px";
    dot.style.height="6px";
    dot.style.borderRadius="50%";
    dot.style.background=colors[Math.floor(Math.random()*colors.length)];
    dot.style.top= `${50 + (Math.random()-0.5)*20}%`;
    dot.style.left= `${50 + (Math.random()-0.5)*20}%`;
    dot.style.zIndex="9999";
    dot.style.pointerEvents="none";
    document.body.appendChild(dot);
    const angle = Math.random()*2*Math.PI;
    const speed = 1+Math.random()*3;
    let t=0;
    const anim = () => {
      t+=0.016;
      dot.style.transform = `translate(${Math.cos(angle)*t*speed*20}px, ${Math.sin(angle)*t*speed*20}px) scale(${1-t*0.8})`;
      dot.style.opacity = `${1-t}`;
      if(t<1) requestAnimationFrame(anim);
      else dot.remove();
    };
    anim();
  }
}

class ReactiveInspector {
  container: HTMLDivElement;
  lines: HTMLDivElement[] = [];
  maxLines = 12;

  constructor() {
    this.container = document.createElement("div");
    Object.assign(this.container.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      fontFamily: "monospace",
      fontSize: "11px",
      lineHeight: "1.2em",
      color: "#fff",
      background: "rgba(0,0,0,0.65)",
      padding: "6px 12px",
      borderRadius: "8px",
      zIndex: "9999",
      pointerEvents: "none",
      width: "260px",
      maxHeight: "calc(1.2em * 12)",
      overflow: "hidden",
    });
    document.body.appendChild(this.container);
  }

  push(message: string) {
    let line: HTMLDivElement;
    if (this.lines.length < this.maxLines) {
      line = document.createElement("div");
      this.container.appendChild(line);
      this.lines.push(line);
    } else {
      line = this.lines.shift()!;
      this.lines.push(line);
    }
    line.textContent = `⚡ ${message}`;
    line.style.background = "rgba(255,255,255,0.3)";
    line.style.transition = "background 0.5s ease";
    requestAnimationFrame(() => line.style.background = "transparent");
  }
}

const inspector = new ReactiveInspector();
function monitorSignal<T>(label: string, signal: { get: () => T }) {
  AutumnEffect(() => inspector.push(`${label}: ${signal.get()}`), [signal.get()]);
}

function setupRuntimeHUD() {
  if (document.getElementById("runtime-hud")) return;

  const hud = document.createElement("div");
  hud.id = "runtime-hud";
  hud.textContent = "⚡ Reactive Runtime: ONLINE";
  Object.assign(hud.style, {
    position: "fixed",
    top: "50%",
    right: "20px",
    transform: "translateY(-50%)",
    fontFamily: "monospace",
    fontSize: "12px",
    fontWeight: "600",
    padding: "4px 10px",
    borderRadius: "8px",
    color: "white",
    background: "#10b981",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    transition: "background 0.4s ease, transform 0.2s ease",
    zIndex: "9999",
  });
  document.body.appendChild(hud);

  let blinkInterval: any = null;
  return (mode: "normal" | "stress") => {
    if (mode === "stress") {
      hud.textContent = "⚡ Reactive Runtime: STRESS";
      hud.style.background = "#ef4444";
      if (!blinkInterval) {
        let scaleUp = false;
        blinkInterval = setInterval(() => {
          hud.style.transform = scaleUp ? "translateY(-50%) scale(1.1)" : "translateY(-50%) scale(1.0)";
          scaleUp = !scaleUp;
        }, 500);
      }
    } else {
      hud.textContent = "⚡ Reactive Runtime: ONLINE";
      hud.style.background = "#10b981";
      if (blinkInterval) clearInterval(blinkInterval);
      blinkInterval = null;
      hud.style.transform = "translateY(-50%) scale(1.0)";
    }
  };
}

export const FastGrid = AutumnComponent(() => {
  const containerRef = useAutumnSignal<HTMLDivElement | null>(null);
  const grid = useAutumnSignal<Grid | null>(null);
  const autoScroller = useAutumnSignal<AutoScroller | null>(null);
  const speed = useAutumnSignal(0);
  const rowCount = useAutumnSignal(100_000);
  const stressTest = useAutumnSignal(false);
  const loadingRows = useAutumnSignal(false);

  const hudUpdate = setupRuntimeHUD();

  monitorSignal("Scroll Speed", speed);
  monitorSignal("Row Count", rowCount);
  monitorSignal("Stress Mode", stressTest);
  monitorSignal("Loading Rows", loadingRows);

  AutumnEffect(() => {
    const container = containerRef.get();
    if (!container) return;

    const g = new Grid(container, [], COLUMNS);
    grid.set(g);

    loadingRows.set(true);
    generateRows(rowCount.get(), g, () => loadingRows.set(false));

    const scroller = new AutoScroller(g);
    autoScroller.set(scroller);

    return () => g.destroy();
  }, [containerRef.get(), rowCount.get()]);

  AutumnEffect(() => {
    const scroller = autoScroller.get();
    if (!scroller || speed.get() === 0) return;
    scroller.start(Math.exp(speed.get() / 15));
  }, [autoScroller.get(), speed.get()]);

  AutumnEffect(() => showImpulse(`Scroll speed: ${speed.get()}`, "#3b82f6"), [speed.get()]);
  AutumnEffect(() => showImpulse(`Row count: ${rowCount.get()}`, "#f59e0b"), [rowCount.get()]);
  AutumnEffect(() => {
    if (stressTest.get()) {
      showImpulse("Stress ON", "#ef4444");
      hudUpdate("stress");
      burstConfetti();
      for (let i = 0; i < 50; i++) showImpulse(`DOM FLEX #${i}`);
      for (let i = 0; i < 20; i++) inspector.push(`⚡ SIGNAL FLEX #${i}: ${Math.floor(Math.random()*1_000_000)}`);
      console.clear();
      for (let i = 0; i < 100; i++) console.log(`%cCONSOLE FLEX #${i}`, `color:hsl(${Math.random()*360},70%,50%); font-weight:bold;`);
    } else {
      showImpulse("Stress OFF", "#22c55e");
      hudUpdate("normal");
    }
  }, [stressTest.get()]);

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50 font-sans relative">
      <Analytics />
      
      <div className="px-1 py-1 bg-white">
        <h1 className="text-6xl font-thin tracking-tight text-black mb-6 leading-none" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif' }}>
          Autumn.js
        </h1>
        <p className="text-xl text-gray-700 leading-relaxed max-w-3xl font-light mb-1" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif' }}>
          Reactive frontend runtime built for massive datasets.
        </p>
        <p className="text-xl text-gray-700 leading-relaxed max-w-3xl font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif' }}>
          10M+ rows at 60-120fps with zero frame drops.{' '}
          <a 
            href="https://github.com/renderhq/autumnjs" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-black hover:text-gray-500 transition-colors group"
          >
            <span className="font-normal border-b border-black group-hover:border-gray-500">Source</span>
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <g stroke="currentColor" strokeLinecap="round" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <path d="M15 3h6v6"></path>
                <path d="M10 14L21 3"></path>
              </g>
            </svg>
          </a>
        </p>
      </div>

      <div className="p-3 flex flex-wrap gap-3 items-center border-b border-gray-200 bg-gray-50 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Scroll speed:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={speed.get()}
            onChange={(e) => speed.set(Number(e.target.value))}
            className={clsx(
              "h-2 w-40 cursor-pointer rounded-full bg-gray-300",
              speed.get() > 70 && "shadow-lg border-2 border-blue-400"
            )}
          />
        </div>

        <button
          className={clsx(
            "h-8 px-4 rounded text-white hover:scale-95 transition-all",
            stressTest.get() ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
          )}
          onClick={() => {
            if (stressTest.get()) {
              stressTest.set(false);
              speed.set(0);
            } else {
              stressTest.set(true);
              speed.set(100);
            }
          }}
        >
          {stressTest.get() ? "Stress ON" : "Stress OFF"}
        </button>

        <select
          value={rowCount.get()}
          onChange={(e) => rowCount.set(Number(e.target.value))}
          className="h-8 rounded border border-gray-300 bg-white px-2 text-sm text-gray-700"
        >
          {[10, 10_000, 100_000, 200_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000].map((n) => (
            <option key={n} value={n}>{n.toLocaleString()} rows</option>
          ))}
        </select>
      </div>

      <div
        ref={(el) => containerRef.set(el)}
        style={{ flex: 1 }}
        className={clsx(
          "relative w-full overflow-auto border border-gray-200 bg-white shadow-inner",
          loadingRows.get() && "pointer-events-none opacity-70"
        )}
      />
    </div>
  );
});

/* ---------------- BOOT EVERYTHING ---------------- */
setupFPS();
createParticleField();
