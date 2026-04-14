import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendCampaignInput {
  @Field(() => String)
  campaignId: string;
}
