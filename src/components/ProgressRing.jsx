export default function ProgressRing({ pts, max, size = 120 }) {
    const r = (size - 16) / 2
    const circ = 2 * Math.PI * r
    const pct = Math.min(pts / max, 1)
    const dash = pct * circ

    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke="#F5EDE4" strokeWidth="10"
            />
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke="#2BBFAA" strokeWidth="10"
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
        </svg>
    )
}