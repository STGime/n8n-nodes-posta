import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodePropertyOptions,
	IDataObject,
} from 'n8n-workflow';

import { postaApiRequest } from './GenericFunctions';

import { postOperations, postFields } from './descriptions/PostDescription';
import { mediaOperations, mediaFields } from './descriptions/MediaDescription';
import {
	socialAccountOperations,
	socialAccountFields,
} from './descriptions/SocialAccountDescription';
import { analyticsOperations, analyticsFields } from './descriptions/AnalyticsDescription';
import { platformOperations, platformFields } from './descriptions/PlatformDescription';
import { userOperations, userFields } from './descriptions/UserDescription';
import { webhookOperations, webhookFields } from './descriptions/WebhookDescription';

import * as post from './actions/post';
import * as media from './actions/media';
import * as socialAccount from './actions/socialAccount';
import * as analytics from './actions/analytics';
import * as platform from './actions/platform';
import * as user from './actions/user';
import * as webhook from './actions/webhook';

export class Posta implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Posta',
		name: 'posta',
		icon: 'file:posta.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Manage social media posts, media, accounts, analytics, and webhooks via the Posta API',
		defaults: {
			name: 'Posta',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'postaApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Post', value: 'post' },
					{ name: 'Media', value: 'media' },
					{ name: 'Social Account', value: 'socialAccount' },
					{ name: 'Analytics', value: 'analytics' },
					{ name: 'Platform', value: 'platform' },
					{ name: 'User', value: 'user' },
					{ name: 'Webhook', value: 'webhook' },
				],
				default: 'post',
			},
			...postOperations,
			...postFields,
			...mediaOperations,
			...mediaFields,
			...socialAccountOperations,
			...socialAccountFields,
			...analyticsOperations,
			...analyticsFields,
			...platformOperations,
			...platformFields,
			...userOperations,
			...userFields,
			...webhookOperations,
			...webhookFields,
		],
	};

	methods = {
		loadOptions: {
			async getSocialAccounts(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const response = (await postaApiRequest.call(
					this,
					'GET',
					'/social-accounts',
				)) as IDataObject;
				const accounts = (response.accounts as IDataObject[]) || (response as unknown as IDataObject[]);
				return (Array.isArray(accounts) ? accounts : []).map((account) => ({
					name: `${account.platform} — ${account.username || account.displayName}`,
					value: account.id as string,
				}));
			},

			async getPinterestBoards(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				// Try to get account ID from current parameter context
				const accountId = this.getCurrentNodeParameter('accountId') as string;
				if (!accountId) return [];

				const boards = (await postaApiRequest.call(
					this,
					'GET',
					`/social-accounts/${accountId}/boards`,
				)) as IDataObject[];

				return (Array.isArray(boards) ? boards : []).map((board) => ({
					name: board.name as string,
					value: board.id as string,
				}));
			},

			async getTikTokCreatorInfo(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const accountId = this.getCurrentNodeParameter('accountId') as string;
				if (!accountId) return [];

				const info = (await postaApiRequest.call(
					this,
					'GET',
					`/social-accounts/${accountId}/tiktok/creator-info`,
				)) as IDataObject;

				const options = (info.privacyLevelOptions as string[]) || [];
				return options.map((level) => ({
					name: level.replace(/_/g, ' ').toLowerCase(),
					value: level,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				switch (resource) {
					case 'post':
						result = await post.execute.call(this, operation, i);
						break;
					case 'media':
						result = await media.execute.call(this, operation, i);
						break;
					case 'socialAccount':
						result = await socialAccount.execute.call(this, operation, i);
						break;
					case 'analytics':
						result = await analytics.execute.call(this, operation, i);
						break;
					case 'platform':
						result = await platform.execute.call(this, operation, i);
						break;
					case 'user':
						result = await user.execute.call(this, operation, i);
						break;
					case 'webhook':
						result = await webhook.execute.call(this, operation, i);
						break;
					default:
						throw new Error(`Unknown resource: ${resource}`);
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
