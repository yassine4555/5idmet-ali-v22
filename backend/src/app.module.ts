import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { StudentsModule } from './modules/students/students.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { FinanceModule } from './modules/finance/finance.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { GradesModule } from './modules/grades/grades.module';
import { TimetableModule } from './modules/timetable/timetable.module';
import { ClassesModule } from './modules/classes/classes.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb+srv://edupro:BDDdhAiy2LxiRh1f@cluster0.ytkibvq.mongodb.net/edupro?appName=Cluster0',
      }),
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    StudentsModule,
    TeachersModule,
    MessagingModule,
    ClassesModule,
    GradesModule,
    TimetableModule,
    FinanceModule,
    IntegrationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
