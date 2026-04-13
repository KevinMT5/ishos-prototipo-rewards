export default function RewardCard({ reward, userPoints, onSelect, redeemed }) {
    const canRedeem = userPoints >= reward.pts
    const isDone = redeemed

    return (
        <button
            onClick={() => !isDone && onSelect(reward)}
            style={{
                background: isDone ? '#F5EDE4' : reward.color,
                border: `1.5px solid ${isDone ? '#E8E0D8' : canRedeem ? reward.accent : 'transparent'}`,
                borderRadius: '16px',
                padding: '16px',
                cursor: isDone ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                opacity: isDone ? 0.7 : 1,
                position: 'relative',
                overflow: 'hidden',
                WebkitTapHighlightColor: 'transparent',
            }}
        >
            {/* Check si ya fue canjeado */}
            {isDone && (
                <div style={{
                    position: 'absolute', top: '8px', right: '8px',
                    width: '20px', height: '20px',
                    background: '#2BBFAA', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', color: 'white'
                }}>✓</div>
            )}

            {/* Overlay bloqueado si no hay puntos */}
            {!canRedeem && !isDone && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '16px',
                }} />
            )}

            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{reward.emoji}</div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#1C1917', marginBottom: '2px', lineHeight: 1.2 }}>
                {reward.name}
            </p>
            <p style={{ fontSize: '11px', color: '#78716C', marginBottom: '8px', lineHeight: 1.3 }}>
                {reward.desc}
            </p>
            <span style={{
                background: canRedeem && !isDone ? reward.accent : '#E8E0D8',
                color: canRedeem && !isDone ? 'white' : '#A8A29E',
                padding: '3px 8px',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: '600',
            }}>
                {isDone ? 'Canjeado' : `${reward.pts} pts`}
            </span>
        </button>
    )
}