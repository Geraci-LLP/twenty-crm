import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateDripCampaignInput {
  @Field()
  name: string;
}

@InputType()
export class ActivateDripCampaignInput {
  @Field(() => ID)
  dripCampaignId: string;
}

@InputType()
export class PauseDripCampaignInput {
  @Field(() => ID)
  dripCampaignId: string;
}

@InputType()
export class EnrollContactsInput {
  @Field(() => ID)
  dripCampaignId: string;

  @Field(() => [ID])
  personIds: string[];
}

@InputType()
export class UnenrollContactInput {
  @Field(() => ID)
  enrollmentId: string;
}

@InputType()
export class AddDripStepInput {
  @Field(() => ID)
  dripCampaignId: string;

  @Field()
  stepType: string;

  @Field(() => String)
  settings: string;

  @Field(() => Int, { nullable: true })
  position?: number;
}

@InputType()
export class RemoveDripStepInput {
  @Field(() => ID)
  dripCampaignId: string;

  @Field(() => ID)
  stepId: string;
}
