// İki date şablon kopyasının senkron olduğunu doğrular (client ↔ functions).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DATE_TEMPLATES as fnTemplates } from '../lib/dateTemplates.js'
import { DATE_TEMPLATES as clientTemplates } from '../../src/data/dateTemplates.js'

test('functions ve client şablonları birebir aynı', () => {
  assert.equal(fnTemplates.length, clientTemplates.length)
  assert.deepEqual(
    fnTemplates.map((t) => t.id).sort(),
    clientTemplates.map((t) => t.id).sort(),
  )
  // Puanlamayı etkileyen alanlar birebir eşleşmeli
  const norm = (list) =>
    Object.fromEntries(
      list.map((t) => [
        t.id,
        { minBudget: t.minBudget, energy: t.energy, activities: [...t.activities].sort(), timeOfDay: [...t.timeOfDay].sort() },
      ]),
    )
  assert.deepEqual(norm(fnTemplates), norm(clientTemplates))
})
