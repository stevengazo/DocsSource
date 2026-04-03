function TableOfContents({ headings, theme }: any) {
  const bgClass = theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  return (
    <div className={`w-56 border-l ${borderClass} p-4 overflow-y-auto ${bgClass}`}>
      <h3 className="font-semibold mb-2">Tabla de Contenido</h3>
      <ol className="list-decimal list-inside space-y-1">
        {headings.map((h, idx) => {
          const level = Math.min(Math.max(h.level, 1), 6);
          return (
            <li key={idx} className={`ml-${(level - 1) * 4}`}>
              <a
                href={`#${h.id}`}
                className="text-sm hover:underline"
                onClick={e => {
                  e.preventDefault();
                  const el = document.getElementById(h.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default TableOfContents