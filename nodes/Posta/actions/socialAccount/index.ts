import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { postaApiRequest } from '../../GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'getAll') {
		const response = (await postaApiRequest.call(
			this,
			'GET',
			'/social-accounts',
		)) as IDataObject;
		responseData = (response.accounts as IDataObject[]) || (response as unknown as IDataObject[]);
	} else if (operation === 'getPinterestBoards') {
		const accountId = this.getNodeParameter('accountId', i) as string;
		responseData = await postaApiRequest.call(
			this,
			'GET',
			`/social-accounts/${accountId}/boards`,
		);
	} else if (operation === 'getTikTokCreatorInfo') {
		const accountId = this.getNodeParameter('accountId', i) as string;
		responseData = await postaApiRequest.call(
			this,
			'GET',
			`/social-accounts/${accountId}/tiktok/creator-info`,
		);
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	const items = Array.isArray(responseData) ? responseData : [responseData];
	return items.map((item) => ({ json: item }));
}
