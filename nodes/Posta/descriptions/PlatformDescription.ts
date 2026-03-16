import type { INodeProperties } from 'n8n-workflow';

export const platformOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['platform'],
			},
		},
		options: [
			{ name: 'Get Many', value: 'getAll', description: 'List all supported platforms', action: 'Get many platforms' },
			{ name: 'Get', value: 'get', description: 'Get a specific platform', action: 'Get a platform' },
			{ name: 'Get Specifications', value: 'getSpecifications', description: 'Get full platform specifications', action: 'Get platform specifications' },
			{ name: 'Get Aspect Ratios', value: 'getAspectRatios', description: 'Get aspect ratio reference', action: 'Get aspect ratios' },
		],
		default: 'getAll',
	},
];

export const platformFields: INodeProperties[] = [
	{
		displayName: 'Platform ID',
		name: 'platformId',
		type: 'options',
		options: [
			{ name: 'Instagram', value: 'instagram' },
			{ name: 'TikTok', value: 'tiktok' },
			{ name: 'Facebook', value: 'facebook' },
			{ name: 'X (Twitter)', value: 'twitter' },
			{ name: 'LinkedIn', value: 'linkedin' },
			{ name: 'YouTube', value: 'youtube' },
			{ name: 'Pinterest', value: 'pinterest' },
			{ name: 'Threads', value: 'threads' },
			{ name: 'Bluesky', value: 'bluesky' },
		],
		required: true,
		default: 'instagram',
		displayOptions: {
			show: {
				resource: ['platform'],
				operation: ['get'],
			},
		},
	},
];
