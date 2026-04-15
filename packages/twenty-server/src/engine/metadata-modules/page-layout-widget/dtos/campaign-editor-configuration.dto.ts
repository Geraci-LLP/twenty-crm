import { Field, ObjectType } from '@nestjs/graphql';

import { IsIn, IsNotEmpty } from 'class-validator';
import { type CampaignEditorConfiguration } from 'twenty-shared/types';

import { WidgetConfigurationType } from 'src/engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type';

@ObjectType('CampaignEditorConfiguration')
export class CampaignEditorConfigurationDTO
  implements CampaignEditorConfiguration
{
  @Field(() => WidgetConfigurationType)
  @IsIn([WidgetConfigurationType.CAMPAIGN_EDITOR])
  @IsNotEmpty()
  configurationType: WidgetConfigurationType.CAMPAIGN_EDITOR;
}
