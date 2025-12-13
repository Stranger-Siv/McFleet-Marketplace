function OrderTimeline({ order }) {
  if (!order) return null;

  const timelineSteps = [
    {
      id: 'created',
      label: 'Order Created',
      status: 'created'
    },
    {
      id: 'paid',
      label: 'Payment Marked Paid',
      status: 'paid'
    },
    {
      id: 'collected',
      label: 'Item Collected',
      status: 'item_collected'
    },
    {
      id: 'delivered',
      label: 'Item Delivered',
      status: 'item_delivered'
    },
    {
      id: 'completed',
      label: 'Order Completed',
      status: 'completed'
    }
  ];

  const getStepStatus = (step, currentOrderStatus) => {
    // Handle cancelled orders
    if (currentOrderStatus === 'cancelled') {
      if (step.id === 'created') return 'completed';
      return 'cancelled';
    }
    
    if (step.id === 'created') {
      return 'completed';
    }
    
    if (step.id === 'paid') {
      if (currentOrderStatus === 'pending_payment') return 'pending';
      return 'completed';
    }
    
    if (step.id === 'collected') {
      if (['pending_payment', 'paid'].includes(currentOrderStatus)) return 'pending';
      return 'completed';
    }
    
    if (step.id === 'delivered') {
      if (['pending_payment', 'paid', 'item_collected'].includes(currentOrderStatus)) return 'pending';
      return 'completed';
    }
    
    if (step.id === 'completed') {
      if (currentOrderStatus === 'completed') return 'completed';
      return 'pending';
    }
    
    return 'pending';
  };

  const getStepTimestamp = (step, orderStatus, orderCreatedAt, orderUpdatedAt) => {
    // Order created always has timestamp
    if (step.id === 'created') {
      return orderCreatedAt;
    }
    
    // For other steps, show timestamp only if the step is completed
    const stepStatus = getStepStatus(step, orderStatus);
    if (stepStatus === 'completed') {
      // If this is the current status, use updatedAt
      // Otherwise, we don't have exact timestamp (would need backend changes)
      // For now, show updatedAt if it's the current step
      if (step.status === orderStatus) {
        return orderUpdatedAt;
      }
      // For past steps, we don't have exact timestamps without backend changes
      // Return null to indicate we don't know the exact time
      return null;
    }
    
    return null;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const containerStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const timelineStyle = {
    position: 'relative',
    paddingLeft: '32px'
  };

  const stepStyle = (isCompleted, isPending) => ({
    position: 'relative',
    paddingBottom: '32px',
    paddingLeft: '40px'
  });

  const stepLineStyle = (isCompleted) => ({
    position: 'absolute',
    left: '7px',
    top: '24px',
    bottom: '-8px',
    width: '2px',
    backgroundColor: isCompleted ? '#10b981' : '#2d3447',
    transition: 'background-color 0.3s ease'
  });

  const stepIconStyle = (isCompleted, isPending, isCancelled) => ({
    position: 'absolute',
    left: '0',
    top: '0',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: isCancelled ? '#ef4245' : isCompleted ? '#10b981' : isPending ? '#2d3447' : '#6b7280',
    border: `3px solid ${isCancelled ? '#ef4245' : isCompleted ? '#10b981' : '#1e2338'}`,
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  });

  const stepIconInnerStyle = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#ffffff'
  };

  const stepContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const stepLabelStyle = (isCompleted, isPending) => ({
    color: isCompleted ? '#ffffff' : isPending ? '#6b7280' : '#b8bcc8',
    fontSize: '14px',
    fontWeight: isCompleted ? '600' : '500',
    transition: 'color 0.3s ease'
  });

  const stepTimestampStyle = {
    color: '#6b7280',
    fontSize: '12px',
    fontStyle: 'italic'
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>
        <span>📋</span>
        Order Timeline
      </h3>
      
      <div style={timelineStyle}>
        {timelineSteps.map((step, index) => {
          const stepStatus = getStepStatus(step, order.status);
          const isCompleted = stepStatus === 'completed';
          const isPending = stepStatus === 'pending';
          const isCancelled = stepStatus === 'cancelled';
          const isLast = index === timelineSteps.length - 1;
          const timestamp = getStepTimestamp(step, order.status, order.createdAt, order.updatedAt);
          const formattedTimestamp = timestamp ? formatTimestamp(timestamp) : null;

          return (
            <div key={step.id} style={stepStyle(isCompleted, isPending)}>
              {/* Vertical line */}
              {!isLast && (
                <div style={stepLineStyle(isCompleted)}></div>
              )}
              
              {/* Step icon */}
              <div style={stepIconStyle(isCompleted, isPending, isCancelled)}>
                {isCompleted && !isCancelled && (
                  <div style={stepIconInnerStyle}></div>
                )}
                {isCancelled && (
                  <span style={{ color: '#ffffff', fontSize: '10px' }}>✕</span>
                )}
              </div>
              
              {/* Step content */}
              <div style={stepContentStyle}>
                <div style={stepLabelStyle(isCompleted, isPending)}>
                  {step.label}
                </div>
                {formattedTimestamp && (
                  <div style={stepTimestampStyle}>
                    {formattedTimestamp}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTimeline;

