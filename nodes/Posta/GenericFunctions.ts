import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

type Context = IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions;

export async function postaApiRequest(
	this: Context,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	options: Partial<IHttpRequestOptions> = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('postaApi');
	const baseUrl = credentials.baseUrl as string;
	const token = credentials.apiToken as string;

	const requestOptions: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		qs,
		json: true,
		...options,
	};

	if (Object.keys(body).length > 0) {
		requestOptions.body = body;
	}

	try {
		return (await this.helpers.httpRequest(requestOptions)) as IDataObject | IDataObject[];
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function postaApiRequestAllItems(
	this: Context,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject[]> {
	const allItems: IDataObject[] = [];
	qs.limit = 100;
	qs.offset = 0;

	let hasMore = true;
	while (hasMore) {
		const response = (await postaApiRequest.call(this, method, endpoint, body, qs)) as IDataObject;
		const items = (response.items as IDataObject[]) || [];
		allItems.push(...items);

		const total = response.total as number;
		qs.offset = (qs.offset as number) + items.length;
		hasMore = allItems.length < total;
	}

	return allItems;
}
