// matcher.js birim testleri — node --test ile çalışır, Firebase gerekmez.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  reduceToShared,
  scoreTemplate,
  pickTemplate,
} from '../lib/matcher.js'
import { DATE_TEMPLATES } from '../lib/dateTemplates.js'

test('budget MIN alınır (kimse bütçesini aşmaz)', () => {
  const s = reduceToShared(
    { budget: 3, activities: ['kahve'], energy: 'sakin', timeOfDay: 'akşam' },
    { budget: 1, activities: ['kahve'], energy: 'sakin', timeOfDay: 'akşam' },
  )
  assert.equal(s.budget, 1)
})

test('activities kesişim varsa kesişim kullanılır', () => {
  const s = reduceToShared(
    { budget: 2, activities: ['kahve', 'yemek'], energy: 'sakin', timeOfDay: 'akşam' },
    { budget: 2, activities: ['kahve', 'bar'], energy: 'sakin', timeOfDay: 'akşam' },
  )
  assert.equal(s.activitiesMode, 'intersection')
  assert.deepEqual(s.activities, ['kahve'])
})

test('activities kesişim boşsa birleşime düşer', () => {
  const s = reduceToShared(
    { budget: 2, activities: ['kahve'], energy: 'sakin', timeOfDay: 'akşam' },
    { budget: 2, activities: ['bar'], energy: 'sakin', timeOfDay: 'akşam' },
  )
  assert.equal(s.activitiesMode, 'union')
  assert.deepEqual(s.activities.sort(), ['bar', 'kahve'])
})

test('energy farklıysa null (nötr)', () => {
  const s = reduceToShared(
    { budget: 2, activities: ['kahve'], energy: 'sakin', timeOfDay: 'akşam' },
    { budget: 2, activities: ['kahve'], energy: 'hareketli', timeOfDay: 'akşam' },
  )
  assert.equal(s.energy, null)
})

test('bütçeyi aşan şablon elenir (null skor)', () => {
  const tmpl = { minBudget: 3, activities: ['bar'], energy: 'sakin', timeOfDay: ['akşam'] }
  const shared = { budget: 1, activities: ['bar'], energy: 'sakin', timeOfDay: 'akşam' }
  assert.equal(scoreTemplate(tmpl, shared), null)
})

test('puanlama: aktivite*3 + enerji2 + zaman1', () => {
  const tmpl = { minBudget: 1, activities: ['kahve'], energy: 'sakin', timeOfDay: ['akşam'] }
  const shared = { budget: 2, activities: ['kahve'], energy: 'sakin', timeOfDay: 'akşam' }
  // 3*1 (kahve) + 2 (enerji) + 1 (zaman) = 6
  assert.equal(scoreTemplate(tmpl, shared), 6)
})

test('gerçek şablon havuzundan uygun bir seçim döner', () => {
  const shared = reduceToShared(
    { budget: 2, activities: ['kahve', 'yuruyus'], energy: 'sakin', timeOfDay: 'gündüz' },
    { budget: 3, activities: ['kahve'], energy: 'sakin', timeOfDay: 'gündüz' },
  )
  const picked = pickTemplate(DATE_TEMPLATES, shared, () => 0) // deterministik: ilk
  assert.ok(picked)
  assert.ok(picked.score > 0)
  assert.ok(picked.template.minBudget <= shared.budget)
})

test('hiç uygun şablon yoksa null döner', () => {
  const shared = { budget: 1, activities: ['xyz-yok'], energy: null, timeOfDay: null }
  // Sadece minBudget=1 ve 0 aktivite örtüşmesi → hepsi 0 skor → null
  const picked = pickTemplate(
    [{ id: 't', minBudget: 3, activities: ['bar'], energy: 'sakin', timeOfDay: ['akşam'] }],
    shared,
  )
  assert.equal(picked, null)
})
