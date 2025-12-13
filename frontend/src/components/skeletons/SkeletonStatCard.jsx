function SkeletonStatCard() {
    const cardStyle = {
        border: '1px solid #2d3447',
        borderRadius: '12px',
        padding: '28px',
        backgroundColor: '#1e2338',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.3s ease'
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

    const titleSkeletonStyle = {
        height: '14px',
        width: '60%',
        backgroundColor: '#252b42',
        borderRadius: '4px',
        marginBottom: '16px',
        position: 'relative',
        overflow: 'hidden'
    };

    const valueSkeletonStyle = {
        height: '36px',
        width: '70%',
        backgroundColor: '#252b42',
        borderRadius: '4px',
        position: 'relative',
        overflow: 'hidden'
    };

    return (
        <>
            <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
            <div style={cardStyle}>
                <div style={titleSkeletonStyle}>
                    <div style={shimmerStyle}></div>
                </div>
                <div style={valueSkeletonStyle}>
                    <div style={shimmerStyle}></div>
                </div>
            </div>
        </>
    );
}

export default SkeletonStatCard;

