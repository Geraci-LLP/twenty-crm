import { Field, InputType } from '@nestjs/graphql';

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class SaveAsTemplateInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  campaignId: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  templateName: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  category?: string;
}
