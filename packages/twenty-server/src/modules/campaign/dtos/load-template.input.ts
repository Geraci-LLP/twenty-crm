import { Field, InputType } from '@nestjs/graphql';

import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoadTemplateInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  templateId: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  campaignId: string;
}
