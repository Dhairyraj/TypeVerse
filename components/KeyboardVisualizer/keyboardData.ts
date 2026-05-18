export type Finger = 
  | 'l-pinky' | 'l-ring' | 'l-middle' | 'l-index' | 'l-thumb'
  | 'r-thumb' | 'r-index' | 'r-middle' | 'r-ring' | 'r-pinky';

export const KEY_TO_FINGER: Record<string, Finger> = {
  'q': 'l-pinky', 'a': 'l-pinky', 'z': 'l-pinky', 'tab': 'l-pinky', 'caps': 'l-pinky', 'l-shift': 'l-pinky',
  'w': 'l-ring', 's': 'l-ring', 'x': 'l-ring',
  'e': 'l-middle', 'd': 'l-middle', 'c': 'l-middle',
  'r': 'l-index', 'f': 'l-index', 'v': 'l-index', 't': 'l-index', 'g': 'l-index', 'b': 'l-index',
  ' ': 'l-thumb',
  'y': 'r-index', 'h': 'r-index', 'n': 'r-index', 'u': 'r-index', 'j': 'r-index', 'm': 'r-index',
  'i': 'r-middle', 'k': 'r-middle', ',': 'r-middle',
  'o': 'r-ring', 'l': 'r-ring', '.': 'r-ring',
  'p': 'r-pinky', ';': 'r-pinky', '/': 'r-pinky', 'enter': 'r-pinky', '[': 'r-pinky', ']': 'r-pinky', "'": 'r-pinky', 'r-shift': 'r-pinky'
};

export const FINGER_COLORS: Record<Finger, string> = {
  'l-pinky': 'border-pink-500/30 text-pink-500 bg-pink-500/5',
  'l-ring': 'border-orange-500/30 text-orange-500 bg-orange-500/5',
  'l-middle': 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5',
  'l-index': 'border-green-500/30 text-green-500 bg-green-500/5',
  'l-thumb': 'border-slate-400/30 text-slate-400 bg-slate-400/5',
  'r-thumb': 'border-slate-400/30 text-slate-400 bg-slate-400/5',
  'r-index': 'border-teal-500/30 text-teal-500 bg-teal-500/5',
  'r-middle': 'border-blue-500/30 text-blue-500 bg-blue-500/5',
  'r-ring': 'border-indigo-500/30 text-indigo-500 bg-indigo-500/5',
  'r-pinky': 'border-purple-500/30 text-purple-500 bg-purple-500/5',
};

export const FINGER_COLORS_ACTIVE: Record<Finger, string> = {
  'l-pinky': 'bg-pink-500 text-white border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]',
  'l-ring': 'bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]',
  'l-middle': 'bg-yellow-500 text-white border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]',
  'l-index': 'bg-green-500 text-white border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]',
  'l-thumb': 'bg-slate-500 text-white border-slate-400 shadow-[0_0_15px_rgba(100,116,139,0.5)]',
  'r-thumb': 'bg-slate-500 text-white border-slate-400 shadow-[0_0_15px_rgba(100,116,139,0.5)]',
  'r-index': 'bg-teal-500 text-white border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.5)]',
  'r-middle': 'bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
  'r-ring': 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]',
  'r-pinky': 'bg-purple-500 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]',
};

export const HOME_ROW_KEYS = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];

export const KEYBOARD_ROWS = [
  [
    { key: 'Tab', id: 'tab', width: 'w-[4.5rem]' }, { key: 'Q', id: 'q' }, { key: 'W', id: 'w' }, { key: 'E', id: 'e' }, { key: 'R', id: 'r' }, { key: 'T', id: 't' }, { key: 'Y', id: 'y' }, { key: 'U', id: 'u' }, { key: 'I', id: 'i' }, { key: 'O', id: 'o' }, { key: 'P', id: 'p' }, { key: '[', id: '[' }, { key: ']', id: ']' }
  ],
  [
    { key: 'Caps', id: 'caps', width: 'w-[5.5rem]' }, { key: 'A', id: 'a' }, { key: 'S', id: 's' }, { key: 'D', id: 'd' }, { key: 'F', id: 'f' }, { key: 'G', id: 'g' }, { key: 'H', id: 'h' }, { key: 'J', id: 'j' }, { key: 'K', id: 'k' }, { key: 'L', id: 'l' }, { key: ';', id: ';' }, { key: "'", id: "'" }, { key: 'Enter', id: 'enter', width: 'w-[5.5rem]' }
  ],
  [
    { key: 'Shift', id: 'l-shift', width: 'w-[7rem]' }, { key: 'Z', id: 'z' }, { key: 'X', id: 'x' }, { key: 'C', id: 'c' }, { key: 'V', id: 'v' }, { key: 'B', id: 'b' }, { key: 'N', id: 'n' }, { key: 'M', id: 'm' }, { key: ',', id: ',' }, { key: '.', id: '.' }, { key: '/', id: '/' }, { key: 'Shift', id: 'r-shift', width: 'w-[7rem]' }
  ],
  [
    { key: 'Space', id: ' ', width: 'w-[20rem]' }
  ]
];
