"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Bill_1 = require("../entities/Bill");
let BillResolver = class BillResolver {
    bills() {
        return Bill_1.Bill.find();
    }
    bill(id) {
        return Bill_1.Bill.findOne(id);
    }
    createBill(title, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return Bill_1.Bill.create({ title, amount }).save();
        });
    }
    updateBill(id, title, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const bill = Bill_1.Bill.findOne(id);
            if (!bill) {
                return undefined;
            }
            if (typeof title !== undefined) {
                yield Bill_1.Bill.update({ id }, { title });
            }
            if (typeof amount !== undefined) {
                yield Bill_1.Bill.update({ id }, { amount });
            }
            return bill;
        });
    }
    deleteBill(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Bill_1.Bill.delete(id);
            }
            catch (_a) {
                return false;
            }
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Bill_1.Bill]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillResolver.prototype, "bills", null);
__decorate([
    type_graphql_1.Query(() => Bill_1.Bill, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BillResolver.prototype, "bill", null);
__decorate([
    type_graphql_1.Mutation(() => Bill_1.Bill),
    __param(0, type_graphql_1.Arg("title")),
    __param(1, type_graphql_1.Arg("amount")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], BillResolver.prototype, "createBill", null);
__decorate([
    type_graphql_1.Mutation(() => Bill_1.Bill, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Arg("title")),
    __param(2, type_graphql_1.Arg("amount")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number]),
    __metadata("design:returntype", Promise)
], BillResolver.prototype, "updateBill", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BillResolver.prototype, "deleteBill", null);
BillResolver = __decorate([
    type_graphql_1.Resolver()
], BillResolver);
exports.BillResolver = BillResolver;
//# sourceMappingURL=bill.js.map