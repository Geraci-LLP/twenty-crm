import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DomainServerConfigModule } from 'src/engine/core-modules/domain/domain-server-config/domain-server-config.module';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { QuotePublicController } from 'src/modules/quotes/controllers/quote-public.controller';
import { QuoteLineItemListener } from 'src/modules/quotes/listeners/quote-line-item.listener';
import { QuoteSharingResolver } from 'src/modules/quotes/resolvers/quote-sharing.resolver';
import { QuoteNumberService } from 'src/modules/quotes/services/quote-number.service';
import { QuoteStatusService } from 'src/modules/quotes/services/quote-status.service';
import { QuoteTotalService } from 'src/modules/quotes/services/quote-total.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceEntity]),
    DomainServerConfigModule,
  ],
  controllers: [QuotePublicController],
  providers: [
    QuoteNumberService,
    QuoteStatusService,
    QuoteTotalService,
    QuoteSharingResolver,
    QuoteLineItemListener,
  ],
  exports: [QuoteNumberService, QuoteStatusService, QuoteTotalService],
})
export class QuotesModule {}
