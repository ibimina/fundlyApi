import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { CreateAccountDto } from 'src/models/dtos/create-account.dto';
import { WalletInterface } from 'src/models/interfaces/wallet.interface';
import { Account } from 'src/models/schema/account.schema';
import { PaystackService } from 'src/paystack/paystack.service';
import {
  hashWord,
  getUniqueAllNumberId,
  validatePassword,
} from 'src/utilities/utils';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('Account')
    private readonly accountModel: Model<Account & Document>,
    private readonly paystackService: PaystackService,
  ) {}
  async createAccount(createAccountDto: CreateAccountDto) {
    //create a paystack wallet for the user
    const oldAccount = await this.accountModel.findOne({
      $or: [
        { phoneNumber: createAccountDto.phoneNumber },
        {
          email: {
            $regex: `^${createAccountDto.email}$`,
            $options: 'i',
          },
        },
      ],
    });
    if (oldAccount) {
      throw new BadRequestException(
        'Account already exists with either the email or phone number',
      );
    }
    const walletRes = (await this.paystackService.createWallet({
      email: createAccountDto.email,
      first_name: createAccountDto.firstName,
      last_name: createAccountDto.lastName,
      phone: createAccountDto.phoneNumber,
    })) as WalletInterface;
    if (walletRes?.status) {
      const hashedPassword = hashWord(createAccountDto.password);
      const alphaNumeric = getUniqueAllNumberId(10);
      const uniqueId = `ACC-${alphaNumeric}`;
      const account = await this.accountModel.create({
        ...createAccountDto,
        uniqueId,
        password: hashedPassword,
        transactions: walletRes.data.transactions,
        subscriptions: walletRes.data.subscriptions,
        authorizations: walletRes.data.authorizations,
        metadata: walletRes.data.metadata,
        domain: walletRes.data.domain,
        customerCode: walletRes.data.customer_code,
        riskAction: walletRes.data.risk_action,
      });
      return {
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        id: account._id,
      };
    } else {
      throw new Error(walletRes.message);
    }
  }

  async login(loginDto: { email: string; password: string }) {
    const { email, password } = loginDto;
    const account = await this.accountModel.findOne({
      email: {
        $regex: `^${email}$`,
        $options: 'i',
      },
    });
    if (!account) {
      throw new BadRequestException('Invalid email or password');
    }
    const isPasswordMatch = validatePassword(password, account.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid email or password');
    }
    return {
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      id: account._id,
    };
  }

  async createPasscode(createPasscodeDto: {
    accountId: string;
    passcode: string;
  }) {
    const { accountId, passcode } = createPasscodeDto;
    const account = await this.accountModel.findById(accountId);
    if (!account) {
      throw new BadRequestException('Account not found');
    }
    account.passcode = passcode;
    await account.save();
    return {
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      id: account._id,
    };
  }

  async createUsername(createUsernameDto: {
    accountId: string;
    username: string;
  }) {
    const { accountId, username } = createUsernameDto;
    const account = await this.accountModel.findById(accountId);
    if (!account) {
      throw new BadRequestException('Account not found');
    }
    // check if username already exists
    const oldAccount = await this.accountModel.findOne({
      username: {
        $regex: `^${username}$`,
        $options: 'i',
      },
    });
    if (oldAccount) {
      throw new BadRequestException('Username already exists');
    }
    account.username = username;
    await account.save();
    return {
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      id: account._id,
    };
  }

  async fundWallet(fundWalletDto: { accountId: string; amount: number }) {
    const { accountId, amount } = fundWalletDto;
    const account = await this.accountModel.findById(accountId);
    if (!account) {
      throw new BadRequestException('Account not found');
    }
    const walletRes = await this.paystackService.fundWallet({
      email: account.email,
      amount,
    });
    console.log('walletRes', walletRes);
    if (walletRes.status) {
      // {
      //   status: true,
      //   message: 'Authorization URL created',
      //   data: {
      //     authorization_url: 'https://checkout.paystack.com/unfngrcx1qp9efe',
      //     access_code: 'unfngrcx1qp9efe',
      //     reference: 'nmqmdjzuj9'
      //   }
      // }
      // account.transactions = walletRes.data.transactions;
      // account.subscriptions = walletRes.data.subscriptions;
      // account.authorizations = walletRes.data.authorizations;
      // account.metadata = walletRes.data.metadata;
      // account.domain = walletRes.data.domain;
      // account.customerCode = walletRes.data.customer_code;
      // account.riskAction = walletRes.data.risk_action;
      // await account.save();
      return {
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        id: account._id,
      };
    } else {
      throw new Error(walletRes.message);
    }
  }

  async transferFunds(transferFundsDto: {
    accountId: string;
    recipientCode: string;
    amount: number;
    reason: string;
  }) {
    const { accountId, recipientCode, amount, reason } = transferFundsDto;
    const account = await this.accountModel.findById(accountId);
    if (!account) {
      throw new BadRequestException('Account not found');
    }
    const walletRes = await this.paystackService.transferFunds({
      recipient_code: recipientCode,
      amount,
      reason,
    });
    if (walletRes.status) {
      account.transactions = walletRes.data.transactions;
      account.subscriptions = walletRes.data.subscriptions;
      account.authorizations = walletRes.data.authorizations;
      account.metadata = walletRes.data.metadata;
      account.domain = walletRes.data.domain;
      account.customerCode = walletRes.data.customer_code;
      account.riskAction = walletRes.data.risk_action;
      await account.save();
      return {
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        id: account._id,
      };
    } else {
      throw new Error(walletRes.message);
    }
  }
}
