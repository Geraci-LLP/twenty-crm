import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('CampaignActionOutput')
export class CampaignActionOutputDTO {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
}
