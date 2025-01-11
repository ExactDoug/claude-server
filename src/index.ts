import { MCPService, StdioServerTransport } from '@modelcontextprotocol/sdk';

interface Context {
  id: string;
  type: 'project' | 'conversation';
  content: string;
  parentId?: string;
  references?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
}

class ContextManagementService extends MCPService {
  private contexts: Map<string, Context> = new Map();

  async saveContext({
    id,
    type,
    content,
    parentId,
    references,
    tags,
    metadata
  }: Context): Promise<void> {
    this.contexts.set(id, {
      id,
      type,
      content,
      parentId,
      references,
      tags,
      metadata
    });
  }

  async getContext(id: string): Promise<Context | null> {
    return this.contexts.get(id) || null;
  }

  async listContexts({
    type,
    tag
  }: {
    type?: 'project' | 'conversation';
    tag?: string;
  }): Promise<Context[]> {
    return Array.from(this.contexts.values())
      .filter(ctx => {
        if (type && ctx.type !== type) return false;
        if (tag && !ctx.tags?.includes(tag)) return false;
        return true;
      });
  }
}

const service = new ContextManagementService();
const transport = new StdioServerTransport();

service.listen(transport).catch(console.error);