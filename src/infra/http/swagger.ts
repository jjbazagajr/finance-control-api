export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Finance Control API',
    version: '1.0.0',
    description: 'Personal Finance Control System API - DDD + Clean Architecture',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Account: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          type: { type: 'string', enum: ['CASH', 'BANK', 'CREDIT'] },
          currency: { type: 'string' },
          initialBalance: { type: 'number' },
          currentBalance: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          accountId: { type: 'string', format: 'uuid' },
          categoryId: { type: 'string', format: 'uuid' },
          type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
          amount: { type: 'number' },
          description: { type: 'string' },
          date: { type: 'string', format: 'date-time' },
          transferId: { type: 'string', format: 'uuid', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Transfer: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          fromAccountId: { type: 'string', format: 'uuid' },
          toAccountId: { type: 'string', format: 'uuid' },
          amount: { type: 'number' },
          description: { type: 'string' },
          date: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Budget: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          categoryId: { type: 'string', format: 'uuid' },
          amount: { type: 'number' },
          month: { type: 'integer', minimum: 1, maximum: 12 },
          year: { type: 'integer' },
          spent: { type: 'number' },
          remaining: { type: 'number' },
          percentage: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      MonthlySummary: {
        type: 'object',
        properties: {
          year: { type: 'integer' },
          month: { type: 'integer' },
          totalIncome: { type: 'number' },
          totalExpense: { type: 'number' },
          balance: { type: 'number' },
          topExpenseCategories: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                categoryId: { type: 'string', format: 'uuid' },
                categoryName: { type: 'string' },
                total: { type: 'number' },
              },
            },
          },
          dailyTotals: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: { type: 'string', format: 'date' },
                income: { type: 'number' },
                expense: { type: 'number' },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    token: { type: 'string' },
                  },
                },
              },
            },
          },
          '409': { description: 'Email already exists' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    token: { type: 'string' },
                  },
                },
              },
            },
          },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'User profile',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/accounts': {
      get: {
        tags: ['Accounts'],
        summary: 'List all accounts',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of accounts',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Account' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Accounts'],
        summary: 'Create a new account',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'type', 'initialBalance'],
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string', enum: ['CASH', 'BANK', 'CREDIT'] },
                  currency: { type: 'string', default: 'BRL' },
                  initialBalance: { type: 'number', minimum: 0 },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Account created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Account' },
              },
            },
          },
        },
      },
    },
    '/accounts/{id}': {
      put: {
        tags: ['Accounts'],
        summary: 'Update an account',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string', enum: ['CASH', 'BANK', 'CREDIT'] },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Account updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Account' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Accounts'],
        summary: 'Delete an account',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '204': { description: 'Account deleted' },
        },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'List all categories',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'type',
            in: 'query',
            schema: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
          },
        ],
        responses: {
          '200': {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Category' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Categories'],
        summary: 'Create a new category',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'type'],
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Category created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Category' },
              },
            },
          },
        },
      },
    },
    '/categories/{id}': {
      put: {
        tags: ['Categories'],
        summary: 'Update a category',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Category updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Category' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Delete a category',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '204': { description: 'Category deleted' },
        },
      },
    },
    '/transactions': {
      get: {
        tags: ['Transactions'],
        summary: 'List transactions with filters',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'accountId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'categoryId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['INCOME', 'EXPENSE'] } },
        ],
        responses: {
          '200': {
            description: 'List of transactions',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Transaction' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Transactions'],
        summary: 'Create a new transaction',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['accountId', 'categoryId', 'type', 'amount', 'date'],
                properties: {
                  accountId: { type: 'string', format: 'uuid' },
                  categoryId: { type: 'string', format: 'uuid' },
                  type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                  amount: { type: 'number', minimum: 0.01 },
                  description: { type: 'string' },
                  date: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Transaction created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Transaction' },
              },
            },
          },
        },
      },
    },
    '/transactions/{id}': {
      put: {
        tags: ['Transactions'],
        summary: 'Update a transaction',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  accountId: { type: 'string', format: 'uuid' },
                  categoryId: { type: 'string', format: 'uuid' },
                  type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                  amount: { type: 'number', minimum: 0.01 },
                  description: { type: 'string' },
                  date: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Transaction updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Transaction' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Transactions'],
        summary: 'Delete a transaction',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '204': { description: 'Transaction deleted' },
        },
      },
    },
    '/transfers': {
      post: {
        tags: ['Transfers'],
        summary: 'Create a transfer between accounts',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fromAccountId', 'toAccountId', 'amount', 'date'],
                properties: {
                  fromAccountId: { type: 'string', format: 'uuid' },
                  toAccountId: { type: 'string', format: 'uuid' },
                  amount: { type: 'number', minimum: 0.01 },
                  description: { type: 'string' },
                  date: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Transfer created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Transfer' },
              },
            },
          },
        },
      },
    },
    '/budgets': {
      get: {
        tags: ['Budgets'],
        summary: 'List budgets with status',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'month', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 12 } },
          { name: 'year', in: 'query', schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'List of budgets with status',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Budget' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Budgets'],
        summary: 'Create a new budget',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['categoryId', 'amount', 'month', 'year'],
                properties: {
                  categoryId: { type: 'string', format: 'uuid' },
                  amount: { type: 'number', minimum: 0.01 },
                  month: { type: 'integer', minimum: 1, maximum: 12 },
                  year: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Budget created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Budget' },
              },
            },
          },
        },
      },
    },
    '/budgets/{id}': {
      put: {
        tags: ['Budgets'],
        summary: 'Update a budget',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  amount: { type: 'number', minimum: 0.01 },
                  month: { type: 'integer', minimum: 1, maximum: 12 },
                  year: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Budget updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Budget' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Budgets'],
        summary: 'Delete a budget',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '204': { description: 'Budget deleted' },
        },
      },
    },
    '/summary/monthly': {
      get: {
        tags: ['Summary'],
        summary: 'Get monthly summary',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'year',
            in: 'query',
            required: true,
            schema: { type: 'integer' },
          },
          {
            name: 'month',
            in: 'query',
            required: true,
            schema: { type: 'integer', minimum: 1, maximum: 12 },
          },
        ],
        responses: {
          '200': {
            description: 'Monthly summary',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MonthlySummary' },
              },
            },
          },
        },
      },
    },
  },
};
