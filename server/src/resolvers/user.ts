import { User } from "../entities/User";
import { Resolver, Mutation, Arg, ObjectType } from "type-graphql";
import argon2 from 'argon2';
import { UserMutationResponse } from "../types/UserMutationResponse";
import { RegisterInput } from "../types/RegisterInput";
import { validateRegisterInput } from "../utils/validateRegisterInput";

@ObjectType() // nch từ ts -> graphsqc
@Resolver() 
export class UserResolver {
  @Mutation(_returns => UserMutationResponse, { nullable: true })
  async register(
    @Arg('registerInput') registerInput: RegisterInput,
  ) : Promise<UserMutationResponse> {
    const validateRegisterInputErrors = validateRegisterInput(registerInput);
    if (validateRegisterInputErrors !== null)
    return {
      code: 400,
      success: false,
      ...validateRegisterInputErrors
    }

    try {
      const { username, email, password } = registerInput;
      
      const existingUser = await User.findOne( { where: {
        username: username,
        email: email
      }});

      if (existingUser) {
        return {
          code: 400,
          success: false,
          message: 'Dublicated username or email',
          errors: [
            {
              field: existingUser.username === username ? 'username' : 'email',
              message: `${existingUser.username === username ? 'username' : 'email'} already taken`
            }
          ]
        }
      } 
  
      const hashedPassword = await argon2.hash(password);
  
      const newUser = User.create({
        username,
        password: hashedPassword,
        email,
      });

      return {
        code: 200,
        success: true,
        message: 'User registration successful',
        user: await User.save(newUser)
      }
    } catch (e) {
      console.log(e);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${e.message}`,
      };
    }
  }
}