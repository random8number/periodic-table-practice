(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PeriodicElementSets = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const elements = [
    [1,"H","Hydrogen",1,1],[2,"He","Helium",18,1],
    [3,"Li","Lithium",1,2],[4,"Be","Beryllium",2,2],[5,"B","Boron",13,2],[6,"C","Carbon",14,2],[7,"N","Nitrogen",15,2],[8,"O","Oxygen",16,2],[9,"F","Fluorine",17,2],[10,"Ne","Neon",18,2],
    [11,"Na","Sodium",1,3],[12,"Mg","Magnesium",2,3],[13,"Al","Aluminium",13,3],[14,"Si","Silicon",14,3],[15,"P","Phosphorus",15,3],[16,"S","Sulfur",16,3],[17,"Cl","Chlorine",17,3],[18,"Ar","Argon",18,3],
    [19,"K","Potassium",1,4],[20,"Ca","Calcium",2,4],[21,"Sc","Scandium",3,4],[22,"Ti","Titanium",4,4],[23,"V","Vanadium",5,4],[24,"Cr","Chromium",6,4],[25,"Mn","Manganese",7,4],[26,"Fe","Iron",8,4],[27,"Co","Cobalt",9,4],[28,"Ni","Nickel",10,4],[29,"Cu","Copper",11,4],[30,"Zn","Zinc",12,4],[31,"Ga","Gallium",13,4],[32,"Ge","Germanium",14,4],[33,"As","Arsenic",15,4],[34,"Se","Selenium",16,4],[35,"Br","Bromine",17,4],[36,"Kr","Krypton",18,4],
    [37,"Rb","Rubidium",1,5],[38,"Sr","Strontium",2,5],[39,"Y","Yttrium",3,5],[40,"Zr","Zirconium",4,5],[41,"Nb","Niobium",5,5],[42,"Mo","Molybdenum",6,5],[43,"Tc","Technetium",7,5],[44,"Ru","Ruthenium",8,5],[45,"Rh","Rhodium",9,5],[46,"Pd","Palladium",10,5],[47,"Ag","Silver",11,5],[48,"Cd","Cadmium",12,5],[49,"In","Indium",13,5],[50,"Sn","Tin",14,5],[51,"Sb","Antimony",15,5],[52,"Te","Tellurium",16,5],[53,"I","Iodine",17,5],[54,"Xe","Xenon",18,5],
    [55,"Cs","Caesium",1,6],[56,"Ba","Barium",2,6],[57,"La","Lanthanum",1,8],[58,"Ce","Cerium",2,8],[59,"Pr","Praseodymium",3,8],[60,"Nd","Neodymium",4,8],[61,"Pm","Promethium",5,8],[62,"Sm","Samarium",6,8],[63,"Eu","Europium",7,8],[64,"Gd","Gadolinium",8,8],[65,"Tb","Terbium",9,8],[66,"Dy","Dysprosium",10,8],[67,"Ho","Holmium",11,8],[68,"Er","Erbium",12,8],[69,"Tm","Thulium",13,8],[70,"Yb","Ytterbium",14,8],[71,"Lu","Lutetium",15,8],
    [72,"Hf","Hafnium",4,6],[73,"Ta","Tantalum",5,6],[74,"W","Tungsten",6,6],[75,"Re","Rhenium",7,6],[76,"Os","Osmium",8,6],[77,"Ir","Iridium",9,6],[78,"Pt","Platinum",10,6],[79,"Au","Gold",11,6],[80,"Hg","Mercury",12,6],[81,"Tl","Thallium",13,6],[82,"Pb","Lead",14,6],[83,"Bi","Bismuth",15,6],[84,"Po","Polonium",16,6],[85,"At","Astatine",17,6],[86,"Rn","Radon",18,6],
    [87,"Fr","Francium",1,7],[88,"Ra","Radium",2,7],[89,"Ac","Actinium",1,9],[90,"Th","Thorium",2,9],[91,"Pa","Protactinium",3,9],[92,"U","Uranium",4,9],[93,"Np","Neptunium",5,9],[94,"Pu","Plutonium",6,9],[95,"Am","Americium",7,9],[96,"Cm","Curium",8,9],[97,"Bk","Berkelium",9,9],[98,"Cf","Californium",10,9],[99,"Es","Einsteinium",11,9],[100,"Fm","Fermium",12,9],[101,"Md","Mendelevium",13,9],[102,"No","Nobelium",14,9],[103,"Lr","Lawrencium",15,9],
    [104,"Rf","Rutherfordium",4,7],[105,"Db","Dubnium",5,7],[106,"Sg","Seaborgium",6,7],[107,"Bh","Bohrium",7,7],[108,"Hs","Hassium",8,7],[109,"Mt","Meitnerium",9,7],[110,"Ds","Darmstadtium",10,7],[111,"Rg","Roentgenium",11,7],[112,"Cn","Copernicium",12,7],[113,"Nh","Nihonium",13,7],[114,"Fl","Flerovium",14,7],[115,"Mc","Moscovium",15,7],[116,"Lv","Livermorium",16,7],[117,"Ts","Tennessine",17,7],[118,"Og","Oganesson",18,7]
  ];

  const categoryOrder = [
    "Alkali metals","Alkaline earth metals","Transition metals","Post-transition metals",
    "Metalloids","Reactive non-metals","Halogens","Noble gases","Lanthanides","Actinides"
  ];

  function getCategory(number, symbol, group, period) {
    const noble = ['He','Ne','Ar','Kr','Xe','Rn','Og'];
    const halogens = ['F','Cl','Br','I','At','Ts'];
    const metalloids = ['B','Si','Ge','As','Sb','Te','Po'];
    const nonMetals = ['H','C','N','O','P','S','Se'];
    const post = ['Al','Ga','In','Sn','Tl','Pb','Bi','Nh','Fl','Mc','Lv'];

    if (noble.includes(symbol)) return 'Noble gases';
    if (halogens.includes(symbol)) return 'Halogens';
    if (period === 8) return 'Lanthanides';
    if (period === 9) return 'Actinides';
    if (group === 1 && symbol !== 'H') return 'Alkali metals';
    if (group === 2) return 'Alkaline earth metals';
    if (group >= 3 && group <= 12) return 'Transition metals';
    if (metalloids.includes(symbol)) return 'Metalloids';
    if (nonMetals.includes(symbol)) return 'Reactive non-metals';
    if (post.includes(symbol)) return 'Post-transition metals';
    return 'Other';
  }

  const ELEMENT_SET_OPTIONS = [
    { id: 'first20', label: 'First 20 — quick game', kind: 'range', limit: 20 },
    { id: 'first36', label: 'First 36 — H to Kr', kind: 'range', limit: 36 },
    { id: 'all118', label: 'All 118', kind: 'range', limit: 118 },
    { id: 'alkali', label: 'Alkali metals', kind: 'category', category: 'Alkali metals' },
    { id: 'alkaline-earth', label: 'Alkaline earth metals', kind: 'category', category: 'Alkaline earth metals' },
    { id: 'transition', label: 'Transition metals', kind: 'category', category: 'Transition metals' },
    { id: 'post-transition', label: 'Post-transition metals', kind: 'category', category: 'Post-transition metals' },
    { id: 'metalloids', label: 'Metalloids', kind: 'category', category: 'Metalloids' },
    { id: 'reactive-nonmetals', label: 'Reactive non-metals', kind: 'category', category: 'Reactive non-metals' },
    { id: 'halogens', label: 'Halogens', kind: 'category', category: 'Halogens' },
    { id: 'noble-gases', label: 'Noble gases', kind: 'category', category: 'Noble gases' },
    { id: 'lanthanides', label: 'Lanthanides', kind: 'category', category: 'Lanthanides' },
    { id: 'actinides', label: 'Actinides', kind: 'category', category: 'Actinides' }
  ];

  function normaliseElementSetId(value) {
    const legacy = { '20': 'first20', '36': 'first36', '118': 'all118' };
    const raw = String(value ?? '');
    if (legacy[raw]) return legacy[raw];
    return ELEMENT_SET_OPTIONS.some(option => option.id === raw) ? raw : null;
  }

  function resolveElementSet(setId) {
    const id = normaliseElementSetId(setId);
    const option = ELEMENT_SET_OPTIONS.find(item => item.id === id);
    if (!option) throw new Error(`Unknown element set: ${setId}`);
    if (option.kind === 'range') return elements.filter(el => el[0] <= option.limit);
    return elements.filter(el => getCategory(el[0], el[1], el[3], el[4]) === option.category);
  }

  function getElementSetMeta(setId) {
    const id = normaliseElementSetId(setId);
    const option = ELEMENT_SET_OPTIONS.find(item => item.id === id);
    if (!option) throw new Error(`Unknown element set: ${setId}`);
    const resolved = resolveElementSet(id);
    return {
      id,
      label: option.label,
      count: resolved.length,
      maxTarget: Math.max(...resolved.map(el => el[0])),
      elements: resolved
    };
  }

  function buildElementSetsSeed() {
    const out = {};
    for (const option of ELEMENT_SET_OPTIONS) {
      const resolved = resolveElementSet(option.id);
      out[option.id] = {
        count: resolved.length,
        maxTarget: Math.max(...resolved.map(el => el[0])),
        members: Object.fromEntries(resolved.map(el => [el[1], true]))
      };
    }
    return out;
  }

  return {
    elements,
    categoryOrder,
    ELEMENT_SET_OPTIONS,
    getCategory,
    resolveElementSet,
    getElementSetMeta,
    normaliseElementSetId,
    buildElementSetsSeed
  };
});
