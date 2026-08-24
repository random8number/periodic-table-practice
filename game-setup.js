(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./element-sets.js'));
  } else {
    root.PeriodicGameSetup = factory(root.PeriodicElementSets);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Sets) {
  if (!Sets) throw new Error('element-sets.js failed to load');

  const PLAY_MODES = ['single', 'local', 'online'];
  const DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'custom'];
  const GAME_TYPES = [{ id: 'place-elements', label: 'Place Elements on Table' }];

  function normaliseSetup(input = {}) {
    const playMode = PLAY_MODES.includes(input.playMode) ? input.playMode : 'single';
    const gameType = input.gameType || 'place-elements';
    if (!GAME_TYPES.some(type => type.id === gameType)) {
      throw new Error(`Unknown game type: ${gameType}`);
    }

    const difficulty = DIFFICULTIES.includes(input.difficulty)
      ? input.difficulty
      : 'beginner';

    const requestedSet = input.elementSetId == null ? 'all118' : input.elementSetId;
    const elementSetId = Sets.normaliseElementSetId(requestedSet);
    if (!elementSetId) throw new Error(`Unknown element set: ${requestedSet}`);

    const meta = Sets.getElementSetMeta(elementSetId);
    return {
      playMode,
      gameType,
      elementSetId: meta.id,
      requiredCount: meta.count,
      elementLimit: meta.maxTarget,
      difficulty
    };
  }

  function defaultSingleSetup(difficulty = 'beginner') {
    return normaliseSetup({
      playMode: 'single',
      gameType: 'place-elements',
      elementSetId: 'all118',
      difficulty
    });
  }

  function setupFromRoom(roomData) {
    if (!roomData || !roomData.settings) throw new Error('Room settings are missing');
    return normaliseSetup({
      playMode: 'online',
      gameType: 'place-elements',
      elementSetId: roomData.settings.elementSetId || roomData.settings.elementLimit,
      difficulty: roomData.settings.difficulty
    });
  }

  return {
    PLAY_MODES,
    DIFFICULTIES,
    GAME_TYPES,
    normaliseSetup,
    defaultSingleSetup,
    setupFromRoom
  };
});
