export default function QRCode({ value, size = 180 }) {
    const modules = 25
    const cell = size / modules

    // Hash simple del string para generar patrón único
    const hash = (s) =>
        [...s].reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0) | 0, 0)
    const seed = Math.abs(hash(value))

    const grid = Array.from({ length: modules }, (_, r) =>
        Array.from({ length: modules }, (_, c) => {
            // Esquinas de finder pattern (3 cuadros de posición)
            if (r < 7 && c < 7) return 1
            if (r < 7 && c > modules - 8) return 1
            if (r > modules - 8 && c < 7) return 1
            // Separadores
            if (r === 7 || r === modules - 8) return (c < 8 || c > modules - 9) ? 1 : 0
            if (c === 7 || c === modules - 8) return (r < 8 || r > modules - 9) ? 1 : 0
            // Datos generados por hash del uid
            return ((seed ^ (r * 37 + c * 17) ^ (r * c)) & 1) ? 1 : 0
        })
    )

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
            <rect width={size} height={size} fill="white" rx="12" />
            {grid.map((row, r) =>
                row.map((on, c) =>
                    on ? (
                        <rect
                            key={`${r}-${c}`}
                            x={c * cell} y={r * cell}
                            width={cell} height={cell}
                            fill="#1C1917"
                        />
                    ) : null
                )
            )}
        </svg>
    )
}