import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { postaApiRequest } from '../../GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'getAll') {
		responseData = await postaApiRequest.call(this, 'GET', '/platforms');
	} else if (operation === 'get') {
		const platformId = this.getNodeParameter('platformId', i) as string;
		responseData = await postaApiRequest.call(this, 'GET', `/platforms/${platformId}`);
	} else if (operation === 'getSpecifications') {
		responseData = await postaApiRequest.call(this, 'GET', '/platforms/specifications');
	} else if (operation === 'getAspectRatios') {
		responseData = await postaApiRequest.call(this, 'GET', '/platforms/aspect-ratios');
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	const items = Array.isArray(responseData) ? responseData : [responseData];
	return items.map((item) => ({ json: item }));
}
