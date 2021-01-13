import { User } from "../entities/User";
import { MyContext } from "src/types";
import argon2 from "argon2";
import {
  Resolver,
  Mutation,
  Field,
  Arg,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { EmailPasswordInput } from "./EmailPasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

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
  @Mutation(() => UserResponse)
  async changePassword(
    @Ctx() { redis, req }: MyContext,
    @Arg("password") password: string,
    @Arg("token") token: string
  ): Promise<UserResponse> {
    if (password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be grater than 3",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "invalid token",
          },
        ],
      };
    }
    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(password);
    await User.update({ id: userIdNum }, { password: hashedPassword });

    await redis.del(key);

    // log in user after change password
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Ctx() { redis }: MyContext,
    @Arg("email") email: string
  ) {
    const user = await User.findOne({ where: { email: email } });
    console.log("user: ", user);
    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 10
    ); // 10 minutes

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}"> reset paswword </a> `
    );

    return true;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    const userId = req.session.userId;

    if (!userId) {
      return null;
    }

    return User.findOne(userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("credentials") credentials: EmailPasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(credentials);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(credentials.password);

    const user = User.create({
      email: credentials.email,
      password: hashedPassword,
    });

    try {
      await user.save();
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
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email: credentials.email } });

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
