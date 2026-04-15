import { Field, ObjectType } from '@nestjs/graphql';

import { IsIn, IsNotEmpty } from 'class-validator';
import { type FormBuilderConfiguration } from 'twenty-shared/types';

import { WidgetConfigurationType } from 'src/engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type';

@ObjectType('FormBuilderConfiguration')
export class FormBuilderConfigurationDTO implements FormBuilderConfiguration {
  @Field(() => WidgetConfigurationType)
  @IsIn([WidgetConfigurationType.FORM_BUILDER])
  @IsNotEmpty()
  configurationType: WidgetConfigurationType.FORM_BUILDER;
}
