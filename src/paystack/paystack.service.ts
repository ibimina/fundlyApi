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
      // const data = await response.json();
      // const create = await this.verifyAccount({
      //   country: 'NG',
      //   type: 'bank_account',
      //   account_number: '0111111111',
      //   bvn: '22222222222',
      //   bank_code: '007',
      //   first_name: 'Uchenna',
      //   last_name: 'Okoro',
      //   customerCode: (data as { data: { customer_code: string } }).data.customer_code,
      // });
      // console.log('======= create', create);
      // if (create?.status) {
      //   return data;
      // }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return error || { message: 'Error creating wallet' };
      }
      return { message: 'Error creating wallet' };
    }
  }
  //create dedicated account
  async createDedicatedAccount(arg0: {
    customer: string;
    preferred_bank: string;
  }): Promise<any> {
    try {
      console.log('======= arg0', arg0);
      const response = await fetch(
        `${this.configService.get<string>('PAYSTACK_BASE_URL')}/dedicated_account`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...arg0 }),
        },
      );
      console.log('======= response', response);
      if (response.status !== 200) {
        return { message: response.statusText, status: response.status };
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return error || { message: 'Error creating wallet' };
      }
      return { message: 'Error creating wallet' };
    }
  }

  //validate account number
  async verifyAccount(arg0: {
    account_number: string;
    bank_code: string;
    bvn: string;
    type: string;
    country: string;
    first_name: string;
    last_name: string;
    customerCode: string;
  }): Promise<any> {
    try {
      const response = await fetch(
        `${this.configService.get<string>('PAYSTACK_BASE_URL')}/customer/${arg0.customerCode}/identification`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
          },
          body: JSON.stringify({ ...arg0 }),
        },
      );
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return error || { message: 'Error verifying account' };
      }
      return { message: 'Error verifying account' };
    }
  }

  async fundWallet(arg0: { email: string; amount: number }): Promise<any> {
    try {
      const response = await fetch(
        `${this.configService.get<string>('PAYSTACK_BASE_URL')}/transaction/initialize`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(arg0),
        },
      );
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return error || { message: 'Error funding wallet' };
      }
      return { message: 'Error funding wallet' };
    }
  }

  async transferFunds(arg0: {
    recipient_code: string;
    amount: number;
    reason: string;
  }): Promise<any> {
    try {
      const response = await fetch(
        `${this.configService.get<string>('PAYSTACK_BASE_URL')}/transfer`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(arg0),
        },
      );
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return error || { message: 'Error transferring fund' };
      }
      return { message: 'Error transferring fund' };
    }
  }

  async listBanks(): Promise<any> {
    try {
      const response = await fetch(
        `${this.configService.get<string>('PAYSTACK_BASE_URL')}/bank`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
          },
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
}
