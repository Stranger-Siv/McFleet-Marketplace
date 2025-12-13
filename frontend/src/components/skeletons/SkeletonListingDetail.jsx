function SkeletonListingDetail() {
    const containerStyle = {
        maxWidth: '1400px',
        margin: '0 auto'
    };

    const mainLayoutStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 420px',
        gap: '32px',
        marginBottom: '48px'
    };

    const previewSectionStyle = {
        backgroundColor: '#1e2338',
        border: '1px solid #2d3447',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
    };

    const imageContainerStyle = {
        width: '100%',
        height: '500px',
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

    const infoSectionStyle = {
        padding: '32px'
    };

    const skeletonBlockStyle = {
        height: '20px',
        backgroundColor: '#252b42',
        borderRadius: '4px',
        marginBottom: '16px',
        position: 'relative',
        overflow: 'hidden'
    };

    const purchasePanelStyle = {
        backgroundColor: '#1e2338',
        border: '1px solid #2d3447',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
    };

    const skeletonButtonStyle = {
        width: '100%',
        height: '52px',
        backgroundColor: '#252b42',
        borderRadius: '8px',
        marginBottom: '12px',
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
            <div style={containerStyle}>
                <div style={mainLayoutStyle}>
                    {/* Left: Item Preview Skeleton */}
                    <div style={previewSectionStyle}>
                        <div style={imageContainerStyle}>
                            <div style={shimmerStyle}></div>
                        </div>
                        <div style={infoSectionStyle}>
                            <div style={{ ...skeletonBlockStyle, height: '32px', width: '70%', marginBottom: '16px' }}>
                                <div style={shimmerStyle}></div>
                            </div>
                            <div style={{ ...skeletonBlockStyle, height: '16px', width: '40%', marginBottom: '24px' }}>
                                <div style={shimmerStyle}></div>
                            </div>
                            <div style={{ ...skeletonBlockStyle, height: '80px', marginBottom: '16px' }}>
                                <div style={shimmerStyle}></div>
                            </div>
                            <div style={{ ...skeletonBlockStyle, height: '80px' }}>
                                <div style={shimmerStyle}></div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Purchase Panel Skeleton */}
                    <div style={purchasePanelStyle}>
                        <div style={{ ...skeletonBlockStyle, height: '48px', width: '60%', marginBottom: '8px' }}>
                            <div style={shimmerStyle}></div>
                        </div>
                        <div style={{ ...skeletonBlockStyle, height: '16px', width: '40%', marginBottom: '24px' }}>
                            <div style={shimmerStyle}></div>
                        </div>
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{ ...skeletonBlockStyle, height: '60px', marginBottom: '16px' }}>
                                <div style={shimmerStyle}></div>
                            </div>
                        ))}
                        <div style={skeletonButtonStyle}>
                            <div style={shimmerStyle}></div>
                        </div>
                        <div style={{ ...skeletonBlockStyle, height: '120px', marginTop: '24px' }}>
                            <div style={shimmerStyle}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SkeletonListingDetail;

