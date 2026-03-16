import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{ name: 'Get Plan', value: 'getPlan', description: 'Get current plan info and usage', action: 'Get user plan' },
			{ name: 'Get Profile', value: 'getProfile', description: 'Get user profile', action: 'Get user profile' },
			{ name: 'Update Profile', value: 'updateProfile', description: 'Update user profile', action: 'Update user profile' },
		],
		default: 'getPlan',
	},
];

export const userFields: INodeProperties[] = [
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['updateProfile'],
			},
		},
		options: [
			{
				displayName: 'Display Name',
				name: 'display_name',
				type: 'string',
				default: '',
			},
		],
	},
];
