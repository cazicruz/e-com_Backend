const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'B-Classy e-comm API',
      version: '1.0.0',
      description: 'A comprehensive API for e-commerce services including user authentication, product management, order processing, and payment handling.',
      contact: {
        name: 'B-Classy API Support',
        email: 'support@b-classy.com',
        url: 'https://b-classy.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      },
      {
        url: 'https://caspay.onrender.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            phone: { type: 'string', example: '08012345678' },
            wallet: {
              type: 'object',
              properties: {
                balance: { type: 'number', example: 10000 },
                currency: { type: 'string', example: 'NGN' }
              }
            },
            role: { type: 'string', enum: ['user', 'admin', 'agent'], example: 'user' },
            isVerified: { type: 'boolean', example: true },
            isActive: { type: 'boolean', example: true },
            referralCode: { type: 'string', example: 'REF123456789' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        OTPRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            phone: { type: 'string', example: '08012345678' }
          }
        },
        OTPVerify: {
          type: 'object',
          properties: {
            otp: { type: 'string', example: '123456' },
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            phone: { type: 'string', example: '08012345678' }
          }
        },
        PasswordReset: {
          type: 'object',
          properties: {
            otp: { type: 'string', example: '123456' },
            newPassword: { type: 'string', example: 'NewPassword123!' },
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            phone: { type: 'string', example: '08012345678' }
          }
        },
        EmailVerification: {
          type: 'object',
          properties: {
            otp: { type: 'string', example: '123456' },
            token: { type: 'string', example: 'uuid-token-here' },
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            transactionId: { type: 'string', example: 'TXN1234567890ABCDEF' },
            type: { 
              type: 'string', 
              enum: ['airtime', 'data', 'cable_tv', 'electricity', 'wallet_funding', 'wallet_withdrawal'],
              example: 'airtime'
            },
            service: { type: 'string', example: 'mtn_airtime' },
            provider: { type: 'string', example: 'VTPass' },
            amount: { type: 'number', example: 1000 },
            fee: { type: 'number', example: 25 },
            totalAmount: { type: 'number', example: 1025 },
            status: { 
              type: 'string', 
              enum: ['pending', 'processing', 'successful', 'failed', 'cancelled'],
              example: 'successful'
            },
            paymentMethod: { 
              type: 'string', 
              enum: ['wallet', 'card', 'bank_transfer', 'ussd'],
              example: 'wallet'
            },
            createdAt: { type: 'string', format: 'date-time' },
            completedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Email is required' },
                  value: { type: 'string', example: '' }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }
          }
        },
        OTPResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'OTP sent to your email/phone' },
            data: {
              type: 'object',
              properties: {
                otp: { type: 'string', example: '123456', description: 'OTP (only in development)' },
                expiresIn: { type: 'string', example: '10m' }
              }
            }
          }
        },
        VerificationResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Email verified successfully' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'VTU Services',
        description: 'Virtual Top-Up services (airtime, data, cable TV, electricity)'
      },
      {
        name: 'Wallet',
        description: 'Wallet management and transactions'
      },
      {
        name: 'Health',
        description: 'API health and status endpoints'
      }
    ]
  },
  apis: [
    './routes/api/*.js',
    './controllers/*.js',
    './models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs; 