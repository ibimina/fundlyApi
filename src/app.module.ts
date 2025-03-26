import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { AccountService } from './account/account.service';
import { AccountController } from './account/account.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccountSchema } from './models/schema/account.schema';
import { PaystackModule } from './paystack/paystack.module';
import { PaystackService } from './paystack/paystack.service';
import { PaystackController } from './paystack/paystack.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Moved to the top
      isGlobal: true,
      envFilePath: './.env',
    }),
    AccountModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectTimeoutMS: 30000,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: 'Account',
        schema: AccountSchema,
      },
    ]),
    PaystackModule,
  ],
  controllers: [AppController, AccountController, PaystackController],
  providers: [AppService, AccountService, PaystackService], // Removed ConfigService
})
export class AppModule {}
