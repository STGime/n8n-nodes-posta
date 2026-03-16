import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { postaApiRequest } from '../../GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'getPlan') {
		responseData = await postaApiRequest.call(this, 'GET', '/users/plan');
	} else if (operation === 'getProfile') {
		responseData = await postaApiRequest.call(this, 'GET', '/users/profile');
	} else if (operation === 'updateProfile') {
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		responseData = await postaApiRequest.call(this, 'PATCH', '/users/profile', updateFields);
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	const items = Array.isArray(responseData) ? responseData : [responseData];
	return items.map((item) => ({ json: item }));
}
