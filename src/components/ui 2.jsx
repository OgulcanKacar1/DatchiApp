// Paylaşılan UI primitive'leri — Datchi tasarım sistemi (sıcak & flörtöz)
// Tüm ekranlar bunları kullanır → tek yerden tutarlılık.

function cx(...c) {
  return c.filter(Boolean).join(' ')
}

// Buton — primary (dolu coral) / soft (açık) / ghost
export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300'
  const variants = {
    primary:
      'bg-brand-500 text-white shadow-[var(--shadow-soft)] hover:bg-brand-600',
    soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
    ghost: 'text-brand-600 hover:bg-brand-50',
  }
  return (
    <button type={type} className={cx(base, variants[variant], className)} {...props} />
  )
}

// Kart — yumuşak, kremsi, hafif kenarlıklı
export function Card({ className, ...props }) {
  return (
    <div
      className={cx(
        'rounded-[var(--radius-xl)] border border-sand-200 bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_-12px_rgba(43,32,40,0.15)]',
        className,
      )}
      {...props}
    />
  )
}

// Küçük etiket
export function Chip({ active, className, ...props }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold transition',
        active
          ? 'border-brand-300 bg-brand-50 text-brand-700'
          : 'border-sand-200 bg-white text-ink',
        className,
      )}
      {...props}
    />
  )
}

// Bölüm başlığı üstü küçük etiket (uppercase)
export function Eyebrow({ className, ...props }) {
  return (
    <p
      className={cx(
        'text-xs font-bold uppercase tracking-widest text-brand-500',
        className,
      )}
      {...props}
    />
  )
}
