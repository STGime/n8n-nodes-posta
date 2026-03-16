import type { INodeProperties } from 'n8n-workflow';

export const socialAccountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['socialAccount'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'List all connected social accounts',
				action: 'Get many social accounts',
			},
			{
				name: 'Get Pinterest Boards',
				value: 'getPinterestBoards',
				description: 'Get Pinterest boards for an account',
				action: 'Get Pinterest boards',
			},
			{
				name: 'Get TikTok Creator Info',
				value: 'getTikTokCreatorInfo',
				description: 'Get TikTok creator info for an account',
				action: 'Get TikTok creator info',
			},
		],
		default: 'getAll',
	},
];

export const socialAccountFields: INodeProperties[] = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getSocialAccounts',
		},
		required: true,
		default: '',
		description: 'The social account to query',
		displayOptions: {
			show: {
				resource: ['socialAccount'],
				operation: ['getPinterestBoards', 'getTikTokCreatorInfo'],
			},
		},
	},
];
