import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { postaApiRequest, postaApiRequestAllItems } from '../../GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];
	const qs: IDataObject = {};

	if (operation === 'overview') {
		qs.period = this.getNodeParameter('period', i) as string;
		const accountIds = this.getNodeParameter('socialAccountIds', i, '') as string;
		if (accountIds) qs.socialAccountIds = accountIds;
		responseData = await postaApiRequest.call(this, 'GET', '/analytics/overview', {}, qs);
	} else if (operation === 'posts') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		qs.sortBy = this.getNodeParameter('sortBy', i) as string;
		qs.sortOrder = this.getNodeParameter('sortOrder', i) as string;
		const accountIds = this.getNodeParameter('socialAccountIds', i, '') as string;
		if (accountIds) qs.socialAccountIds = accountIds;

		if (returnAll) {
			responseData = await postaApiRequestAllItems.call(
				this,
				'GET',
				'/analytics/posts',
				{},
				qs,
			);
		} else {
			qs.limit = this.getNodeParameter('limit', i) as number;
			const response = (await postaApiRequest.call(
				this,
				'GET',
				'/analytics/posts',
				{},
				qs,
			)) as IDataObject;
			responseData = (response.items as IDataObject[]) || [];
		}
	} else if (operation === 'postDetail') {
		const postId = this.getNodeParameter('postId', i) as string;
		responseData = await postaApiRequest.call(this, 'GET', `/analytics/posts/${postId}`);
	} else if (operation === 'trends') {
		qs.period = this.getNodeParameter('period', i) as string;
		qs.metric = this.getNodeParameter('metric', i) as string;
		const accountIds = this.getNodeParameter('socialAccountIds', i, '') as string;
		if (accountIds) qs.socialAccountIds = accountIds;
		responseData = await postaApiRequest.call(this, 'GET', '/analytics/trends', {}, qs);
	} else if (operation === 'bestTimes') {
		responseData = await postaApiRequest.call(this, 'GET', '/analytics/best-times');
	} else if (operation === 'contentTypes') {
		responseData = await postaApiRequest.call(this, 'GET', '/analytics/content-types');
	} else if (operation === 'hashtags') {
		responseData = await postaApiRequest.call(this, 'GET', '/analytics/hashtags');
	} else if (operation === 'compare') {
		const postIds = this.getNodeParameter('postIds', i) as string;
		responseData = await postaApiRequest.call(
			this,
			'GET',
			'/analytics/compare',
			{},
			{ postIds },
		);
	} else if (operation === 'benchmarks') {
		responseData = await postaApiRequest.call(this, 'GET', '/analytics/benchmarks');
	} else if (operation === 'capabilities') {
		responseData = await postaApiRequest.call(this, 'GET', '/analytics/capabilities');
	} else if (operation === 'refreshPost') {
		const postResultId = this.getNodeParameter('postResultId', i) as string;
		responseData = await postaApiRequest.call(
			this,
			'POST',
			`/analytics/refresh/${postResultId}`,
		);
	} else if (operation === 'refreshAll') {
		responseData = await postaApiRequest.call(this, 'POST', '/analytics/refresh-all');
	} else if (operation === 'exportCsv') {
		qs.period = this.getNodeParameter('period', i) as string;
		responseData = await postaApiRequest.call(
			this,
			'GET',
			'/analytics/export/csv',
			{},
			qs,
		);
	} else if (operation === 'exportPdf') {
		qs.period = this.getNodeParameter('period', i) as string;
		responseData = await postaApiRequest.call(
			this,
			'GET',
			'/analytics/export/pdf',
			{},
			qs,
		);
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	const items = Array.isArray(responseData) ? responseData : [responseData];
	return items.map((item) => ({ json: item }));
}
