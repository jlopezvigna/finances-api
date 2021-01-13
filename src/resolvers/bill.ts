import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Bill } from "../entities/Bill";

@Resolver()
export class BillResolver {
  @Query(() => [Bill])
  bills(): Promise<Bill[]> {
    return Bill.find();
  }

  @Query(() => Bill, { nullable: true })
  bill(@Arg("id") id: number): Promise<Bill | undefined> {
    return Bill.findOne(id);
  }

  @Mutation(() => Bill)
  async createBill(
    @Arg("title") title: string,
    @Arg("amount") amount: number
  ): Promise<Bill> {
    return Bill.create({ title, amount }).save();
  }

  @Mutation(() => Bill, { nullable: true })
  async updateBill(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Arg("amount") amount: number
  ): Promise<Bill | undefined> {
    const bill = Bill.findOne(id);
    if (!bill) {
      return undefined;
    }
    if (typeof title !== undefined) {
      await Bill.update({ id }, { title });
    }

    if (typeof amount !== undefined) {
      await Bill.update({ id }, { amount });
    }
    return bill;
  }

  @Mutation(() => Boolean)
  async deleteBill(@Arg("id") id: number): Promise<boolean> {
    try {
      await Bill.delete(id);
    } catch {
      return false;
    }
    return true;
  }
}
