import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ScheduleCampaignInput {
  @Field(() => String)
  campaignId: string;

  @Field(() => Date)
  scheduledAt: Date;
}
