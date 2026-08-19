"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./modules/auth/auth.module");
const students_module_1 = require("./modules/students/students.module");
const messaging_module_1 = require("./modules/messaging/messaging.module");
const finance_module_1 = require("./modules/finance/finance.module");
const integration_module_1 = require("./modules/integration/integration.module");
const teachers_module_1 = require("./modules/teachers/teachers.module");
const grades_module_1 = require("./modules/grades/grades.module");
const timetable_module_1 = require("./modules/timetable/timetable.module");
const classes_module_1 = require("./modules/classes/classes.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    uri: configService.get('MONGODB_URI') ||
                        'mongodb+srv://edupro:BDDdhAiy2LxiRh1f@cluster0.ytkibvq.mongodb.net/edupro?appName=Cluster0',
                }),
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            auth_module_1.AuthModule,
            students_module_1.StudentsModule,
            teachers_module_1.TeachersModule,
            messaging_module_1.MessagingModule,
            classes_module_1.ClassesModule,
            grades_module_1.GradesModule,
            timetable_module_1.TimetableModule,
            finance_module_1.FinanceModule,
            integration_module_1.IntegrationModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map