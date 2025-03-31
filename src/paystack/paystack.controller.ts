import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('paystack')
export class PaystackController {
  constructor(private readonly paystackService: PaystackService) { }
  //list banks
  @ApiOperation({ summary: 'List banks' })
  @Get('list-banks')
  async listBanks() {
    const banks = await this.paystackService.listBanks();
    return {
      message: 'Banks fetched successfully',
      payload: banks,
      status: HttpStatus.OK,
    };
  }

  //create dedicated account
  @ApiOperation({ summary: 'Create dedicated account' })
  @Post('create-dedicated-account')
  async createDedicatedAccount(
    @Body() createDedicatedAccountDto: { customer: string; preferred_bank: string },
  ) {
    const account = await this.paystackService.createDedicatedAccount(
      createDedicatedAccountDto,
    );
    return {
      message: 'Dedicated account created successfully',
      payload: account,
      status: HttpStatus.CREATED,
    };
  }

  //list a user transactions
  // @ApiOperation({ summary: 'List transactions' })
  // @Get('list-transactions')
    
 


  //verify account
  // @ApiOperation({ summary: 'Verify account' })
  // @Get('verify-account')
  // async verifyAccount(
  //   @Body() verifyAccountDto: { account_number: string; bank_code: string },
  // ) {
  //   const account = await this.paystackService.verifyAccount();
  //   return {
  //     message: 'Account verified successfully',
  //     payload: account,
  //     status: HttpStatus.OK,
  //   };
  // }
  //resolve account number
}
