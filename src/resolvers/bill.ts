import { Bill } from "../entities/Bill";
import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";

@Resolver()
export class BillResolver {
  @Query(() => [Bill])
  bills(@Ctx() { em }: MyContext): Promise<Bill[]> {
    return em.find(Bill, {});
  }

  @Query(() => Bill, { nullable: true })
  bill(@Arg("id") id: number, @Ctx() { em }: MyContext): Promise<Bill | null> {
    return em.findOne(Bill, { id });
  }

  @Mutation(() => Bill)
  async createBill(
    @Arg("title") title: string,
    @Arg("amount") amount: number,
    @Ctx()
    { em }: MyContext
  ): Promise<Bill> {
    const bill = em.create(Bill, { title, amount });
    await em.persistAndFlush(bill);
    return bill;
  }

  @Mutation(() => Bill, { nullable: true })
  async updateBill(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Arg("amount") amount: number,
    @Ctx() { em }: MyContext
  ): Promise<Bill | null> {
    const bill = await em.findOne(Bill, { id });
    if (!bill) {
      return null;
    }
    if (typeof title !== undefined) {
      bill.title = title;
    }

    if (typeof amount !== undefined) {
      bill.amount = amount;
    }
    await em.persistAndFlush(bill);
    return bill;
  }

  @Mutation(() => Boolean)
  async deleteBill(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Bill, { id });
    } catch {
      return false;
    }
    return true;
  }
}
