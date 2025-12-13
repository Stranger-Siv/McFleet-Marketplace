function SkeletonText({ width = '100%', height = '16px', lines = 1 }) {
    const shimmerStyle = {
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent)',
        animation: 'shimmer 1.5s infinite'
    };

    const textStyle = {
        height,
        width,
        backgroundColor: '#252b42',
        borderRadius: '4px',
        marginBottom: '8px',
        position: 'relative',
        overflow: 'hidden'
    };

    if (lines === 1) {
        return (
            <>
                <style>{`
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}</style>
                <div style={textStyle}>
                    <div style={shimmerStyle}></div>
                </div>
            </>
        );
    }

    return (
        <>
            <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
            <div>
                {Array.from({ length: lines }).map((_, i) => (
                    <div key={i} style={{ ...textStyle, width: i === lines - 1 ? '80%' : '100%' }}>
                        <div style={shimmerStyle}></div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default SkeletonText;

