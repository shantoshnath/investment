import crypto from 'crypto';

interface UPayConfig {
  appId: string;
  appSecret: string;
  baseUrl: string;
}

export class UPayService {
  private config: UPayConfig;

  constructor() {
    this.config = {
      appId: process.env.UPAY_APP_ID!,
      appSecret: process.env.UPAY_APP_SECRET!,
      baseUrl: 'https://api.upay.ink',
    };

    // Test signature generation with example from docs
    this.testSignature();
  }

  private testSignature() {
    const testParams = {
      appId: "12345",
      chainType: "1",
      merchantOrderNo: "123123123123"
    };
    console.log('Test signature input:', testParams);
    const signature = this.generateSignature(testParams);
    console.log('Test signature result:', signature);
  }

  private generateSignature(params: Record<string, any>): string {
    // Remove signature field if present and convert all values to strings
    const cleanParams = Object.fromEntries(
      Object.entries(params)
        .filter(([key, v]) => v != null && key !== 'signature')
        .map(([key, value]) => [key, String(value)])
    );

    // Sort parameters alphabetically and create signature string
    const stringA = Object.keys(cleanParams)
      .sort()
      .map(key => `${key}=${cleanParams[key]}`)
      .join('&');

    // Append appSecret with correct format
    const stringSignTemp = stringA + `&appSecret=${this.config.appSecret}`;

    console.log('Signature input string:', stringSignTemp);

    // Generate MD5 hash and convert to uppercase
    return crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
  }

  async createPaymentOrder(amount: number, orderId: string): Promise<any> {
    const params = {
      appId: this.config.appId,
      merchantOrderNo: orderId,
      chainType: "1",
      fiatAmount: amount.toFixed(4),
      fiatCurrency: "USD",
      notifyUrl: `https://${process.env.REPL_SLUG}.repl.co/api/payments/callback`,
      redirectUrl: `https://${process.env.REPL_SLUG}.repl.co/deposit/success`,
      productName: "Account Deposit"
    };

    console.log('Payment request parameters:', params);
    const signature = this.generateSignature(params);
    console.log('Generated signature:', signature);

    const requestConfig = {
      ...params,
      signature
    };

    console.log('Making payment request to:', `${this.config.baseUrl}/v1/api/open/order/apply`);
    console.log('With params:', JSON.stringify(requestConfig, null, 2));

    try {
      const response = await fetch(`${this.config.baseUrl}/v1/api/open/order/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestConfig),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Payment request failed: ${error}`);
      }

      const data = await response.json();
      console.log('Payment response:', data);

      if (data.code !== '0000') {
        throw new Error(data.message || 'Payment request failed');
      }

      return {
        payUrl: data.payUrl,
        orderId: orderId,
      };
    } catch (error) {
      console.error('UPay payment error:', error);
      throw error;
    }
  }

  verifyCallback(headers: Record<string, string>, body: any): boolean {
    const signature = headers['x-upay-signature'];
    if (!signature) return false;

    const calculatedSignature = crypto
      .createHmac('sha256', this.config.appSecret)
      .update(JSON.stringify(body))
      .digest('hex');

    return signature === calculatedSignature;
  }
}

export const upayService = new UPayService();