export const WORD_BANK: Record<string, string[]> = {
  marvel: ['iron', 'thor', 'hulk', 'loki', 'groot', 'snap', 'suit', 'cape', 'stark', 'hero', 'shield', 'stone', 'power', 'titan', 'web', 'spidey'],
  anime: ['goku', 'ninja', 'jutsu', 'titan', 'hero', 'sword', 'soul', 'punch', 'ghoul', 'magic', 'ki', 'slayer', 'demon', 'piece', 'pirate', 'luffy'],
  gaming: ['boss', 'loot', 'raid', 'quest', 'mage', 'tank', 'healer', 'gold', 'level', 'xp', 'mana', 'health', 'save', 'load', 'pong', 'jump'],
  coding: ['html', 'css', 'loop', 'array', 'node', 'react', 'byte', 'data', 'json', 'func', 'type', 'props', 'state', 'hook', 'class', 'void'],
  science: ['atom', 'cell', 'dna', 'moon', 'mars', 'star', 'mass', 'gene', 'core', 'heat', 'test', 'data', 'lab', 'acid', 'base', 'ion'],
  history: ['rome', 'king', 'queen', 'war', 'tomb', 'gold', 'ruin', 'ship', 'flag', 'pope', 'czar', 'inca', 'maya', 'aztec', 'empire'],
  sports: ['ball', 'goal', 'run', 'swim', 'kick', 'pass', 'team', 'race', 'base', 'bat', 'net', 'dunk', 'golf', 'surf', 'bike', 'skate'],
  mythology: ['zeus', 'odin', 'thor', 'loki', 'ares', 'hera', 'hades', 'myth', 'god', 'titan', 'elf', 'dwarf', 'fairy', 'nymph', 'magic']
};

export function getRandomWord(interest: string = 'marvel'): string {
  const words = WORD_BANK[interest] || WORD_BANK['marvel'];
  return words[Math.floor(Math.random() * words.length)];
}
