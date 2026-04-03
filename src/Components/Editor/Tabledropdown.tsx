import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ---------- Tipos ---------- */
interface TableSize { rows: number; columns: number }

interface Props {
  onInsert: (size: TableSize) => void;
}

/* ---------- Presets ---------- */
const PRESETS: { label: string; rows: number; columns: number; grid: [number, number] }[] = [
  { label: '2 × 2', rows: 2, columns: 2, grid: [2, 2] },
  { label: '3 × 3', rows: 3, columns: 3, grid: [3, 3] },
  { label: '4 × 4', rows: 4, columns: 4, grid: [4, 4] },
  { label: '2 × 3', rows: 2, columns: 3, grid: [2, 3] },
  { label: '3 × 5', rows: 3, columns: 5, grid: [3, 5] },
  { label: '5 × 5', rows: 5, columns: 5, grid: [5, 5] },
];

/* ---------- Mini-icon ---------- */
function PresetIcon({ rows, cols }: { rows: number; cols: number }) {
  const size = Math.floor(22 / Math.max(rows, cols));
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        gridTemplateRows: `repeat(${rows}, ${size}px)`,
        gap: '1.5px',
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <span
          key={i}
          style={{
            display: 'block',
            width: size,
            height: size,
            background: 'currentColor',
            borderRadius: 1,
            opacity: 0.65,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Grid picker ---------- */
const GRID_COLS = 8;
const GRID_ROWS = 6;

function GridPicker({
  onHover,
  onClick,
}: {
  onHover: (r: number, c: number) => void;
  onClick: (r: number, c: number) => void;
}) {
  const [hover, setHover] = useState<[number, number]>([0, 0]);

  return (
    <div
      onMouseLeave={() => {
        setHover([0, 0]);
        onHover(0, 0);
      }}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_COLS}, 20px)`,
        gap: 3,
      }}
    >
      {Array.from({ length: GRID_ROWS }).map((_, r) =>
        Array.from({ length: GRID_COLS }).map((_, c) => {
          const active = r < hover[0] && c < hover[1];
          return (
            <div
              key={`${r}-${c}`}
              onMouseEnter={() => {
                const nr = r + 1,
                  nc = c + 1;
                setHover([nr, nc]);
                onHover(nr, nc);
              }}
              onClick={() => onClick(hover[0], hover[1])}
              style={{
                width: 20,
                height: 20,
                borderRadius: 3,
                border: `0.5px solid ${active ? '#93c5fd' : 'rgba(255,255,255,0.2)'}`,
                background: active ? '#3b82f6' : 'rgba(255,255,255,0.08)',
                cursor: 'pointer',
                transition: 'background 0.06s, border-color 0.06s',
              }}
            />
          );
        })
      )}
    </div>
  );
}

/* ---------- Component ---------- */
export default function TableDropdown({ onInsert }: Props) {
  const [open, setOpen] = useState(false);
  const [gridHint, setGridHint] = useState('');
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [activePreset, setActivePreset] = useState<string | null>('3 × 3');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInsert = () => {
    const r = Math.max(1, Math.min(20, rows));
    const c = Math.max(1, Math.min(20, cols));
    onInsert({ rows: r, columns: c });
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        className="bg-blue-950 text-white flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
        Tabla
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="bg-blue-700 text-white"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              zIndex: 50,
              width: 264,
              borderRadius: 12,
              padding: 14,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            <p className="text-xs mb-2 opacity-80">Tamaños rápidos</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setRows(p.rows);
                    setCols(p.columns);
                    setActivePreset(p.label);
                  }}
                  className={`p-2 rounded-md text-xs flex flex-col items-center gap-1 transition
                    ${activePreset === p.label ? 'bg-blue-500' : 'hover:bg-blue-600'}
                  `}
                >
                  <PresetIcon rows={p.grid[0]} cols={p.grid[1]} />
                  {p.label}
                </button>
              ))}
            </div>

            <GridPicker
              onHover={(r, c) => {
                if (r && c) {
                  setRows(r);
                  setCols(c);
                  setGridHint(`${r} × ${c}`);
                }
              }}
              onClick={(r, c) => {
                if (r && c) {
                  setRows(r);
                  setCols(c);
                  handleInsert();
                }
              }}
            />

            {gridHint && <p className="text-xs mt-2 opacity-80">{gridHint}</p>}

            <button
              onClick={handleInsert}
              className="mt-4 w-full bg-white text-blue-700 rounded-md h-8 text-sm font-medium"
            >
              Insertar {rows} × {cols}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}