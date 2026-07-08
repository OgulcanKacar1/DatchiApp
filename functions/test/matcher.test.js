// matcher.js birim testleri — node --test ile çalışır, Firebase gerekmez.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  reduceToShared,
  scoreTemplate,
  pickTemplate,
} from '../lib/matcher.js'
import { DATE_TEMPLATES } from '../lib/dateTemplates.js'

// ── "Farketmez" (wildcard) senaryoları ──
test('budget farketmez (null) → diğerinin bütçesi geçerli', () => {
  const s = reduceToShared(
    { budget: null, activities: ['kahve'], energy: null, timeOfDay: null },
    { budget: 2, activities: ['kahve'], energy: null, timeOfDay: null },
  )
  assert.equal(s.budget, 2)
})

test('ikisi de budget farketmez → orta (2) varsayılan', () => {
  const s = reduceToShared(
    { budget: null, activities: [], energy: null, timeOfDay: null },
    { budget: null, activities: [], energy: null, timeOfDay: null },
  )
  assert.equal(s.budget, 2)
})

test('aktivite: bir taraf farketmez → seçen tarafa bırakılır', () => {
  const s = reduceToShared(
    { budget: 2, activities: ['bar'], energy: null, timeOfDay: null },
    { budget: 2, activities: [], energy: null, timeOfDay: null },
  )
  assert.deepEqual(s.activities, ['bar'])
  assert.equal(s.activitiesMode, 'intersection')
})

test('ikisi de aktivite farketmez → mode "any", boş liste', () => {
  const s = reduceToShared(
    { budget: 2, activities: [], energy: null, timeOfDay: null },
    { budget: 2, activities: [], energy: null, timeOfDay: null },
  )
  assert.deepEqual(s.activities, [])
  assert.equal(s.activitiesMode, 'any')
})

test('enerji: bir taraf farketmez → diğerininki', () => {
  const s = reduceToShared(
    { budget: 2, activities: ['kahve'], energy: 'sakin', timeOfDay: null },
    { budget: 2, activities: ['kahve'], energy: null, timeOfDay: null },
  )
  assert.equal(s.energy, 'sakin')
})

test('tamamen esnek çift bile bir öneri alır (boş dönmez)', () => {
  const shared = reduceToShared(
    { budget: null, activities: [], energy: null, timeOfDay: null, location: { lat: 41, lng: 29 } },
    { budget: null, activities: [], energy: null, timeOfDay: null, location: { lat: 41, lng: 29 } },
  )
  const picked = pickTemplate(DATE_TEMPLATES, shared, () => 0)
  assert.ok(picked, 'esnek çift için de bir şablon dönmeli')
  assert.ok(picked.template.minBudget <= shared.budget)
})

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
