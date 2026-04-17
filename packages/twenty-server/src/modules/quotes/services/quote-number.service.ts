import { Injectable, Logger } from '@nestjs/common';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';

@Injectable()
export class QuoteNumberService {
  private readonly logger = new Logger(QuoteNumberService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  // Atomically obtains the next quote number for the workspace using a
  // Postgres sequence scoped to the workspace schema. Format: Q-YYYY-NNNNNN.
  async generateQuoteNumber(workspaceId: string): Promise<string> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const dataSource =
          await this.globalWorkspaceOrmManager.getGlobalWorkspaceDataSource();

        // Create the sequence on first use. Safe to call on every invocation.
        await dataSource.query(
          'CREATE SEQUENCE IF NOT EXISTS "quote_number_seq"',
        );

        const rows: Array<{ nextval: string | number }> =
          await dataSource.query("SELECT nextval('quote_number_seq')");

        const nextValueRaw = rows[0]?.nextval ?? 0;
        const nextValue =
          typeof nextValueRaw === 'string'
            ? parseInt(nextValueRaw, 10)
            : nextValueRaw;

        const year = new Date().getFullYear();
        const padded = String(nextValue).padStart(6, '0');

        return `Q-${year}-${padded}`;
      },
      authContext,
    );
  }
}
