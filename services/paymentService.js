const { v4: uuidv4 } = require('uuid');
const config = require('../config');

class PaymentService {
  constructor() {
    this.gateway = config.payment.gateway || 'mock';
  }

  async createPayment(amount, currency, metadata = {}) {
    const provider = this._getProvider();
    return provider.createPayment(amount, currency, metadata);
  }

  async verifyWebhook(payload, signature) {
    const provider = this._getProvider();
    return provider.verifyWebhook(payload, signature);
  }

  async getPaymentStatus(reference) {
    const provider = this._getProvider();
    return provider.getPaymentStatus(reference);
  }

  _getProvider() {
    switch (this.gateway) {
      case 'paymongo':
        if (!config.payment.paymongo.secretKey) {
          console.warn('PayMongo selected but no secret key configured. Falling back to mock.');
          return new MockProvider();
        }
        return new PayMongoProvider();
      case 'xendit':
        if (!config.payment.xendit.secretKey) {
          console.warn('Xendit selected but no secret key configured. Falling back to mock.');
          return new MockProvider();
        }
        return new XenditProvider();
      case 'mock':
      default:
        return new MockProvider();
    }
  }
}

class MockProvider {
  async createPayment(amount, currency, metadata = {}) {
    await this._delay(1500);

    const reference = `mock_ref_${uuidv4().split('-')[0]}`;
    const success = Math.random() > 0.1;

    return {
      success,
      reference,
      status: success ? 'completed' : 'failed',
      amount,
      currency,
      message: success
        ? 'Payment processed successfully (mock)'
        : 'Payment failed (mock simulation)',
      metadata,
    };
  }

  async verifyWebhook(payload, signature) {
    return { valid: true, event: 'payment.succeeded', data: payload };
  }

  async getPaymentStatus(reference) {
    return {
      reference,
      status: 'completed',
      amount: 0,
      currency: config.payment.currency,
    };
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class PayMongoProvider {
  async createPayment(amount, currency, metadata = {}) {
    const paymongo = require('paymongo')(config.payment.paymongo.secretKey);

    try {
      const payment = await paymongo.payments.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        description: metadata.description || 'Tree sponsorship',
        metadata,
      });

      return {
        success: true,
        reference: payment.id,
        status: payment.status,
        amount,
        currency,
        redirectUrl: payment.source?.redirect?.checkout_url,
        metadata,
      };
    } catch (err) {
      console.error('PayMongo error:', err);
      throw err;
    }
  }

  async verifyWebhook(payload, signature) {
    const crypto = require('crypto');
    const expectedSig = crypto
      .createHmac('sha256', config.payment.paymongo.webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    const valid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
    return { valid, event: payload?.data?.attributes?.type || 'unknown', data: payload };
  }

  async getPaymentStatus(reference) {
    const paymongo = require('paymongo')(config.payment.paymongo.secretKey);
    const payment = await paymongo.payments.retrieve(reference);
    return { reference, status: payment.status, amount: payment.amount / 100, currency: payment.currency };
  }
}

class XenditProvider {
  async createPayment(amount, currency, metadata = {}) {
    const Xendit = require('xendit-node');
    const xendit = new Xendit({ secretKey: config.payment.xendit.secretKey });

    try {
      const invoice = await xendit.Invoice.create({
        externalId: metadata.external_id || uuidv4(),
        amount: Math.round(amount),
        currency: currency,
        description: metadata.description || 'Tree sponsorship',
        ...metadata,
      });

      return {
        success: true,
        reference: invoice.id,
        status: invoice.status,
        amount,
        currency,
        redirectUrl: invoice.invoiceUrl,
        metadata,
      };
    } catch (err) {
      console.error('Xendit error:', err);
      throw err;
    }
  }

  async verifyWebhook(payload, signature) {
    const valid = signature === config.payment.xendit.webhookToken;
    return { valid, event: payload?.event || 'unknown', data: payload };
  }

  async getPaymentStatus(reference) {
    const Xendit = require('xendit-node');
    const xendit = new Xendit({ secretKey: config.payment.xendit.secretKey });
    const invoice = await xendit.Invoice.getById(reference);
    return { reference, status: invoice.status, amount: invoice.amount, currency: invoice.currency };
  }
}

module.exports = new PaymentService();
