import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PauseCampaignInput {
  @Field(() => String)
  campaignId: string;
}
