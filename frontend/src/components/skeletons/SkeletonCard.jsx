function SkeletonCard() {
    const cardStyle = {
        backgroundColor: '#1e2338',
        border: '1px solid #2d3447',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
    };

    const imageSkeletonStyle = {
        width: '100%',
        height: '200px',
        backgroundColor: '#1a1f35',
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

    const contentStyle = {
        padding: '20px'
    };

    const textSkeletonStyle = {
        height: '16px',
        backgroundColor: '#252b42',
        borderRadius: '4px',
        marginBottom: '12px',
        position: 'relative',
        overflow: 'hidden'
    };

    const titleSkeletonStyle = {
        ...textSkeletonStyle,
        height: '20px',
        width: '70%',
        marginBottom: '16px'
    };

    const priceSkeletonStyle = {
        ...textSkeletonStyle,
        height: '28px',
        width: '40%',
        marginBottom: '16px'
    };

    const buttonSkeletonStyle = {
        width: '100%',
        height: '44px',
        backgroundColor: '#252b42',
        borderRadius: '8px',
        marginTop: '12px',
        position: 'relative',
        overflow: 'hidden'
    };

    return (
        <>
            <style>{`
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
            <div style={cardStyle}>
                <div style={imageSkeletonStyle}>
                    <div style={shimmerStyle}></div>
                </div>
                <div style={contentStyle}>
                    <div style={titleSkeletonStyle}>
                        <div style={shimmerStyle}></div>
                    </div>
                    <div style={textSkeletonStyle}>
                        <div style={shimmerStyle}></div>
                    </div>
                    <div style={{ ...textSkeletonStyle, width: '60%' }}>
                        <div style={shimmerStyle}></div>
                    </div>
                    <div style={priceSkeletonStyle}>
                        <div style={shimmerStyle}></div>
                    </div>
                    <div style={buttonSkeletonStyle}>
                        <div style={shimmerStyle}></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SkeletonCard;

