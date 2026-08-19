"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeachersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const teachers_service_1 = require("./teachers.service");
const teachers_controller_1 = require("./teachers.controller");
const user_schema_1 = require("../../schemas/user.schema");
const teacher_profile_schema_1 = require("../../schemas/teacher-profile.schema");
const class_group_schema_1 = require("../../schemas/class-group.schema");
let TeachersModule = class TeachersModule {
};
exports.TeachersModule = TeachersModule;
exports.TeachersModule = TeachersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: teacher_profile_schema_1.TeacherProfile.name, schema: teacher_profile_schema_1.TeacherProfileSchema },
                { name: class_group_schema_1.ClassGroup.name, schema: class_group_schema_1.ClassGroupSchema },
            ]),
        ],
        providers: [teachers_service_1.TeachersService],
        controllers: [teachers_controller_1.TeachersController],
        exports: [teachers_service_1.TeachersService],
    })
], TeachersModule);
//# sourceMappingURL=teachers.module.js.map