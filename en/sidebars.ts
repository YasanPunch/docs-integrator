import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
import { connectorVersionedDocs } from './src/utils/sidebarUtils';

/**
 * WSO2 Integrator Documentation — Sidebar Configuration
 *
 * Structure follows the Documentation Blueprint (March 2026).
 * Seven top-level sections answering seven developer questions:
 *
 *   Get Started       — "I'm new — what is this and how do I begin?"
 *   Develop           — "How do I build, transform, and test X?"
 *   Connectors        — "Can I connect to Y?"
 *   GenAI             — "How do I build AI agents, RAG, or MCP?"
 *   Tutorials         — "Show me a complete, real example"
 *   Deploy & Operate  — "How do I ship, run, and secure this?"
 *   Reference         — "What's the exact syntax / config / API for Z?"
 */
const sidebars: SidebarsConfig = {
  mainSidebar: [
    // ─────────────────────────────────────────────
    // GET STARTED
    // "I'm new — what is this and how do I begin?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Get Started',
      collapsed: true,
      link: { type: 'doc', id: 'get-started/overview-&-architecture' },
      items: [
        'get-started/overview-&-architecture',
        'get-started/why-wso2-integrator',
        'get-started/key-concepts',
        {
          type: 'category',
          label: 'Set Up',
          items: [
            'get-started/system-requirements',
            'get-started/install',
            'get-started/first-project',
            'get-started/understand-the-ide',
          ],
        },
        {
          type: 'category',
          label: 'Quick Starts',
          items: [
            'get-started/quick-start-api',
            'get-started/quick-start-event',
            'get-started/quick-start-file',
            'get-started/quick-start-automation',
            'get-started/quick-start-data-service',
            'get-started/quick-start-ai-agent',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // DEVELOP
    // "How do I build, transform, and test X?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Develop',
      collapsed: true,
      link: { type: 'doc', id: 'develop/overview' },
      items: [
        // 6.1 Create Integrations
        {
          type: 'category',
          label: 'Create Integrations',
          items: [
            'develop/create-integrations/create-new-integration',
            'develop/create-integrations/open-integration-or-project',
            'develop/create-integrations/explore-samples',
            'develop/create-integrations/create-library',
            'develop/create-integrations/migrate-3rd-party-integrations',
          ],
        },
        // 6.2 Project Views
        {
          type: 'category',
          label: 'Project Views',
          items: [
            'develop/project-views/project-view',
            'develop/project-views/integration-view',
            'develop/project-views/library-view',
          ],
        },
        // 6.3 Integration Artifacts
        {
          type: 'category',
          label: 'Integration Artifacts',
          items: [
            'develop/integration-artifacts/automation',
            {
              type: 'category', label: 'Integration as API',
              collapsed: true,
              items: [
                'develop/integration-artifacts/service/http-service',
                'develop/integration-artifacts/service/graphql-service',
                'develop/integration-artifacts/service/tcp-service',
                'develop/integration-artifacts/service/websocket-service',
                'develop/integration-artifacts/service/websub-service',
                'develop/integration-artifacts/service/grpc-service',
              ],
            },
            {
              type: 'category', label: 'Event Integration',
              collapsed: true,
              items: [
                'develop/integration-artifacts/event/kafka',
                'develop/integration-artifacts/event/rabbitmq',
                'develop/integration-artifacts/event/mqtt',
                'develop/integration-artifacts/event/azure-service-bus',
                'develop/integration-artifacts/event/smtp',
                'develop/integration-artifacts/event/pop3-imap4',
                'develop/integration-artifacts/event/salesforce-events',
                'develop/integration-artifacts/event/twilio',
                'develop/integration-artifacts/event/github-webhooks',
                'develop/integration-artifacts/event/solace',
                'develop/integration-artifacts/event/cdc-mssql',
                'develop/integration-artifacts/event/cdc-postgresql',
              ],
            },
            {
              type: 'category', label: 'File Integration',
              collapsed: true,
              items: [
                {
                  type: 'category', label: 'Remote Servers (FTP/SFTP)',
                  collapsed: true,
                  link: { type: 'doc', id: 'develop/integration-artifacts/file/ftp-sftp' },
                  items: [
                    'develop/integration-artifacts/file/csv-fault-tolerance',
                    'develop/integration-artifacts/file/file-dependency-triggers',
                    'develop/integration-artifacts/file/streaming-large-files',
                    'develop/integration-artifacts/file/resiliency',
                    'develop/integration-artifacts/file/high-availability',
                  ],
                },
                'develop/integration-artifacts/file/local-files',
              ],
            },
            {
              type: 'category', label: 'Other Artifacts',
              collapsed: true,
              items: [
                'develop/integration-artifacts/supporting/types',
                'develop/integration-artifacts/supporting/connections',
                'develop/integration-artifacts/supporting/configurations',
                'develop/integration-artifacts/supporting/functions',
                'develop/integration-artifacts/supporting/data-mapper',
              ],
            },
          ],
        },
        // 6.4 Design Integration Logic
        {
          type: 'category',
          label: 'Design Integration Logic',
          items: [
            'develop/design-logic/overview',
            'develop/design-logic/flow-designer',
            'develop/design-logic/connections',
            'develop/design-logic/control-flow',
            'develop/design-logic/error-handling',
            'develop/design-logic/expressions',
            'develop/design-logic/query-expressions',
            'develop/design-logic/configuration-management',
            'develop/design-logic/functions',
            'develop/design-logic/ballerina-pro-code',
            'develop/design-logic/java-interoperability',
          ],
        },
        // 6.5 Transform (per blueprint)
        {
          type: 'category',
          label: 'Transform',
          items: [
            'develop/transform/data-mapper',
            'develop/transform/json',
            'develop/transform/xml',
            'develop/transform/csv-flat-file',
            'develop/transform/edi',
            'develop/transform/yaml-toml',
            'develop/transform/type-system',
            'develop/transform/query-expressions',
            'develop/transform/expressions-functions',
          ],
        },
        // 6.6 Try & Test
        {
          type: 'category',
          label: 'Try & Test',
          items: [
            'develop/test/try-it',
            'develop/test/unit-testing',
            'develop/test/test-services-clients',
            'develop/test/data-driven-tests',
            'develop/test/test-groups',
            'develop/test/mocking',
            'develop/test/execute-tests',
            'develop/test/code-coverage',
          ],
        },
        // 6.7 Debugging & Troubleshooting
        {
          type: 'category',
          label: 'Debugging & Troubleshooting',
          items: [
            'develop/debugging/overview',
            'develop/debugging/editor-debugging',
            'develop/debugging/remote-debugging',
            'develop/debugging/strand-dumps',
            'develop/debugging/performance-profiling',
          ],
        },
        // 6.8 Organize Code
        {
          type: 'category',
          label: 'Organize Code',
          items: [
            'develop/organize-code/packages-modules',
            'develop/organize-code/package-references',
            'develop/organize-code/manage-dependencies',
            'develop/organize-code/workspaces',
            {type: 'doc', id: 'develop/organize-code/style-guide', label: 'Code Style Guide & Formatting'},
            {type: 'doc', id: 'develop/organize-code/generate-documentation', label: 'Generating Code Documentation'},
          ],
        },
        // 6.9 Tools
        {
          type: 'category',
          label: 'Tools',
          link: { type: 'doc', id: 'develop/tools/overview' },
          items: [
            'develop/tools/migration-tools',
            'develop/tools/openapi-tool',
            'develop/tools/graphql-tool',
            'develop/tools/asyncapi-tool',
            'develop/tools/grpc-tool',
            'develop/tools/health-tool',
            'develop/tools/edi-tool',
            'develop/tools/wsdl-tool',
            'develop/tools/xsd-tool',
            {
              type: 'category', label: 'Data Persistence',
              collapsed: true,
              items: [
                'develop/tools/data-persistence/overview',
                'develop/tools/data-persistence/data-model-definition',
                'develop/tools/data-persistence/client-api',
                'develop/tools/data-persistence/supported-stores',
                'develop/tools/data-persistence/database-introspection',
              ],
            },
            'develop/tools/scan-tool',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // CONNECTORS
    // "Can I connect to Y?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Connectors',
      collapsed: true,
      link: { type: 'doc', id: 'connectors/overview' },
      items: [
    // ── Connector Catalog ──
    {
      type: 'category',
      label: 'Connector Catalog',
      collapsed: true,
      link: { type: 'doc', id: 'connectors/catalog/index' },
      items: [
        // ── Connector categories (alphabetical) ──
        {
          type: 'category',
          label: 'AI',
          link: { type: 'doc', id: 'connectors/catalog/built-in/ai/overview' },
          items: [
            'connectors/catalog/built-in/ai/action-reference',
            'connectors/catalog/built-in/ai/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'AI Devant',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/ai.devant/overview' },
          items: [
            'connectors/catalog/ai-ml/ai.devant/setup-guide',
            'connectors/catalog/ai-ml/ai.devant/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'AI Memory MSSQL',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/ai.memory.mssql/overview' },
          items: [
            'connectors/catalog/ai-ml/ai.memory.mssql/setup-guide',
            'connectors/catalog/ai-ml/ai.memory.mssql/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Alfresco',
          link: { type: 'doc', id: 'connectors/catalog/storage-file/alfresco/overview' },
          items: [
            'connectors/catalog/storage-file/alfresco/setup-guide',
            'connectors/catalog/storage-file/alfresco/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'AMP',
          link: { type: 'doc', id: 'connectors/catalog/developer-tools/amp/overview' },
          items: [
            'connectors/catalog/developer-tools/amp/setup-guide',
            'connectors/catalog/developer-tools/amp/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Anthropic LLM',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/ai.anthropic/overview' },
          items: [
            'connectors/catalog/ai-ml/ai.anthropic/setup-guide',
            'connectors/catalog/ai-ml/ai.anthropic/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Asana',
          link: { type: 'doc', id: 'connectors/catalog/productivity-collaboration/asana/overview' },
          items: [
            'connectors/catalog/productivity-collaboration/asana/setup-guide',
            'connectors/catalog/productivity-collaboration/asana/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'AWS Lambda',
          link: { type: 'doc', id: 'connectors/catalog/cloud-infrastructure/aws.lambda/overview' },
          items: [
            'connectors/catalog/cloud-infrastructure/aws.lambda/setup-guide',
            'connectors/catalog/cloud-infrastructure/aws.lambda/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'AWS Marketplace MPE',
          link: { type: 'doc', id: 'connectors/catalog/cloud-infrastructure/aws.marketplace.mpe/overview' },
          items: [
            'connectors/catalog/cloud-infrastructure/aws.marketplace.mpe/setup-guide',
            'connectors/catalog/cloud-infrastructure/aws.marketplace.mpe/action-reference',
            'connectors/catalog/cloud-infrastructure/aws.marketplace.mpe/example',
          ],
        },
        {
          type: 'category',
          label: 'AWS Marketplace MPM',
          link: { type: 'doc', id: 'connectors/catalog/cloud-infrastructure/aws.marketplace.mpm/overview' },
          items: [
            'connectors/catalog/cloud-infrastructure/aws.marketplace.mpm/setup-guide',
            'connectors/catalog/cloud-infrastructure/aws.marketplace.mpm/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'AWS Redshift',
          link: { type: 'doc', id: 'connectors/catalog/database/aws.redshift/overview' },
          items: [
            'connectors/catalog/database/aws.redshift/setup-guide',
            'connectors/catalog/database/aws.redshift/action-reference',
            'connectors/catalog/database/aws.redshift/example',
          ],
        },
        {
          type: 'category',
          label: 'AWS Redshift Data',
          link: { type: 'doc', id: 'connectors/catalog/database/aws.redshiftdata/overview' },
          items: [
            'connectors/catalog/database/aws.redshiftdata/setup-guide',
            'connectors/catalog/database/aws.redshiftdata/action-reference',
            'connectors/catalog/database/aws.redshiftdata/example',
          ],
        },
        {
          type: 'category',
          label: 'AWS S3',
          link: { type: 'doc', id: 'connectors/catalog/storage-file/aws.s3/overview' },
          items: [
            'connectors/catalog/storage-file/aws.s3/setup-guide',
            'connectors/catalog/storage-file/aws.s3/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'AWS Secrets Manager',
          link: { type: 'doc', id: 'connectors/catalog/security-identity/aws.secretmanager/overview' },
          items: [
            'connectors/catalog/security-identity/aws.secretmanager/setup-guide',
            'connectors/catalog/security-identity/aws.secretmanager/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'AWS SNS',
          link: { type: 'doc', id: 'connectors/catalog/communication/aws.sns/overview' },
          items: [
            'connectors/catalog/communication/aws.sns/setup-guide',
            'connectors/catalog/communication/aws.sns/action-reference',
            'connectors/catalog/communication/aws.sns/example',
          ],
        },
        {
          type: 'category',
          label: 'AWS SQS',
          link: { type: 'doc', id: 'connectors/catalog/messaging/aws.sqs/overview' },
          items: [
            'connectors/catalog/messaging/aws.sqs/setup-guide',
            'connectors/catalog/messaging/aws.sqs/action-reference',
            'connectors/catalog/messaging/aws.sqs/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Azure AI Search',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/azure.ai.search/overview' },
          items: [
            'connectors/catalog/ai-ml/azure.ai.search/setup-guide',
            'connectors/catalog/ai-ml/azure.ai.search/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Azure AI Search Index',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/azure.ai.search.index/overview' },
          items: [
            'connectors/catalog/ai-ml/azure.ai.search.index/setup-guide',
            'connectors/catalog/ai-ml/azure.ai.search.index/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Azure Functions',
          link: { type: 'doc', id: 'connectors/catalog/cloud-infrastructure/azure.functions/overview' },
          items: [
            'connectors/catalog/cloud-infrastructure/azure.functions/setup-guide',
            'connectors/catalog/cloud-infrastructure/azure.functions/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Azure OpenAI',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/ai.azure/overview' },
          items: [
            'connectors/catalog/ai-ml/ai.azure/setup-guide',
            'connectors/catalog/ai-ml/ai.azure/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Azure Service Bus',
          link: { type: 'doc', id: 'connectors/catalog/messaging/asb/overview' },
          items: [
            'connectors/catalog/messaging/asb/setup-guide',
            'connectors/catalog/messaging/asb/action-reference',
            'connectors/catalog/messaging/asb/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Azure Storage Service',
          link: { type: 'doc', id: 'connectors/catalog/storage-file/azure_storage_service/overview' },
          items: [
            'connectors/catalog/storage-file/azure_storage_service/setup-guide',
            'connectors/catalog/storage-file/azure_storage_service/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Candid',
          link: { type: 'doc', id: 'connectors/catalog/productivity-collaboration/candid/overview' },
          items: [
            'connectors/catalog/productivity-collaboration/candid/setup-guide',
            'connectors/catalog/productivity-collaboration/candid/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'CDC',
          link: { type: 'doc', id: 'connectors/catalog/database/cdc/overview' },
          items: [
            'connectors/catalog/database/cdc/setup-guide',
            'connectors/catalog/database/cdc/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Confluent Avro SerDes',
          link: { type: 'doc', id: 'connectors/catalog/messaging/confluent.cavroserdes/overview' },
          items: [
            'connectors/catalog/messaging/confluent.cavroserdes/setup-guide',
            'connectors/catalog/messaging/confluent.cavroserdes/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Confluent Schema Registry',
          link: { type: 'doc', id: 'connectors/catalog/messaging/confluent.cregistry/overview' },
          items: [
            'connectors/catalog/messaging/confluent.cregistry/setup-guide',
            'connectors/catalog/messaging/confluent.cregistry/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Copybook',
          link: { type: 'doc', id: 'connectors/catalog/developer-tools/copybook/overview' },
          items: [
            'connectors/catalog/developer-tools/copybook/setup-guide',
            'connectors/catalog/developer-tools/copybook/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'DeepSeek',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/ai.deepseek/overview' },
          items: [
            'connectors/catalog/ai-ml/ai.deepseek/setup-guide',
            'connectors/catalog/ai-ml/ai.deepseek/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Discord',
          link: { type: 'doc', id: 'connectors/catalog/communication/discord/overview' },
          items: [
            'connectors/catalog/communication/discord/setup-guide',
            'connectors/catalog/communication/discord/action-reference',
            'connectors/catalog/communication/discord/example',
          ],
        },
        {
          type: 'category',
          label: 'DocuSign Admin',
          link: { type: 'doc', id: 'connectors/catalog/productivity-collaboration/docusign.dsadmin/overview' },
          items: [
            'connectors/catalog/productivity-collaboration/docusign.dsadmin/setup-guide',
            'connectors/catalog/productivity-collaboration/docusign.dsadmin/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Elastic Cloud',
          link: { type: 'doc', id: 'connectors/catalog/cloud-infrastructure/elastic.elasticcloud/overview' },
          items: [
            'connectors/catalog/cloud-infrastructure/elastic.elasticcloud/setup-guide',
            'connectors/catalog/cloud-infrastructure/elastic.elasticcloud/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Email',
          link: { type: 'doc', id: 'connectors/catalog/built-in/email/overview' },
          items: [
            'connectors/catalog/built-in/email/setup-guide',
            'connectors/catalog/built-in/email/action-reference',
            'connectors/catalog/built-in/email/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'FTP',
          link: { type: 'doc', id: 'connectors/catalog/built-in/ftp/overview' },
          items: [
            'connectors/catalog/built-in/ftp/action-reference',
            'connectors/catalog/built-in/ftp/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Github',
          link: { type: 'doc', id: 'connectors/catalog/developer-tools/github/overview' },
          items: [
            'connectors/catalog/developer-tools/github/setup-guide',
            'connectors/catalog/developer-tools/github/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Gmail',
          link: { type: 'doc', id: 'connectors/catalog/communication/googleapis.gmail/overview' },
          items: [
            'connectors/catalog/communication/googleapis.gmail/setup-guide',
            'connectors/catalog/communication/googleapis.gmail/action-reference',
            'connectors/catalog/communication/googleapis-gmail/example',
          ],
        },
        {
          type: 'category',
          label: 'Google Calendar',
          link: { type: 'doc', id: 'connectors/catalog/productivity-collaboration/googleapis.calendar/overview' },
          items: [
            'connectors/catalog/productivity-collaboration/googleapis.calendar/setup-guide',
            'connectors/catalog/productivity-collaboration/googleapis.calendar/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Google Cloud Pub/Sub',
          link: { type: 'doc', id: 'connectors/catalog/messaging/gcloud.pubsub/overview' },
          items: [
            'connectors/catalog/messaging/gcloud.pubsub/setup-guide',
            'connectors/catalog/messaging/gcloud.pubsub/action-reference',
            'connectors/catalog/messaging/gcloud.pubsub/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Google GCalendar',
          link: { type: 'doc', id: 'connectors/catalog/productivity-collaboration/googleapis.gcalendar/overview' },
          items: [
            'connectors/catalog/productivity-collaboration/googleapis.gcalendar/setup-guide',
            'connectors/catalog/productivity-collaboration/googleapis.gcalendar/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Google Sheets',
          link: { type: 'doc', id: 'connectors/catalog/productivity-collaboration/googleapis.sheets/overview' },
          items: [
            'connectors/catalog/productivity-collaboration/googleapis.sheets/setup-guide',
            'connectors/catalog/productivity-collaboration/googleapis.sheets/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'gRPC',
          link: { type: 'doc', id: 'connectors/catalog/built-in/grpc/overview' },
          items: [
            'connectors/catalog/built-in/grpc/action-reference',
            'connectors/catalog/built-in/grpc/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'GraphQL',
          link: { type: 'doc', id: 'connectors/catalog/built-in/graphql/overview' },
          items: [
            'connectors/catalog/built-in/graphql/action-reference',
            'connectors/catalog/built-in/graphql/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Guidewire InsuranceNow',
          link: { type: 'doc', id: 'connectors/catalog/erp-business/guidewire.insnow/overview' },
          items: [
            'connectors/catalog/erp-business/guidewire.insnow/setup-guide',
            'connectors/catalog/erp-business/guidewire.insnow/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HTTP',
          link: { type: 'doc', id: 'connectors/catalog/built-in/http/overview' },
          items: [
            'connectors/catalog/built-in/http/action-reference',
            'connectors/catalog/built-in/http/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot Automation Actions',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.automation.actions/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.automation.actions/setup-guide',
            'connectors/catalog/crm-sales/hubspot.automation.actions/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Associations',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.associations/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.associations/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.associations/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Associations Schema',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.associations.schema/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.associations.schema/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.associations.schema/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Commerce Carts',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.commerce.carts/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.commerce.carts/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.commerce.carts/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Commerce Discounts',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.commerce.discounts/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.commerce.discounts/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.commerce.discounts/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Commerce Orders',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.commerce.orders/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.commerce.orders/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.commerce.orders/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Commerce Quotes',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.commerce.quotes/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.commerce.quotes/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.commerce.quotes/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Commerce Taxes',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.commerce.taxes/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.commerce.taxes/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.commerce.taxes/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Companies',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.obj.companies/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.obj.companies/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.obj.companies/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Contacts',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.obj.contacts/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.obj.contacts/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.obj.contacts/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Deals',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.obj.deals/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.obj.deals/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.obj.deals/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Engagement Meeting',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.engagement.meeting/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.engagement.meeting/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.engagement.meeting/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Engagement Notes',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.engagement.notes/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.engagement.notes/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.engagement.notes/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Engagements Calls',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.engagements.calls/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.engagements.calls/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.engagements.calls/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Engagements Communications',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.engagements.communications/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.engagements.communications/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.engagements.communications/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Engagements Email',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.engagements.email/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.engagements.email/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.engagements.email/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Engagements Tasks',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.engagements.tasks/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.engagements.tasks/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.engagements.tasks/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Extensions Timelines',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.extensions.timelines/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.extensions.timelines/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.extensions.timelines/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Extensions Videoconferencing',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.extensions.videoconferencing/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.extensions.videoconferencing/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.extensions.videoconferencing/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Feedback',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.obj.feedback/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.obj.feedback/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.obj.feedback/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Import',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.import/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.import/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.import/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Leads',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.obj.leads/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.obj.leads/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.obj.leads/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Line Items',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.obj.lineitems/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.obj.lineitems/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.obj.lineitems/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Lists',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.lists/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.lists/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.lists/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Owners',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.owners/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.owners/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.owners/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Pipelines',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.pipelines/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.pipelines/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.pipelines/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Products',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.obj.products/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.obj.products/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.obj.products/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Properties',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.properties/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.properties/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.properties/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Schemas',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.obj.schemas/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.obj.schemas/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.obj.schemas/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot CRM Tickets',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/hubspot.crm.obj.tickets/overview' },
          items: [
            'connectors/catalog/crm-sales/hubspot.crm.obj.tickets/setup-guide',
            'connectors/catalog/crm-sales/hubspot.crm.obj.tickets/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot Marketing Campaigns',
          link: { type: 'doc', id: 'connectors/catalog/marketing-social/hubspot.marketing.campaigns/overview' },
          items: [
            'connectors/catalog/marketing-social/hubspot.marketing.campaigns/setup-guide',
            'connectors/catalog/marketing-social/hubspot.marketing.campaigns/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot Marketing Emails',
          link: { type: 'doc', id: 'connectors/catalog/marketing-social/hubspot.marketing.emails/overview' },
          items: [
            'connectors/catalog/marketing-social/hubspot.marketing.emails/setup-guide',
            'connectors/catalog/marketing-social/hubspot.marketing.emails/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot Marketing Events',
          link: { type: 'doc', id: 'connectors/catalog/marketing-social/hubspot.marketing.events/overview' },
          items: [
            'connectors/catalog/marketing-social/hubspot.marketing.events/setup-guide',
            'connectors/catalog/marketing-social/hubspot.marketing.events/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot Marketing Forms',
          link: { type: 'doc', id: 'connectors/catalog/marketing-social/hubspot.marketing.forms/overview' },
          items: [
            'connectors/catalog/marketing-social/hubspot.marketing.forms/setup-guide',
            'connectors/catalog/marketing-social/hubspot.marketing.forms/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot Marketing Subscriptions',
          link: { type: 'doc', id: 'connectors/catalog/marketing-social/hubspot.marketing.subscriptions/overview' },
          items: [
            'connectors/catalog/marketing-social/hubspot.marketing.subscriptions/setup-guide',
            'connectors/catalog/marketing-social/hubspot.marketing.subscriptions/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'HubSpot Marketing Transactional',
          link: { type: 'doc', id: 'connectors/catalog/marketing-social/hubspot.marketing.transactional/overview' },
          items: [
            'connectors/catalog/marketing-social/hubspot.marketing.transactional/setup-guide',
            'connectors/catalog/marketing-social/hubspot.marketing.transactional/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'IBM CTG',
          link: { type: 'doc', id: 'connectors/catalog/erp-business/ibm.ctg/overview' },
          items: [
            'connectors/catalog/erp-business/ibm.ctg/setup-guide',
            'connectors/catalog/erp-business/ibm.ctg/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'IBM MQ',
          link: { type: 'doc', id: 'connectors/catalog/messaging/ibm.ibmmq/overview' },
          items: [
            'connectors/catalog/messaging/ibm.ibmmq/setup-guide',
            'connectors/catalog/messaging/ibm.ibmmq/action-reference',
            'connectors/catalog/messaging/ibm.ibmmq/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'IDE Trace Provider',
          link: { type: 'doc', id: 'connectors/catalog/developer-tools/idetraceprovider/overview' },
          items: [
            'connectors/catalog/developer-tools/idetraceprovider/setup-guide',
            'connectors/catalog/developer-tools/idetraceprovider/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Java JDBC',
          link: { type: 'doc', id: 'connectors/catalog/database/java.jdbc/overview' },
          items: [
            'connectors/catalog/database/java.jdbc/setup-guide',
            'connectors/catalog/database/java.jdbc/action-reference',
            'connectors/catalog/database/java.jdbc/example',
          ],
        },
        {
          type: 'category',
          label: 'Jira',
          link: { type: 'doc', id: 'connectors/catalog/productivity-collaboration/jira/overview' },
          items: [
            'connectors/catalog/productivity-collaboration/jira/setup-guide',
            'connectors/catalog/productivity-collaboration/jira/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'JMS',
          link: { type: 'doc', id: 'connectors/catalog/messaging/java.jms/overview' },
          items: [
            'connectors/catalog/messaging/java.jms/setup-guide',
            'connectors/catalog/messaging/java.jms/action-reference',
            'connectors/catalog/messaging/java.jms/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Kafka',
          link: { type: 'doc', id: 'connectors/catalog/messaging/kafka/overview' },
          items: [
            'connectors/catalog/messaging/kafka/setup-guide',
            'connectors/catalog/messaging/kafka/action-reference',
            'connectors/catalog/messaging/kafka/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Mailchimp Marketing',
          link: { type: 'doc', id: 'connectors/catalog/marketing-social/mailchimp.marketing/overview' },
          items: [
            'connectors/catalog/marketing-social/mailchimp.marketing/setup-guide',
            'connectors/catalog/marketing-social/mailchimp.marketing/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Mailchimp Transactional',
          link: { type: 'doc', id: 'connectors/catalog/marketing-social/mailchimp.transactional/overview' },
          items: [
            'connectors/catalog/marketing-social/mailchimp.transactional/setup-guide',
            'connectors/catalog/marketing-social/mailchimp.transactional/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'MCP',
          link: { type: 'doc', id: 'connectors/catalog/built-in/mcp/overview' },
          items: [
            'connectors/catalog/built-in/mcp/action-reference',
            'connectors/catalog/built-in/mcp/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Microsoft OneDrive',
          link: { type: 'doc', id: 'connectors/catalog/storage-file/microsoft.onedrive/overview' },
          items: [
            'connectors/catalog/storage-file/microsoft.onedrive/setup-guide',
            'connectors/catalog/storage-file/microsoft.onedrive/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Milvus',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/milvus/overview' },
          items: [
            'connectors/catalog/ai-ml/milvus/setup-guide',
            'connectors/catalog/ai-ml/milvus/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Mistral',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/mistral/overview' },
          items: [
            'connectors/catalog/ai-ml/mistral/setup-guide',
            'connectors/catalog/ai-ml/mistral/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Mistral AI',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/ai.mistral/overview' },
          items: [
            'connectors/catalog/ai-ml/ai.mistral/setup-guide',
            'connectors/catalog/ai-ml/ai.mistral/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Moesif',
          link: { type: 'doc', id: 'connectors/catalog/developer-tools/moesif/overview' },
          items: [
            'connectors/catalog/developer-tools/moesif/setup-guide',
            'connectors/catalog/developer-tools/moesif/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'MongoDB',
          link: { type: 'doc', id: 'connectors/catalog/database/mongodb/overview' },
          items: [
            'connectors/catalog/database/mongodb/setup-guide',
            'connectors/catalog/database/mongodb/action-reference',
            'connectors/catalog/database/mongodb/example',
          ],
        },
        {
          type: 'category',
          label: 'MSSQL',
          link: { type: 'doc', id: 'connectors/catalog/database/mssql/overview' },
          items: [
            'connectors/catalog/database/mssql/setup-guide',
            'connectors/catalog/database/mssql/action-reference',
            'connectors/catalog/database/mssql/trigger-reference',
            'connectors/catalog/database/mssql/example',
          ],
        },
        {
          type: 'category',
          label: 'MySQL',
          link: { type: 'doc', id: 'connectors/catalog/database/mysql/overview' },
          items: [
            'connectors/catalog/database/mysql/setup-guide',
            'connectors/catalog/database/mysql/action-reference',
            'connectors/catalog/database/mysql/trigger-reference',
            'connectors/catalog/database/mysql/example',
          ],
        },
        {
          type: 'category',
          label: 'NATS',
          link: { type: 'doc', id: 'connectors/catalog/messaging/nats/overview' },
          items: [
            'connectors/catalog/messaging/nats/setup-guide',
            'connectors/catalog/messaging/nats/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'New Relic',
          link: { type: 'doc', id: 'connectors/catalog/developer-tools/newrelic/overview' },
          items: [
            'connectors/catalog/developer-tools/newrelic/setup-guide',
            'connectors/catalog/developer-tools/newrelic/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'NP',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/np/overview' },
          items: [
            'connectors/catalog/ai-ml/np/setup-guide',
            'connectors/catalog/ai-ml/np/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Ollama',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/ai.ollama/overview' },
          items: [
            'connectors/catalog/ai-ml/ai.ollama/setup-guide',
            'connectors/catalog/ai-ml/ai.ollama/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'OpenAI',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/openai/overview' },
          items: [
            'connectors/catalog/ai-ml/openai/setup-guide',
            'connectors/catalog/ai-ml/openai/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'OpenAI (AI)',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/ai.openai/overview' },
          items: [
            'connectors/catalog/ai-ml/ai.openai/setup-guide',
            'connectors/catalog/ai-ml/ai.openai/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'OpenAI Audio',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/openai.audio/overview' },
          items: [
            'connectors/catalog/ai-ml/openai.audio/setup-guide',
            'connectors/catalog/ai-ml/openai.audio/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'OpenAI Fine-Tunes',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/openai.finetunes/overview' },
          items: [
            'connectors/catalog/ai-ml/openai.finetunes/setup-guide',
            'connectors/catalog/ai-ml/openai.finetunes/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Oracle DB',
          link: { type: 'doc', id: 'connectors/catalog/database/oracledb/overview' },
          items: [
            'connectors/catalog/database/oracledb/setup-guide',
            'connectors/catalog/database/oracledb/action-reference',
            'connectors/catalog/database/oracledb/example',
          ],
        },
        {
          type: 'category',
          label: 'PayPal Invoices',
          link: { type: 'doc', id: 'connectors/catalog/finance-accounting/paypal.invoices/overview' },
          items: [
            'connectors/catalog/finance-accounting/paypal.invoices/setup-guide',
            'connectors/catalog/finance-accounting/paypal.invoices/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'PayPal Orders',
          link: { type: 'doc', id: 'connectors/catalog/finance-accounting/paypal.orders/overview' },
          items: [
            'connectors/catalog/finance-accounting/paypal.orders/setup-guide',
            'connectors/catalog/finance-accounting/paypal.orders/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'PayPal Payments',
          link: { type: 'doc', id: 'connectors/catalog/finance-accounting/paypal.payments/overview' },
          items: [
            'connectors/catalog/finance-accounting/paypal.payments/setup-guide',
            'connectors/catalog/finance-accounting/paypal.payments/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'PayPal Subscriptions',
          link: { type: 'doc', id: 'connectors/catalog/finance-accounting/paypal.subscriptions/overview' },
          items: [
            'connectors/catalog/finance-accounting/paypal.subscriptions/setup-guide',
            'connectors/catalog/finance-accounting/paypal.subscriptions/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'People HR',
          link: { type: 'doc', id: 'connectors/catalog/hrms/peoplehr/overview' },
          items: [
            'connectors/catalog/hrms/peoplehr/setup-guide',
            'connectors/catalog/hrms/peoplehr/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'pgvector',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/ai.pgvector/overview' },
          items: [
            'connectors/catalog/ai-ml/ai.pgvector/setup-guide',
            'connectors/catalog/ai-ml/ai.pgvector/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Pinecone',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/ai.pinecone/overview' },
          items: [
            'connectors/catalog/ai-ml/ai.pinecone/setup-guide',
            'connectors/catalog/ai-ml/ai.pinecone/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'PostgreSQL',
          link: { type: 'doc', id: 'connectors/catalog/database/postgresql/overview' },
          items: [
            'connectors/catalog/database/postgresql/setup-guide',
            'connectors/catalog/database/postgresql/action-reference',
            'connectors/catalog/database/postgresql/trigger-reference',
            'connectors/catalog/database/postgresql/example',
          ],
        },
        {
          type: 'category',
          label: 'RabbitMQ',
          link: { type: 'doc', id: 'connectors/catalog/messaging/rabbitmq/overview' },
          items: [
            'connectors/catalog/messaging/rabbitmq/setup-guide',
            'connectors/catalog/messaging/rabbitmq/action-reference',
            'connectors/catalog/messaging/rabbitmq/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Redis',
          link: { type: 'doc', id: 'connectors/catalog/database/redis/overview' },
          items: [
            'connectors/catalog/database/redis/setup-guide',
            'connectors/catalog/database/redis/action-reference',
            'connectors/catalog/database/redis/example',
          ],
        },
        {
          type: 'category',
          label: 'SAP',
          link: { type: 'doc', id: 'connectors/catalog/erp-business/sap/overview' },
          items: [
            'connectors/catalog/erp-business/sap/setup-guide',
            'connectors/catalog/erp-business/sap/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'SAP Commerce',
          link: { type: 'doc', id: 'connectors/catalog/ecommerce/sap.commerce.webservices/overview' },
          items: [
            'connectors/catalog/ecommerce/sap.commerce.webservices/setup-guide',
            'connectors/catalog/ecommerce/sap.commerce.webservices/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'SAP Sales Area',
          link: { type: 'doc', id: 'connectors/catalog/erp-business/sap.s4hana.salesarea_0001/overview' },
          items: [
            'connectors/catalog/erp-business/sap.s4hana.salesarea_0001/setup-guide',
            'connectors/catalog/erp-business/sap.s4hana.salesarea_0001/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'SAP Sales District',
          link: { type: 'doc', id: 'connectors/catalog/erp-business/sap.s4hana.api_salesdistrict_srv/overview' },
          items: [
            'connectors/catalog/erp-business/sap.s4hana.api_salesdistrict_srv/setup-guide',
            'connectors/catalog/erp-business/sap.s4hana.api_salesdistrict_srv/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'SAP Sales Inquiry',
          link: { type: 'doc', id: 'connectors/catalog/erp-business/sap.s4hana.api_sales_inquiry_srv/overview' },
          items: [
            'connectors/catalog/erp-business/sap.s4hana.api_sales_inquiry_srv/setup-guide',
            'connectors/catalog/erp-business/sap.s4hana.api_sales_inquiry_srv/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'SAP Sales Order',
          link: { type: 'doc', id: 'connectors/catalog/erp-business/sap.s4hana.api_sales_order_srv/overview' },
          items: [
            'connectors/catalog/erp-business/sap.s4hana.api_sales_order_srv/setup-guide',
            'connectors/catalog/erp-business/sap.s4hana.api_sales_order_srv/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'SAP Sales Order Analytics',
          link: { type: 'doc', id: 'connectors/catalog/erp-business/sap.s4hana.ce_salesorder_0001/overview' },
          items: [
            'connectors/catalog/erp-business/sap.s4hana.ce_salesorder_0001/setup-guide',
            'connectors/catalog/erp-business/sap.s4hana.ce_salesorder_0001/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'SAP Sales Order Simulation',
          link: { type: 'doc', id: 'connectors/catalog/erp-business/sap.s4hana.api_sales_order_simulation_srv/overview' },
          items: [
            'connectors/catalog/erp-business/sap.s4hana.api_sales_order_simulation_srv/setup-guide',
            'connectors/catalog/erp-business/sap.s4hana.api_sales_order_simulation_srv/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'SAP Sales Organization',
          link: { type: 'doc', id: 'connectors/catalog/erp-business/sap.s4hana.api_salesorganization_srv/overview' },
          items: [
            'connectors/catalog/erp-business/sap.s4hana.api_salesorganization_srv/setup-guide',
            'connectors/catalog/erp-business/sap.s4hana.api_salesorganization_srv/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'SAP Sales Quotation',
          link: { type: 'doc', id: 'connectors/catalog/erp-business/sap.s4hana.api_sales_quotation_srv/overview' },
          items: [
            'connectors/catalog/erp-business/sap.s4hana.api_sales_quotation_srv/setup-guide',
            'connectors/catalog/erp-business/sap.s4hana.api_sales_quotation_srv/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'SAP SD Incoterms',
          link: { type: 'doc', id: 'connectors/catalog/erp-business/sap.s4hana.api_sd_incoterms_srv/overview' },
          items: [
            'connectors/catalog/erp-business/sap.s4hana.api_sd_incoterms_srv/setup-guide',
            'connectors/catalog/erp-business/sap.s4hana.api_sd_incoterms_srv/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'SAP SD Sold-to-Party Determination',
          link: { type: 'doc', id: 'connectors/catalog/erp-business/sap.s4hana.api_sd_sa_soldtopartydetn/overview' },
          items: [
            'connectors/catalog/erp-business/sap.s4hana.api_sd_sa_soldtopartydetn/setup-guide',
            'connectors/catalog/erp-business/sap.s4hana.api_sd_sa_soldtopartydetn/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Salesforce',
          link: { type: 'doc', id: 'connectors/catalog/crm-sales/salesforce/overview' },
          items: [
            'connectors/catalog/crm-sales/salesforce/setup-guide',
            'connectors/catalog/crm-sales/salesforce/action-reference',
            'connectors/catalog/crm-sales/salesforce/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Salesforce Marketing Cloud',
          link: { type: 'doc', id: 'connectors/catalog/marketing-social/salesforce.marketingcloud/overview' },
          items: [
            'connectors/catalog/marketing-social/salesforce.marketingcloud/setup-guide',
            'connectors/catalog/marketing-social/salesforce.marketingcloud/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'SCIM',
          link: { type: 'doc', id: 'connectors/catalog/security-identity/scim/overview' },
          items: [
            'connectors/catalog/security-identity/scim/setup-guide',
            'connectors/catalog/security-identity/scim/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Shopify Admin',
          link: { type: 'doc', id: 'connectors/catalog/ecommerce/shopify.admin/overview' },
          items: [
            'connectors/catalog/ecommerce/shopify.admin/setup-guide',
            'connectors/catalog/ecommerce/shopify.admin/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Slack',
          link: { type: 'doc', id: 'connectors/catalog/communication/slack/overview' },
          items: [
            'connectors/catalog/communication/slack/setup-guide',
            'connectors/catalog/communication/slack/action-reference',
            'connectors/catalog/communication/slack/example',
          ],
        },
        {
          type: 'category',
          label: 'Smartsheet',
          link: { type: 'doc', id: 'connectors/catalog/productivity-collaboration/smartsheet/overview' },
          items: [
            'connectors/catalog/productivity-collaboration/smartsheet/setup-guide',
            'connectors/catalog/productivity-collaboration/smartsheet/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Snowflake',
          link: { type: 'doc', id: 'connectors/catalog/database/snowflake/overview' },
          items: [
            'connectors/catalog/database/snowflake/setup-guide',
            'connectors/catalog/database/snowflake/action-reference',
            'connectors/catalog/database/snowflake/example',
          ],
        },
        {
          type: 'category',
          label: 'Solace',
          link: { type: 'doc', id: 'connectors/catalog/messaging/solace/overview' },
          items: [
            'connectors/catalog/messaging/solace/setup-guide',
            'connectors/catalog/messaging/solace/action-reference',
            'connectors/catalog/messaging/solace/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Stripe',
          link: { type: 'doc', id: 'connectors/catalog/finance-accounting/stripe/overview' },
          items: [
            'connectors/catalog/finance-accounting/stripe/setup-guide',
            'connectors/catalog/finance-accounting/stripe/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'TCP',
          link: { type: 'doc', id: 'connectors/catalog/built-in/tcp/overview' },
          items: [
            'connectors/catalog/built-in/tcp/action-reference',
            'connectors/catalog/built-in/tcp/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Trello',
          link: { type: 'doc', id: 'connectors/catalog/productivity-collaboration/trello/overview' },
          items: [
            'connectors/catalog/productivity-collaboration/trello/setup-guide',
            'connectors/catalog/productivity-collaboration/trello/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Twilio',
          link: { type: 'doc', id: 'connectors/catalog/communication/twilio/overview' },
          items: [
            'connectors/catalog/communication/twilio/setup-guide',
            'connectors/catalog/communication/twilio/action-reference',
            ...connectorVersionedDocs('connectors/catalog/communication/twilio'),
            'connectors/catalog/communication/twilio/example',
          ],
        },
        {
          type: 'category',
          label: 'Twitter',
          link: { type: 'doc', id: 'connectors/catalog/marketing-social/twitter/overview' },
          items: [
            'connectors/catalog/marketing-social/twitter/setup-guide',
            'connectors/catalog/marketing-social/twitter/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'Weaviate',
          link: { type: 'doc', id: 'connectors/catalog/ai-ml/ai.weaviate/overview' },
          items: [
            'connectors/catalog/ai-ml/ai.weaviate/setup-guide',
            'connectors/catalog/ai-ml/ai.weaviate/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'UDP',
          link: { type: 'doc', id: 'connectors/catalog/built-in/udp/overview' },
          items: [
            'connectors/catalog/built-in/udp/action-reference',
            'connectors/catalog/built-in/udp/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'WSO2 APIM Catalog',
          link: { type: 'doc', id: 'connectors/catalog/developer-tools/wso2.apim.catalog/overview' },
          items: [
            'connectors/catalog/developer-tools/wso2.apim.catalog/setup-guide',
            'connectors/catalog/developer-tools/wso2.apim.catalog/action-reference',
          ],
        },
        {
          type: 'category',
          label: 'WebSocket',
          link: { type: 'doc', id: 'connectors/catalog/built-in/websocket/overview' },
          items: [
            'connectors/catalog/built-in/websocket/action-reference',
            'connectors/catalog/built-in/websocket/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'WebSub',
          link: { type: 'doc', id: 'connectors/catalog/built-in/websub/overview' },
          items: [
            'connectors/catalog/built-in/websub/setup-guide',
            'connectors/catalog/built-in/websub/action-reference',
            'connectors/catalog/built-in/websub/trigger-reference',
          ],
        },
        {
          type: 'category',
          label: 'Zoom Meetings',
          link: { type: 'doc', id: 'connectors/catalog/communication/zoom.meetings/overview' },
          items: [
            'connectors/catalog/communication/zoom.meetings/setup-guide',
            'connectors/catalog/communication/zoom.meetings/action-reference',
            'connectors/catalog/communication/zoom.meetings/example',
          ],
        },
        {
          type: 'category',
          label: 'Zoom Scheduler',
          link: { type: 'doc', id: 'connectors/catalog/communication/zoom.scheduler/overview' },
          items: [
            'connectors/catalog/communication/zoom.scheduler/setup-guide',
            'connectors/catalog/communication/zoom.scheduler/action-reference',
            'connectors/catalog/communication/zoom.scheduler/example',
          ],
        },
      ],
    },
    // ── Build Your Own ──
    {
      type: 'category',
      label: 'Build Your Own',
      link: { type: 'doc', id: 'connectors/build-your-own/index' },
      items: [
        'connectors/build-your-own/create-from-openapi',
        'connectors/build-your-own/custom-development',
      ],
    }
      ],
    },

    // ─────────────────────────────────────────────
    // GENAI
    // "How do I build AI agents, RAG, or MCP?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'GenAI',
      collapsed: true,
      link: { type: 'doc', id: 'genai/overview' },
      items: [
        // Getting Started
        {
          type: 'category',
          label: 'Getting Started',
          items: [
            'genai/getting-started/setup',
            {
              type: 'category',
              label: 'Building Your First AI Integration',
              items: [
                'genai/getting-started/smart-calculator',
                'genai/getting-started/hotel-booking-agent',
              ],
            },
          ],
        },
        // Key Concepts
        {
          type: 'category',
          label: 'Key Concepts',
          items: [
            'genai/key-concepts/what-is-llm',
            'genai/key-concepts/what-is-natural-function',
            'genai/key-concepts/what-is-ai-agent',
            'genai/key-concepts/what-are-tools',
            'genai/key-concepts/what-is-agent-memory',
            'genai/key-concepts/what-is-mcp',
            'genai/key-concepts/what-is-rag',
          ],
        },
        // Develop AI Applications
        {
          type: 'category',
          label: 'Develop AI Applications',
          items: [
            // Direct LLM Calls
            {
              type: 'category',
              label: 'Direct LLM Calls',
              items: [
                'genai/develop/direct-llm/configuring-providers',
                'genai/develop/direct-llm/constructing-prompts',
                'genai/develop/direct-llm/handling-responses',
              ],
            },
            // Natural Functions
            {
              type: 'category',
              label: 'Natural Functions',
              items: [
                'genai/develop/natural-functions/defining',
                'genai/develop/natural-functions/constructing-prompts',
                'genai/develop/natural-functions/handling-responses',
              ],
            },
            // RAG
            {
              type: 'category',
              label: 'RAG',
              items: [
                {
                  type: 'category',
                  label: 'RAG Ingestion',
                  items: [
                    'genai/develop/rag/chunking-documents',
                    'genai/develop/rag/generating-embeddings',
                    'genai/develop/rag/connecting-vector-dbs',
                  ],
                },
                'genai/develop/rag/rag-querying',
              ],
            },
            // AI Agents
            {
              type: 'category',
              label: 'AI Agents',
              items: [
                'genai/develop/agents/creating-agent',
                'genai/develop/agents/adding-tools',
                'genai/develop/agents/adding-memory',
                'genai/develop/agents/advanced-config',
                'genai/develop/agents/agent-observability',
                'genai/develop/agents/agent-evaluations',
              ],
            },
            // MCP Integration
            {
              type: 'category',
              label: 'MCP Integration',
              items: [
                'genai/develop/mcp/creating-mcp-server',
                'genai/develop/mcp/agents-with-mcp',
              ],
            },
          ],
        },
        // Deep Dives — Agents
        {
          type: 'category',
          label: 'Agents',
          items: [
            'genai/agents/architecture-concepts',
            'genai/agents/chat-agents',
            'genai/agents/api-exposed-agents',
            'genai/agents/natural-functions',
            'genai/agents/tool-binding',
            'genai/agents/memory-configuration',
            'genai/agents/multi-agent-orchestration',
          ],
        },
        // Deep Dives — RAG
        {
          type: 'category',
          label: 'RAG',
          items: [
            'genai/rag/architecture-overview',
            'genai/rag/document-ingestion',
            'genai/rag/chunking-embedding',
            'genai/rag/vector-databases',
            'genai/rag/building-rag-service',
          ],
        },
        // Deep Dives — MCP
        {
          type: 'category',
          label: 'MCP',
          items: [
            'genai/mcp/overview',
            'genai/mcp/consuming-mcp-tools',
            'genai/mcp/exposing-mcp-servers',
            'genai/mcp/mcp-security',
          ],
        },
        // LLM Connectivity
        {
          type: 'category',
          label: 'LLM Connectivity',
          items: [
            'genai/llm-connectivity/model-selection',
            'genai/llm-connectivity/prompt-engineering',
            'genai/llm-connectivity/managing-context-windows',
            'genai/llm-connectivity/natural-expressions',
            'genai/llm-connectivity/streaming-responses',
          ],
        },
        // Guardrails
        {
          type: 'category',
          label: 'Guardrails',
          items: [
            'genai/guardrails/responsible-ai',
            'genai/guardrails/content-filtering',
            'genai/guardrails/input-output-guardrails',
            'genai/guardrails/token-cost-management',
            'genai/guardrails/ai-usage-guidelines',
          ],
        },
        // Agent Observability
        {
          type: 'category',
          label: 'Agent Observability',
          items: [
            'genai/agent-observability/agent-tracing',
            'genai/agent-observability/conversation-logging',
            'genai/agent-observability/performance-metrics',
            'genai/agent-observability/debugging-agent-behavior',
          ],
        },
        // Quick Starts
        {
          type: 'category',
          label: 'Quick Starts',
          items: [
            'genai/quick-starts/build-conversational-agent',
            'genai/quick-starts/build-rag-application',
            'genai/quick-starts/expose-mcp-server',
          ],
        },
        // Tutorials
        {
          type: 'category',
          label: 'Tutorials',
          items: [
            'genai/tutorials/hr-knowledge-base-rag',
            'genai/tutorials/customer-care-mcp',
            'genai/tutorials/it-helpdesk-chatbot',
            'genai/tutorials/legal-doc-qa',
            'genai/tutorials/ai-customer-support',
            'genai/tutorials/conversational-data-pipeline',
            'genai/tutorials/mcp-enterprise-data',
            'genai/tutorials/multi-agent-workflow',
            'genai/tutorials/rag-knowledge-base',
          ],
        },
        // Reference
        {
          type: 'category',
          label: 'Reference',
          items: [
            'genai/reference/copilot-guide',
            'genai/reference/ai-governance',
            'genai/reference/troubleshooting',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // TUTORIALS
    // "Show me a complete, real example"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: true,
      link: { type: 'doc', id: 'tutorials/overview' },
      items: [
        // Walkthroughs
        {
          type: 'category',
          label: 'Walkthroughs',
          items: [
            'tutorials/salesforce-db-sync',
            'tutorials/kafka-event-pipeline',
            'tutorials/rest-api-aggregation',
            'tutorials/walkthroughs/content-based-routing',
            'tutorials/walkthroughs/data-transformation-pipeline',
            'tutorials/file-batch-etl',
            'tutorials/walkthroughs/email-notification-service',
            'tutorials/walkthroughs/cdc-service',
            'tutorials/healthcare-hl7-fhir',
            'tutorials/walkthroughs/edi-ftp-processing',
            'tutorials/walkthroughs/csv-ftp-processing',
            'tutorials/walkthroughs/ftp-listener-with-age-filter-and-file-dependency',
            'tutorials/walkthroughs/local-file-watcher',
            'tutorials/walkthroughs/streaming-csv-sftp',
            'tutorials/data-reconciliation',
          ],
        },
        // Enterprise Integration Patterns (EIP)
        {
          type: 'category',
          label: 'Enterprise Integration Patterns',
          items: [
            'tutorials/patterns/content-based-router',
            'tutorials/patterns/message-filter',
            'tutorials/patterns/scatter-gather',
            'tutorials/patterns/recipient-list',
            'tutorials/patterns/message-translator',
            'tutorials/patterns/circuit-breaker',
            'tutorials/patterns/saga-compensation',
            'tutorials/patterns/publish-subscribe',
            'tutorials/patterns/guaranteed-delivery',
            'tutorials/patterns/idempotent-receiver',
            'tutorials/patterns/api-gateway-orchestration',
            'tutorials/patterns/agent-tool-orchestration',
            'tutorials/patterns/rag-pipeline',
          ],
        },
        // Pre-Built Integration Samples
        {
          type: 'category',
          label: 'Pre-Built Integration Samples',
          items: [
            'tutorials/pre-built/overview',
            'tutorials/pre-built/google-sheets-salesforce',
            'tutorials/pre-built/github-email-summary',
            'tutorials/pre-built/google-drive-onedrive',
            'tutorials/pre-built/mysql-salesforce-products',
            'tutorials/pre-built/gmail-salesforce-leads',
            'tutorials/pre-built/kafka-salesforce-pricebook',
            'tutorials/pre-built/salesforce-twilio-sms',
            'tutorials/pre-built/hubspot-google-contacts',
            'tutorials/pre-built/ftp-edi-salesforce',
            'tutorials/pre-built/shopify-outlook-email',
          ],
        },
        // Sample Projects
        {
          type: 'category',
          label: 'Sample Projects',
          items: [
            'tutorials/samples/overview',
            'tutorials/samples/hospital-service',
            'tutorials/samples/ecommerce-order-service',
            'tutorials/samples/event-driven-microservices',
            'tutorials/samples/data-service-persist',
            'tutorials/samples/restful-api-data-mapper',
            'tutorials/samples/ai-personal-assistant',
          ],
        },
        // Migration Guides
        {
          type: 'category',
          label: 'Migration Guides',
          items: [
            'tutorials/migration/from-wso2-mi',
            'tutorials/migration/from-mulesoft',
            'tutorials/migration/from-tibco',
            'tutorials/migration/from-boomi',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // DEPLOY & OPERATE
    // "How do I ship, run, and secure this?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Deploy & Operate',
      collapsed: true,
      link: { type: 'doc', id: 'deploy-operate/overview' },
      items: [
        // Deploy
        {
          type: 'category',
          label: 'Deploy',
          items: [
            'deploy-operate/deploy/local',
            'deploy-operate/deploy/vm-based',
            'deploy-operate/deploy/docker-kubernetes',
            'deploy-operate/deploy/openshift',
            'deploy-operate/deploy/serverless',
            'deploy-operate/deploy/devant',
            'deploy-operate/deploy/cloud-providers',
            'deploy-operate/deploy/graalvm',
            'deploy-operate/deploy/environments',
            'deploy-operate/deploy/managing-configurations',
            'deploy-operate/deploy/scaling-ha',
          ],
        },
        // CI/CD
        {
          type: 'category',
          label: 'CI/CD',
          items: [
            'deploy-operate/cicd/github-actions',
            'deploy-operate/cicd/jenkins',
            'deploy-operate/cicd/gitlab',
            'deploy-operate/cicd/azure-devops',
          ],
        },
        // Observe
        {
          type: 'category',
          label: 'Observe',
          items: [
            'deploy-operate/observe/overview',
            'deploy-operate/observe/logging',
            'deploy-operate/observe/metrics',
            'deploy-operate/observe/tracing',
            'deploy-operate/observe/icp',
            'deploy-operate/observe/devant',
            'deploy-operate/observe/prometheus',
            'deploy-operate/observe/grafana',
            'deploy-operate/observe/jaeger',
            'deploy-operate/observe/zipkin',
            'deploy-operate/observe/datadog',
            'deploy-operate/observe/new-relic',
            'deploy-operate/observe/elastic',
            'deploy-operate/observe/opensearch',
            'deploy-operate/observe/moesif',
            'deploy-operate/observe/custom-metrics',
            'deploy-operate/observe/third-party',
          ],
        },
        // Secure
        {
          type: 'category',
          label: 'Secure',
          items: [
            'deploy-operate/secure/runtime-security',
            'deploy-operate/secure/authentication',
            'deploy-operate/secure/api-security',
            'deploy-operate/secure/secrets-encryption',
            'deploy-operate/secure/ip-whitelisting',
            'deploy-operate/secure/compliance',
          ],
        },
        // Capacity Planning
        {
          type: 'category',
          label: 'Capacity Planning',
          items: [
            'deploy-operate/capacity-planning/overview',
            'deploy-operate/capacity-planning/performance-reports',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // REFERENCE
    // "What's the exact syntax / config / API for Z?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      link: { type: 'doc', id: 'reference/overview' },
      items: [
        // Language
        {
          type: 'category',
          label: 'Language',
          items: [
            'reference/language/syntax',
            'reference/language/type-system',
            'reference/language/stdlib',
            'reference/language/query-expressions',
            'reference/language/concurrency',
            'reference/language/error-handling',
            'reference/language/integration-features',
          ],
        },
        // Configuration
        {
          type: 'category',
          label: 'Configuration',
          items: [
            'reference/config/ballerina-toml',
            'reference/config/config-toml',
            'reference/config/cloud-toml',
            'reference/config/dependencies-toml',
            'reference/config/environment-variables',
          ],
        },
        // CLI
        {
          type: 'category',
          label: 'CLI',
          items: [
            'reference/cli/bal-commands',
            'reference/cli/bal-persist',
            'reference/cli/bal-openapi',
            'reference/cli/bal-graphql',
            'reference/cli/bal-grpc',
            'reference/cli/bal-edi',
            'reference/cli/bal-health',
            'reference/cli/update-tool',
            'reference/cli/scan-tool',
          ],
        },
        // APIs
        {
          type: 'category',
          label: 'APIs',
          items: [
            'reference/api/management-api',
            'reference/api/icp-api',
            'reference/api/ballerina-api-docs',
          ],
        },
        'reference/protocols',
        {
          type: 'category',
          label: 'Supported Data Formats',
          link: { type: 'doc', id: 'reference/data-formats/index' },
          items: [
            'reference/data-formats/avro',
            'reference/data-formats/csv',
            'reference/data-formats/edi',
            'reference/data-formats/fhir',
            'reference/data-formats/hl7',
            'reference/data-formats/json',
            'reference/data-formats/protocol-buffers',
            'reference/data-formats/toml',
            'reference/data-formats/xml',
            'reference/data-formats/yaml',
          ],
        },
        'reference/by-example',
        'reference/specifications',
        // Appendix
        {
          type: 'category',
          label: 'Appendix',
          items: [
            'reference/appendix/system-requirements',
            'reference/error-codes',
            'reference/glossary',
            'reference/faq',
            'reference/appendix/troubleshooting',
            'reference/release-notes',
          ],
        },
      ],
    },
  ],
};


export default sidebars;
