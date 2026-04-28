import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('QuoteSharingLink')
export class QuoteSharingLinkDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  slug: string;

  @Field(() => String)
  shareUrl: string;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => String, { nullable: true })
  recipientEmail: string | null;

  @Field(() => String)
  quoteId: string;
}
