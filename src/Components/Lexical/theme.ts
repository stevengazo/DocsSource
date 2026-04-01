// theme.ts
const theme = {
  // 🔹 Bloques base
  paragraph: 'mb-2 text-[15px] leading-relaxed text-gray-800',

  quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2',

  // 🔹 Headings estilo Notion
  heading: {
    h1: 'text-3xl font-bold mt-6 mb-2 text-gray-900',
    h2: 'text-2xl font-semibold mt-5 mb-2 text-gray-900',
    h3: 'text-xl font-semibold mt-4 mb-1 text-gray-900',
    h4: 'text-lg font-medium mt-3 mb-1 text-gray-800',
    h5: 'text-base font-medium mt-2 mb-1 text-gray-800',
    h6: 'text-sm font-medium mt-2 mb-1 text-gray-700',
  },

  // 🔹 Listas
  list: {
    nested: {
      listitem: 'ml-4',
    },
    ul: 'list-disc pl-6 my-2',
    ol: 'list-decimal pl-6 my-2',
    listitem: 'mb-1',
    listitemChecked: 'line-through text-gray-400',
    listitemUnchecked: '',
  },

  // 🔹 Links
  link: 'text-blue-600 underline underline-offset-2 hover:text-blue-800',

  // 🔹 Texto inline
  text: {
    bold: 'font-semibold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
    code: 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono',
    subscript: 'align-sub text-xs',
    superscript: 'align-super text-xs',
  },

  // 🔹 Code block
  code: 'bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm my-3 overflow-auto',

  // 🔹 Syntax highlight (opcional pero listo)
  codeHighlight: {
    keyword: 'text-purple-400',
    string: 'text-green-400',
    comment: 'text-gray-500 italic',
    function: 'text-blue-400',
    number: 'text-orange-400',
    operator: 'text-gray-300',
  },

  // 🔹 Placeholder estilo Notion
  placeholder:
    'absolute top-[12px] left-[16px] text-gray-400 pointer-events-none select-none',

  // 🔹 Extras
  hashtag: 'text-blue-500',
  image: 'my-4 rounded-lg',
  
  // 🔹 Dirección
  ltr: 'text-left',
  rtl: 'text-right',
};

export default theme;