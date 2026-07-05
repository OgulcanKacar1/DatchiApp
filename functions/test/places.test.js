// places.js testleri — stub sağlayıcı ile (anahtar gerekmez).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { computeMidpoint, findVenue } from '../lib/places.js'

test('computeMidpoint iki noktanın ortasını verir', () => {
  const mid = computeMidpoint({ lat: 41.0, lng: 29.0 }, { lat: 41.1, lng: 29.2 })
  assert.equal(mid.lat, 41.05)
  assert.ok(Math.abs(mid.lng - 29.1) < 1e-9)
})

test('findVenue stub ile geçerli bir mekân döner', async () => {
  const mid = { lat: 41.05, lng: 29.05 }
  const venue = await findVenue(mid, ['specialty coffee'])
  assert.ok(venue)
  assert.ok(venue.name.includes('specialty coffee'))
  assert.ok(typeof venue.lat === 'number' && typeof venue.lng === 'number')
  assert.ok(venue.mapsUrl.startsWith('https://'))
})
