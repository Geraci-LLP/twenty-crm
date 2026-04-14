import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('ResolveRecipientsOutput')
export class ResolveRecipientsOutputDTO {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => Int)
  created: number;

  @Field(() => Int)
  skipped: number;

  @Field(() => Int)
  total: number;

  @Field(() => String, { nullable: true })
  error?: string;
}
