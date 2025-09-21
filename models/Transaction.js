const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    default: function () {
      return this._id; // Use Mongo _id
    }
  },
  type: {
    type: String,
    enum: ['airtime', 'data', 'cable_tv', 'electricity', 'wallet_funding', 'wallet_withdrawal'],
    required: true
  },
  service: {
    type: String,
    required: true,
    enum: [
      // Airtime services
      'mtn_airtime', 'airtel_airtime', 'glo_airtime', '9mobile_airtime',
      // Data services
      'mtn_data', 'airtel_data', 'glo_data', '9mobile_data',
      // Cable TV services
      'dstv', 'gotv', 'startimes', 'showmax',
      // Electricity services
      'ikeja_electric', 'eko_electric', 'kano_electric', 'kaduna_electric',
      'jos_electric', 'ibadan_electric', 'enugu_electric', 'port_harcourt_electric',
      'abuja_electric', 'benin_electric', 'yola_electric', 'maiduguri_electric',
      'wallet_funding','wallet_withdrawal'
    ]
  },
  provider: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  fee: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'success', 'failed', 'cancelled','abandoned'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['wallet', 'card', 'bank_transfer', 'ussd'],
    required: true
  },
  paymentReference: {
    type: String,
    required: true,
    unique: true
  },
  resolved:{
    type:Boolean,
    default:False
  },
  // Recipient details
  recipient: {
    phone: String,
    smartCardNumber: String,
    meterNumber: String,
    customerName: String,
    customerAddress: String,
    accountNumber:String,
    accountName:String,
    bankCode:String
  },
  // Data plan details (for data transactions)
  dataPlan: {
    name: String,
    size: String,
    validity: String,
    price: Number
  },
  // Cable TV details
  cableDetails: {
    package: String,
    months: Number,
    cardNumber: String
  },
  // Electricity details
  electricityDetails: {
    meterType: {
      type: String,
      enum: ['prepaid', 'postpaid']
    },
    units: Number,
    token: String
  },
  // Provider response
  providerResponse: {
    success: Boolean,
    message: String,
    reference: String,
    data: mongoose.Schema.Types.Mixed
  },
  // Error details
  error: {
    code: String,
    message: String,
    details: mongoose.Schema.Types.Mixed
  },
  // Processing details
  processedAt: Date,
  completedAt: Date,
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 3
  },
  // Commission details
  commission: {
    amount: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  // User wallet balance before and after transaction
  walletBalanceBefore: Number,
  walletBalanceAfter: Number,
  // Admin notes
  adminNotes: String,
  // Refund details
  refund: {
    isRefunded: {
      type: Boolean,
      default: false
    },
    refundAmount: Number,
    refundReason: String,
    refundedAt: Date,
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for transaction summary
transactionSchema.virtual('summary').get(function() {
  return {
    id: this.transactionId,
    type: this.type,
    service: this.service,
    amount: this.amount,
    status: this.status,
    createdAt: this.createdAt
  };
});

// Indexes for better query performance
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ paymentReference: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ service: 1 });
transactionSchema.index({ createdAt: -1 });

// // Pre-save middleware to generate transaction ID
// transactionSchema.pre('save', function(next) {
//   if (this.isNew && !this.transactionId) {
//     this.transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
//   }
//   next();
// });

// Method to update status
transactionSchema.methods.updateStatus = function(status, additionalData = {}) {
  this.status = status;
  
  if (status === 'processing') {
    this.processedAt = new Date();
  } else if (status === 'successful') {
    this.completedAt = new Date();
  }
  
  Object.assign(this, additionalData);
  return this.save();
};

// Method to add provider response
transactionSchema.methods.addProviderResponse = function(response) {
  this.providerResponse = response;
  return this.save();
};

// Method to add error
transactionSchema.methods.addError = function(error) {
  this.error = error;
  this.status = 'failed';
  return this.save();
};

// Method to retry transaction
transactionSchema.methods.retry = function() {
  if (this.retryCount >= this.maxRetries) {
    throw new Error('Maximum retry attempts exceeded');
  }
  
  this.retryCount += 1;
  this.status = 'pending';
  this.processedAt = null;
  this.completedAt = null;
  this.error = null;
  
  return this.save();
};

// Method to refund transaction
transactionSchema.methods.refundTransaction = function(amount, reason, adminId) {
  if (this.refund.isRefunded) {
    throw new Error('Transaction already refunded');
  }
  
  if (amount > this.totalAmount) {
    throw new Error('Refund amount cannot exceed transaction amount');
  }
  
  this.refund = {
    isRefunded: true,
    refundAmount: amount,
    refundReason: reason,
    refundedAt: new Date(),
    refundedBy: adminId
  };
  
  return this.save();
};

// Static method to get transaction statistics
transactionSchema.statics.getStats = async function(userId, period = '30d') {
  const dateFilter = {};
  const now = new Date();
  
  switch (period) {
    case '7d':
      dateFilter.$gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      dateFilter.$gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      dateFilter.$gte = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      dateFilter.$gte = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
  }
  
  const matchStage = { userId: mongoose.Types.ObjectId(userId) };
  if (Object.keys(dateFilter).length > 0) {
    matchStage.createdAt = dateFilter;
  }
  
  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);
};

// Static method to get transaction summary by type
transactionSchema.statics.getTypeSummary = async function(userId, period = '30d') {
  const dateFilter = {};
  const now = new Date();
  
  switch (period) {
    case '7d':
      dateFilter.$gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      dateFilter.$gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      dateFilter.$gte = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      dateFilter.$gte = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
  }
  
  const matchStage = { userId: mongoose.Types.ObjectId(userId) };
  if (Object.keys(dateFilter).length > 0) {
    matchStage.createdAt = dateFilter;
  }
  
  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
        successfulCount: {
          $sum: { $cond: [{ $eq: ['$status', 'successful'] }, 1, 0] }
        },
        successfulAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'successful'] }, '$totalAmount', 0] }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Transaction', transactionSchema); 