import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HostingerApi implements ICredentialType {
	name = 'hostingerApi';
	displayName = 'Hostinger API';
	documentationUrl = 'https://developers.hostinger.com/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true
			},
			default: '',
			required: true,
			placeholder: 'Your API Token',
			description: 'Enter your Hostinger API token',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: this.documentationUrl,
			url: '/api/billing/v1/subscriptions',
			method: 'GET',
		},
	};
}
