function LoadingSpinner({ size = '20px', color = '#fbbf24' }) {
    const spinnerStyle = {
        width: size,
        height: size,
        border: `2px solid ${color}20`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block'
    };

    return (
        <>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
            <span style={spinnerStyle}></span>
        </>
    );
}

export default LoadingSpinner;

