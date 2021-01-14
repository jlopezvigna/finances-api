import { Category } from "../entities/Category";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types";

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  categories(): Promise<Category[]> {
    return Category.find();
  }

  @Query(() => Category, { nullable: true })
  category(@Arg("id") id: number): Promise<Category | undefined> {
    return Category.findOne(id);
  }

  @Mutation(() => Category)
  @UseMiddleware(isAuth)
  createCategory(
    @Arg("name") name: string,
    @Ctx() { req }: MyContext
  ): Promise<Category> {
    return Category.create({ name, userId: req.session.userId }).save();
  }

  @Mutation(() => Category, { nullable: true })
  async updateCategory(
    @Arg("id") id: number,
    @Arg("name") name: string
  ): Promise<Category | undefined> {
    const category = Category.findOne(id);
    if (!category) {
      return undefined;
    }
    if (typeof name !== undefined) {
      await Category.update({ id }, { name });
    }

    return category;
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg("id") id: number): Promise<boolean> {
    try {
      await Category.delete(id);
    } catch {
      return false;
    }
    return true;
  }
}
