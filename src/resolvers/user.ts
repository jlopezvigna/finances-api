import { User } from "../entities/User";
import { MyContext } from "src/types";
import argon2 from "argon2";
import {
  Resolver,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import { COOKIE_NAME } from "../constants";

// For Arguments
@InputType()
class EmailPasswordInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

// For Mutations
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    const userId = req.session.userId;

    if (!userId) {
      return null;
    }
    const user = em.findOne(User, { id: userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("credentials") credentials: EmailPasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (credentials.email.length <= 2) {
      return {
        errors: [
          {
            field: "email",
            message: "length must be grater than 2",
          },
        ],
      };
    }

    if (credentials.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be grater than 3",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(credentials.password);

    const user = em.create(User, {
      email: credentials.email,
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [{ field: "email", message: "email already taken" }],
        };
      }
    }

    // store user id session
    // this will set a cookie on the user
    //  keep them logged in
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("credentials") credentials: EmailPasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { email: credentials.email });
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "That user doesn't exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, credentials.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
