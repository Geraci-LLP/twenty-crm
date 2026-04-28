import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('CampaignPreviewLinkOutput')
export class CampaignPreviewLinkOutputDTO {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  url?: string;

  @Field(() => String, { nullable: true })
  error?: string;
}
