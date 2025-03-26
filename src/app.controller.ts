import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateAccountDto } from './models/dtos/create-account.dto';
import { AccountService } from './account/account.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly accountService: AccountService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'Create account' })
  @Post('create-account')
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    const account = await this.accountService.createAccount(createAccountDto);
    return {
      message: 'Account created successfully',
      payload: account,
      status: HttpStatus.CREATED,
    };
  }

  // login
  @ApiOperation({ summary: 'Login' })
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const account = await this.accountService.login(loginDto);
    return {
      message: 'Login successful',
      payload: account,
      status: HttpStatus.OK,
    };
  }

  //create passcode api
  @ApiOperation({ summary: 'Create passcode' })
  @Post('create-passcode')
  async createPasscode(
    @Body() createPasscodeDto: { accountId: string; passcode: string },
  ) {
    const account = await this.accountService.createPasscode(createPasscodeDto);
    return {
      message: 'Passcode created successfully',
      payload: account,
      status: HttpStatus.CREATED,
    };
  }

  //create username
  @ApiOperation({ summary: 'Create username' })
  @Post('create-username')
  async createUsername(
    @Body() createUsernameDto: { accountId: string; username: string },
  ) {
    const account = await this.accountService.createUsername(createUsernameDto);
    return {
      message: 'Username created successfully',
      payload: account,
      status: HttpStatus.CREATED,
    };
  }
}
