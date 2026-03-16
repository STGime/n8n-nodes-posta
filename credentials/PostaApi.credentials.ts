import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PostaApi implements ICredentialType {
	name = 'postaApi';
	displayName = 'Posta API';
	documentationUrl = 'https://getposta.app/docs/api';

	properties: INodeProperties[] = [
		{
			displayName: 'Authentication Method',
			name: 'authMethod',
			type: 'options',
			options: [
				{
					name: 'API Token (Recommended)',
					value: 'apiToken',
				},
				{
					name: 'Email / Password',
					value: 'emailPassword',
				},
			],
			default: 'apiToken',
		},
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			placeholder: 'posta_xxx...',
			description: 'Generate an API token from your Posta dashboard under Settings → API',
			displayOptions: {
				show: {
					authMethod: ['apiToken'],
				},
			},
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			placeholder: 'name@email.com',
			default: '',
			displayOptions: {
				show: {
					authMethod: ['emailPassword'],
				},
			},
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			displayOptions: {
				show: {
					authMethod: ['emailPassword'],
				},
			},
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
