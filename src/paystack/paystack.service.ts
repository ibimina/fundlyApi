import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaystackService {
  constructor(private readonly configService: ConfigService) {}
  // Create a customer (Wallet)
  async createWallet({
    email,
    first_name,
    last_name,
    phone,
  }: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  }): Promise<any> {
    try {
      const response = await fetch(
        `${this.configService.get<string>('PAYSTACK_BASE_URL')}/customer`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, first_name, last_name, phone }),
        },
      );
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return error || { message: 'Error creating wallet' };
      }
      return { message: 'Error creating wallet' };
    }
  }
  // Fund Wallet (Generate Payment Link)
  //   async fundWallet(email: string, amount: number) {
  //     try {
  //       const response = await axios.post(
  //         `${this.configService.get<'PAYSTACK_BASE_URL'>}/transaction/initialize`,
  //         { email, amount },
  //         { headers: { Authorization: `Bearer ${this.configService.get<'PAYSTACK_SECRET_KEY'>}` } },
  //       );
  //       return response.data;
  //     } catch (error) {
  //       return error.response?.data || { message: 'Error funding wallet' };
  //     }
  //   }

  // Transfer funds to another recipient
  //   async transferFunds(recipient_code: string, amount: number, reason: string) {
  //     try {
  //       const response = await axios.post(
  //         `${this.configService.get<'PAYSTACK_BASE_URL'>}/transfer`,
  //         { source: 'balance', amount, recipient: recipient_code, reason },
  //         { headers: { Authorization: `Bearer ${this.configService.get<'PAYSTACK_SECRET_KEY'>}` } },
  //       );
  //       return response.data;
  //     } catch (error) {
  //       return error.response?.data || { message: 'Error transferring funds' };
  //     }
  //   }
}
