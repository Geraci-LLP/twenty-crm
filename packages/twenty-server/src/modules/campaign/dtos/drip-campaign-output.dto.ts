import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DripCampaignActionOutputDTO {
  @Field()
  success: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
}

@ObjectType()
export class CreateDripCampaignOutputDTO {
  @Field()
  success: boolean;

  @Field(() => ID, { nullable: true })
  dripCampaignId?: string;

  @Field(() => String, { nullable: true })
  error?: string;
}

@ObjectType()
export class EnrollContactsOutputDTO {
  @Field()
  success: boolean;

  @Field(() => Int)
  enrolled: number;

  @Field(() => Int)
  skipped: number;

  @Field(() => String, { nullable: true })
  error?: string;
}
