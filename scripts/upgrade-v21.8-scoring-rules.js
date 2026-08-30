const fs = require('node:fs');

const path = 'database.rules.v21.8.json';
const document = JSON.parse(fs.readFileSync(path, 'utf8'));
const roomRules = document.rules.rooms['$room'];
let expression = roomRules.game['.validate'];
const categoryMarker = "(newData.parent().child('version').val() === '21.6-category-games' || newData.parent().child('version').val() === '21.8-learning-options')";
const categoryStart = expression.indexOf(categoryMarker);
if (categoryStart < 0) throw new Error('Could not locate category-room validation branch');

const prefix = expression.slice(0, categoryStart);
let category = expression.slice(categoryStart);
const versionPath = "newData.parent().child('version').val()";

function replaceExact(source, target, replacement, label) {
  const first = source.indexOf(target);
  if (first < 0) throw new Error(`Missing ${label}`);
  if (source.indexOf(target, first + target.length) >= 0) {
    throw new Error(`Ambiguous ${label}`);
  }
  return source.slice(0, first) + replacement + source.slice(first + target.length);
}

function replaceAfter(source, anchor, target, replacement, label) {
  const anchorIndex = source.indexOf(anchor);
  if (anchorIndex < 0) throw new Error(`Missing ${label} anchor`);
  const targetIndex = source.indexOf(target, anchorIndex);
  if (targetIndex < 0 || targetIndex - anchorIndex > 700) {
    throw new Error(`Missing ${label} target near anchor`);
  }
  return source.slice(0, targetIndex) + replacement + source.slice(targetIndex + target.length);
}

for (const role of ['host', 'guest']) {
  const oldPoints = [10, 12, 14, 16, 18];
  const newPoints = [10, 10, 11, 12, 13, 14];
  const streakChecks = ['=== 0', '=== 1', '=== 2', '=== 3', '>= 4'];

  streakChecks.forEach((check, index) => {
    const oldClause = `(data.child('players/${role}/streak').val() ${check} && newData.child('lastMove/points').val() === ${oldPoints[index]})`;
    const newCheck = index < 4 ? `=== ${index}` : '=== 4';
    const newClause = index < 4
      ? `(data.child('players/${role}/streak').val() ${newCheck} && newData.child('lastMove/points').val() === ${newPoints[index]})`
      : `((data.child('players/${role}/streak').val() === 4 && newData.child('lastMove/points').val() === 13) || (data.child('players/${role}/streak').val() >= 5 && newData.child('lastMove/points').val() === 14))`;
    const replacement = `((${versionPath} === '21.6-category-games' && ${oldClause}) || (${versionPath} === '21.8-learning-options' && ${newClause}))`;
    category = replaceExact(category, oldClause, replacement, `${role} streak ${index}`);
  });

  const incorrectAnchor = `newData.child('lastMove/correct').val() === false\n          && newData.child('players/${role}/streak').val() === 0`;
  const unchangedScore = `newData.child('players/${role}/score').val() === data.child('players/${role}/score').val()`;
  const deductedScore = `((${versionPath} === '21.6-category-games' && ${unchangedScore}) || (${versionPath} === '21.8-learning-options' && ((data.child('players/${role}/score').val() >= 2 && newData.child('players/${role}/score').val() === data.child('players/${role}/score').val() - 2) || (data.child('players/${role}/score').val() < 2 && newData.child('players/${role}/score').val() === 0))))`;
  category = replaceAfter(category, incorrectAnchor, unchangedScore, deductedScore, `${role} incorrect score`);
}

const wrongMoveAnchor = "newData.child('lastMove/correct').val() === false";
const zeroPoints = "newData.child('lastMove/points').val() === 0";
const versionedWrongPoints = `((${versionPath} === '21.6-category-games' && ${zeroPoints}) || (${versionPath} === '21.8-learning-options' && newData.child('lastMove/points').val() === -2))`;
category = replaceAfter(category, wrongMoveAnchor, zeroPoints, versionedWrongPoints, 'wrong-move points');

roomRules.game['.validate'] = prefix + category;
roomRules.game.lastMove.points['.validate'] =
  "newData.isNumber() && (newData.val() === -2 || newData.val() === 0 || newData.val() === 10 || newData.val() === 11 || newData.val() === 12 || newData.val() === 13 || newData.val() === 14 || newData.val() === 16 || newData.val() === 18)";

fs.writeFileSync(path, `${JSON.stringify(document, null, 2)}\n`);
