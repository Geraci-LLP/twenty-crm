import { Field, ObjectType } from '@nestjs/graphql';

// Response shape of the generateDashboardToken mutation. Separate from
// AuthToken to keep the dashboard-handshake contract explicit and to leave
// room for audience/metadata fields if we ever need them.
@ObjectType()
export class DashboardTokenDto {
  @Field(() => String)
  token: string;

  @Field(() => Date)
  expiresAt: Date;
}
