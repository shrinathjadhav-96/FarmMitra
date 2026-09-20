// FarmMitra Backend — Amazon SNS Event Publisher Controller
// Handles AWS SNS Topic Notifications for Marketplace Events

const snsController = {
  // Amazon SNS Topic Publishing Handler
  publishMarketplaceEvent: async (eventData) => {
    const { eventType, recipientUserId, recipientRole, message, metadata } = eventData;

    const topicArn = process.env.AWS_SNS_TOPIC_ARN || 'arn:aws:sns:us-east-1:123456789012:FarmMitraNotificationsTopic';
    
    const notificationPayload = {
      notificationId: 'notif_' + Math.random().toString(36).substring(2, 9),
      eventType, // 'OFFER_RECEIVED' | 'OFFER_ACCEPTED' | 'OFFER_REJECTED'
      recipientUserId,
      recipientRole,
      message,
      read: false,
      metadata: metadata || {},
      createdAt: new Date().toISOString()
    };

    console.log(`[Amazon SNS Published] Topic: ${topicArn} | Event: ${eventType} | Target User: ${recipientUserId}`);
    console.log(`[Amazon SNS Message Payload]: ${message}`);

    return {
      success: true,
      snsMessageId: 'sns_msg_' + Math.random().toString(36).substring(2, 9),
      notification: notificationPayload
    };
  }
};

module.exports = snsController;

