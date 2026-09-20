// AWS Amplify & Amazon Cognito Configuration File
// Populated automatically or via environment variables in production deployments

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || 'us-east-1_farmmitraDemo',
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || 'farmmitraClientIdDemo',
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        phone: true
      }
    }
  },
  API: {
    REST: {
      FarmMitraApi: {
        endpoint: import.meta.env.VITE_AWS_API_GATEWAY_URL || 'https://api.farmmitra.in/v1',
        region: import.meta.env.VITE_AWS_REGION || 'us-east-1'
      }
    }
  },
  Storage: {
    S3: {
      bucket: import.meta.env.VITE_AWS_S3_BUCKET || 'farmmitra-crop-images',
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1'
    }
  }
};

export default awsConfig;

