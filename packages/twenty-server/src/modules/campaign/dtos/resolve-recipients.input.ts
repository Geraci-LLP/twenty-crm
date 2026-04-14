import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum RecipientSelectionMode {
  SAVED_VIEW = 'SAVED_VIEW',
  MANUAL = 'MANUAL',
}

registerEnumType(RecipientSelectionMode, {
  name: 'RecipientSelectionMode',
});

@InputType()
export class ResolveRecipientsInput {
  @Field(() => String)
  campaignId: string;

  @Field(() => RecipientSelectionMode)
  mode: RecipientSelectionMode;

  @Field(() => String, { nullable: true })
  viewId?: string;

  @Field(() => [String], { nullable: true })
  personIds?: string[];
}
