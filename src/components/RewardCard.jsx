import { IceCreamBowl, Citrus, CupSoda, Tag, Users, Sparkles } from 'lucide-react'

const ICON_MAP = {
    r1: IceCreamBowl,
    r2: Citrus,
    r3: CupSoda,
    r4: Tag,
    r5: Users,
    r6: Sparkles,
}

export default function RewardCard({ reward, userPoints, onSelect, redeemed }) {
    const canRedeem = userPoints >= reward.pts
    const isDone    = redeemed
    const Icon      = ICON_MAP[reward.id] || Sparkles

    return (
        <button
            onClick={() => !isDone && onSelect(reward)}
            style={{
                background: isDone
                    ? 'rgba(245,237,228,0.6)'
                    : 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${isDone
                    ? 'rgba(232,224,216,0.8)'
                    : canRedeem
                        ? `${reward.accent}55`
                        : 'rgba(255,255,255,0.85)'}`,
                borderRadius: '20px',
                padding: '16px',
                cursor: isDone ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.25s',
                opacity: isDone ? 0.65 : 1,
                position: 'relative',
                overflow: 'hidden',
                WebkitTapHighlightColor: 'transparent',
                boxShadow: canRedeem && !isDone
                    ? `inset 0 1.5px 0 rgba(255,255,255,0.9), 0 4px 16px ${reward.accent}22`
                    : 'inset 0 1.5px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(0,0,0,0.04)',
            }}
        >
            {/* Highlight glass */}
            <div style={{
                position: 'absolute', top: 0, left: '5%', width: '90%', height: '50%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%)',
                borderRadius: '20px 20px 0 0',
                pointerEvents: 'none',
            }} />

            {/* Check canjeado */}
            {isDone && (
                <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    width: '20px', height: '20px',
                    background: '#2BBFAA', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', color: 'white', fontWeight: '700',
                }}>✓</div>
            )}

            {/* Ícono */}
            <div style={{
                width: '44px', height: '44px',
                background: isDone ? 'rgba(168,162,158,0.1)' : `${reward.accent}18`,
                border: `1px solid ${isDone ? 'rgba(168,162,158,0.2)' : `${reward.accent}30`}`,
                borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '10px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
                position: 'relative',
            }}>
                <Icon
                    size={22}
                    color={isDone ? '#A8A29E' : reward.accent}
                    strokeWidth={2}
                />
            </div>

            <p style={{
                fontSize: '13px', fontWeight: '700',
                color: isDone ? '#A8A29E' : '#1C1917',
                marginBottom: '3px', lineHeight: 1.2,
                position: 'relative',
            }}>
                {reward.name}
            </p>
            <p style={{
                fontSize: '11px', color: '#A8A29E',
                marginBottom: '10px', lineHeight: 1.3,
                position: 'relative',
            }}>
                {reward.desc}
            </p>

            <span style={{
                background: isDone
                    ? 'rgba(168,162,158,0.12)'
                    : canRedeem
                        ? `${reward.accent}18`
                        : 'rgba(232,224,216,0.8)',
                color: isDone
                    ? '#A8A29E'
                    : canRedeem ? reward.accent : '#A8A29E',
                border: `1px solid ${isDone || !canRedeem ? 'transparent' : `${reward.accent}30`}`,
                padding: '4px 10px',
                borderRadius: '100px',
                fontSize: '11px', fontWeight: '700',
                position: 'relative',
            }}>
                {isDone ? '✓ Canjeado' : `${reward.pts} pts`}
            </span>
        </button>
    )
}