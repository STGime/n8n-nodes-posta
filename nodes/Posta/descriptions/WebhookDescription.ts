import type { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: [
			{ name: 'Create', value: 'create', description: 'Create a webhook endpoint', action: 'Create a webhook endpoint' },
			{ name: 'Get Many', value: 'getAll', description: 'List all webhook endpoints', action: 'Get many webhook endpoints' },
			{ name: 'Get', value: 'get', description: 'Get a webhook endpoint', action: 'Get a webhook endpoint' },
			{ name: 'Update', value: 'update', description: 'Update a webhook endpoint', action: 'Update a webhook endpoint' },
			{ name: 'Delete', value: 'delete', description: 'Delete a webhook endpoint', action: 'Delete a webhook endpoint' },
			{ name: 'Test', value: 'test', description: 'Send a test event to a webhook', action: 'Test a webhook endpoint' },
		],
		default: 'create',
	},
];

export const webhookFields: INodeProperties[] = [
	// Create
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://your-n8n.example.com/webhook/xxx',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		required: true,
		options: [
			{ name: 'Post Scheduled', value: 'post.scheduled' },
			{ name: 'Post Processing', value: 'post.processing' },
			{ name: 'Post Published', value: 'post.published' },
			{ name: 'Post Partially Published', value: 'post.partially_published' },
			{ name: 'Post Failed', value: 'post.failed' },
			{ name: 'Post Result Success', value: 'post.result.success' },
			{ name: 'Post Result Failed', value: 'post.result.failed' },
		],
		default: [],
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
		],
	},

	// Get / Update / Delete / Test
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get', 'update', 'delete', 'test'],
			},
		},
	},

	// Update
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{ name: 'Post Scheduled', value: 'post.scheduled' },
					{ name: 'Post Processing', value: 'post.processing' },
					{ name: 'Post Published', value: 'post.published' },
					{ name: 'Post Partially Published', value: 'post.partially_published' },
					{ name: 'Post Failed', value: 'post.failed' },
					{ name: 'Post Result Success', value: 'post.result.success' },
					{ name: 'Post Result Failed', value: 'post.result.failed' },
				],
				default: [],
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Is Active',
				name: 'is_active',
				type: 'boolean',
				default: true,
			},
		],
	},
];
