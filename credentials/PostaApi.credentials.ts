import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PostaApi implements ICredentialType {
	name = 'postaApi';
	displayName = 'Posta API';
	documentationUrl = 'https://api.getposta.app/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			placeholder: 'posta_xxx...',
			description:
				'Generate an API token from your Posta dashboard under Settings → API Tokens',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.getposta.app/v1',
			description: 'The base URL for the Posta API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/auth/me',
		},
	};
}
