import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0e27 0%, #131829 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1e2338',
            border: '1px solid #2d3447',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            maxWidth: '600px',
            width: '100%'
          }}>
            <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>⚠️ Something went wrong</h2>
            <p style={{ color: '#b8bcc8', marginBottom: '24px' }}>
              An error occurred while loading the application.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#fbbf24',
                color: '#0a0e27',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginTop: '24px', textAlign: 'left' }}>
                <summary style={{ color: '#b8bcc8', cursor: 'pointer', marginBottom: '8px' }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  overflow: 'auto',
                  backgroundColor: '#0a0e27',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

