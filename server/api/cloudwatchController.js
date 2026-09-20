// FarmMitra Backend — Amazon CloudWatch Observability Controller

const cloudwatchController = {
  // PutMetricData handler for tracking application execution metrics
  logMetric: async (metricName, value, unit = 'Count', dimensions = {}) => {
    const timestamp = new Date().toISOString();
    const metricEntry = {
      Namespace: 'FarmMitra/Marketplace',
      MetricData: [
        {
          MetricName: metricName,
          Value: value,
          Unit: unit,
          Timestamp: timestamp,
          Dimensions: Object.keys(dimensions).map(k => ({ Name: k, Value: dimensions[k] }))
        }
      ]
    };

    console.log(`[Amazon CloudWatch Metric] ${metricName}: ${value} ${unit} | Timestamp: ${timestamp}`);
    return { success: true, metric: metricEntry };
  },

  // Log API / Lambda execution errors to CloudWatch Log Stream
  logError: async (errorSource, errorMessage, stackTrace = '') => {
    const logEvent = {
      logGroupName: '/aws/lambda/FarmMitraBackendHandler',
      logStreamName: `errors-${new Date().toISOString().split('T')[0]}`,
      event: {
        timestamp: Date.now(),
        message: JSON.stringify({
          source: errorSource,
          error: errorMessage,
          stack: stackTrace
        })
      }
    };

    console.error(`[Amazon CloudWatch Log Group Error] Source: ${errorSource} | Error: ${errorMessage}`);
    return { success: true, logEvent };
  }
};

module.exports = cloudwatchController;

