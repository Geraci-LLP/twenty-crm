import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendTestEmailInput {
  @Field(() => String)
  campaignId: string;

  @Field(() => String)
  testEmailAddress: string;
}
