import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { postaApiRequest } from '../../GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'create') {
		const url = this.getNodeParameter('url', i) as string;
		const events = this.getNodeParameter('events', i) as string[];
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

		const body: IDataObject = { url, events };
		if (additionalFields.description) body.description = additionalFields.description;

		responseData = await postaApiRequest.call(this, 'POST', '/webhooks', body);
	} else if (operation === 'getAll') {
		responseData = await postaApiRequest.call(this, 'GET', '/webhooks');
	} else if (operation === 'get') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;
		responseData = await postaApiRequest.call(this, 'GET', `/webhooks/${webhookId}`);
	} else if (operation === 'update') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		responseData = await postaApiRequest.call(
			this,
			'PATCH',
			`/webhooks/${webhookId}`,
			updateFields,
		);
	} else if (operation === 'delete') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;
		await postaApiRequest.call(this, 'DELETE', `/webhooks/${webhookId}`);
		responseData = { success: true };
	} else if (operation === 'test') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;
		responseData = await postaApiRequest.call(this, 'POST', `/webhooks/${webhookId}/test`);
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	const items = Array.isArray(responseData) ? responseData : [responseData];
	return items.map((item) => ({ json: item }));
}
