import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GenerateCampaignPreviewLinkInput {
  @Field()
  @IsUUID()
  campaignId: string;
}
