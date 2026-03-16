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

let cachedJwt: { token: string; expiresAt: number } | null = null;

async function getJwtToken(context: Context): Promise<string> {
	const credentials = await context.getCredentials('postaApi');
	const baseUrl = credentials.baseUrl as string;

	if (cachedJwt && cachedJwt.expiresAt > Date.now()) {
		return cachedJwt.token;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${baseUrl}/auth/login`,
		body: {
			email: credentials.email as string,
			password: credentials.password as string,
		},
		json: true,
	};

	const response = (await context.helpers.httpRequest(options)) as {
		access_token: string;
	};

	cachedJwt = {
		token: response.access_token,
		expiresAt: Date.now() + 55 * 60 * 1000, // 55 minutes
	};

	return cachedJwt.token;
}

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
	const authMethod = credentials.authMethod as string;

	let token: string;
	if (authMethod === 'emailPassword') {
		token = await getJwtToken(this);
	} else {
		token = credentials.apiToken as string;
	}

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
		// On 401 with email/password, clear cache and retry once
		if (
			authMethod === 'emailPassword' &&
			(error as JsonObject)?.httpCode === 401
		) {
			cachedJwt = null;
			token = await getJwtToken(this);
			requestOptions.headers = {
				...requestOptions.headers,
				Authorization: `Bearer ${token}`,
			};
			try {
				return (await this.helpers.httpRequest(requestOptions)) as IDataObject | IDataObject[];
			} catch (retryError) {
				throw new NodeApiError(this.getNode(), retryError as JsonObject, {
					message: 'Authentication failed after token refresh',
				});
			}
		}
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
