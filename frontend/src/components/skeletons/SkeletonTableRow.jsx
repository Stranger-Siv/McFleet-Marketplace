function SkeletonTableRow({ columns = 4 }) {
    const rowStyle = {
        display: 'flex',
        gap: '16px',
        padding: '12px 16px',
        borderBottom: '1px solid #2d3447',
        alignItems: 'center'
    };

    const cellStyle = {
        flex: 1,
        height: '16px',
        backgroundColor: '#252b42',
        borderRadius: '4px',
        position: 'relative',
        overflow: 'hidden'
    };

    const shimmerStyle = {
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent)',
        animation: 'shimmer 1.5s infinite'
    };

    return (
        <>
            <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
            <div style={rowStyle}>
                {Array.from({ length: columns }).map((_, i) => (
                    <div key={i} style={{ ...cellStyle, width: i === columns - 1 ? '120px' : 'auto' }}>
                        <div style={shimmerStyle}></div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default SkeletonTableRow;

