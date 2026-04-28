import { Module } from '@nestjs/common';

import { ApplicationModule } from 'src/engine/core-modules/application/application.module';
import { FileUrlModule } from 'src/engine/core-modules/file/file-url/file-url.module';
import { FileMarketingResolver } from 'src/engine/core-modules/file/file-marketing/resolvers/file-marketing.resolver';
import { FileMarketingService } from 'src/engine/core-modules/file/file-marketing/services/file-marketing.service';
import { PermissionsModule } from 'src/engine/metadata-modules/permissions/permissions.module';

@Module({
  imports: [FileUrlModule, ApplicationModule, PermissionsModule],
  providers: [FileMarketingService, FileMarketingResolver],
  exports: [FileMarketingService],
})
export class FileMarketingModule {}
