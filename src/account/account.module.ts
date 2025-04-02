import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountSchema } from 'src/models/schema/account.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PaystackService } from 'src/paystack/paystack.service';
import { PaystackModule } from 'src/paystack/paystack.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AccountController],
  imports: [
    MongooseModule.forFeature([{ name: 'Account', schema: AccountSchema }]),
    PaystackModule,
  ],
  providers: [AccountService, PaystackService, JwtService],
})
export class AccountModule {}
