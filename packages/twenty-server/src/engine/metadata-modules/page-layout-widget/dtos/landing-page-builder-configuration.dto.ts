import { Field, ObjectType } from '@nestjs/graphql';

import { IsIn, IsNotEmpty } from 'class-validator';
import { type LandingPageBuilderConfiguration } from 'twenty-shared/types';

import { WidgetConfigurationType } from 'src/engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type';

@ObjectType('LandingPageBuilderConfiguration')
export class LandingPageBuilderConfigurationDTO
  implements LandingPageBuilderConfiguration
{
  @Field(() => WidgetConfigurationType)
  @IsIn([WidgetConfigurationType.LANDING_PAGE_BUILDER])
  @IsNotEmpty()
  configurationType: WidgetConfigurationType.LANDING_PAGE_BUILDER;
}
