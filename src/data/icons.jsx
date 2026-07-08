// Aktivite / enerji / zaman → lucide ikon eşlemesi.
// Emoji yerine tutarlı çizgi ikonlar (daha az "AI", daha marka).
import {
  Coffee,
  UtensilsCrossed,
  IceCreamCone,
  Martini,
  Footprints,
  Dices,
  Drama,
  Film,
  Bike,
  ShoppingBag,
  Moon,
  Zap,
  Sun,
  MoonStar,
} from 'lucide-react'

export const ACTIVITY_ICON = {
  kahve: Coffee,
  yemek: UtensilsCrossed,
  tatli: IceCreamCone,
  bar: Martini,
  yuruyus: Footprints,
  aktivite: Dices,
  kultur: Drama,
  sinema: Film,
  spor: Bike,
  alisveris: ShoppingBag,
}

export const ENERGY_ICON = {
  sakin: Moon,
  hareketli: Zap,
}

export const TIME_ICON = {
  gündüz: Sun,
  akşam: MoonStar,
}

// id → ikon bileşeni (yoksa null)
export function activityIcon(id) {
  return ACTIVITY_ICON[id] ?? null
}
