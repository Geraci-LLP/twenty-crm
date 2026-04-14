import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResumeCampaignInput {
  @Field(() => String)
  campaignId: string;
}
