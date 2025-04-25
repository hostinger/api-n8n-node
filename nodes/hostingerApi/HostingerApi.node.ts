import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class HostingerApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Hostinger API',
		name: 'hostingerApi',
		icon: 'file:hostingerLogo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["action"]}}',
		description: 'Interact with the Hostinger API',
		defaults: {
			name: 'Hostinger API',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'hostingerApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Category',
				name: 'category',
				type: 'options',
				options: [
					{ name: 'VPS', value: 'vps' },
					{ name: 'DNS', value: 'dns' },
					{ name: 'Domains', value: 'domains' },
				],
				default: 'vps',
			},
			{
				displayName: 'Subcategory',
				name: 'subcategory',
				type: 'options',
				options: [
					{ name: 'Actions', value: 'actions' },
					{ name: 'Backups', value: 'backups' },
					{ name: 'Data Centers', value: 'dataCenters' },
					{ name: 'FireWall', value: 'firewall' },
					{ name: 'Malware Scanner', value: 'malware' },
					{ name: 'OS Templates', value: 'osTemplates' },
					{ name: 'Post-install Scripts', value: 'installScripts' },
					{ name: 'PTR Records', value: 'ptrRecords' },
					{ name: 'Public Keys', value: 'publicKeys' },
					{ name: 'Recovery', value: 'recovery' },
					{ name: 'Snapshots', value: 'snapshots' },
					{ name: 'Virtual Machine', value: 'virtualMachine' },
				],
				default: 'virtualMachine',
				displayOptions: {
					show: {
						category: [
							'vps'
						]
					}
				}
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'Get Action', value: 'getAction' },
					{ name: 'List Actions', value: 'listActions' },
				],
				default: 'getAction',
				displayOptions: {
					show: {
						subcategory: ['actions'],
					},
				},
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'Delete Backup', value: 'deleteBackup' },
					{ name: 'List Backups', value: 'listBackups' },
					{ name: 'Restore Backup', value: 'restoreBackup' },
				],
				default: 'listBackups',
				displayOptions: {
					show: {
						subcategory: ['backups'],
					},
				},
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'List Data Centers', value: 'listDataCenters' },
				],
				default: 'listDataCenters',
				displayOptions: {
					show: {
						subcategory: ['dataCenters'],
					},
				},
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'Create PTR', value: 'createPTR' },
					{ name: 'Delete PTR', value: 'deletePTR' }
				],
				default: 'createPTR',
				displayOptions: {
					show: {
						subcategory: ['ptrRecords'],
					},
				},
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'Activate Firewall', value: 'activateFirewall' },
					{ name: 'Deactivate Firewall', value: 'deactivateFirewall' },
					{ name: 'Get Firewall', value: 'getFirewall' },
					{ name: 'Delete Firewall', value: 'deleteFirewall' },
					{ name: 'List Firewalls', value: 'listFirewalls' },
					{ name: 'Create Firewall', value: 'createFirewall' },
					{ name: 'Update Firewall Rule', value: 'updateFirewallRule' },
					{ name: 'Delete Firewall Rule', value: 'deleteFirewallRule' },
					{ name: 'Create Firewall Rule', value: 'createFirewallRule' },
					{ name: 'Sync Firewall', value: 'syncFirewall' },
				],
				default: 'activateFirewall',
				displayOptions: {
					show: {
						subcategory: ['firewall'],
					},
				},
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'Get Monarx', value: 'getMonarx' },
					{ name: 'Add Monarx', value: 'addMonarx' },
					{ name: 'Remove Monarx', value: 'removeMonarx' },
				],
				default: 'getMonarx',
				displayOptions: {
					show: {
						subcategory: ['malware'],
					},
				},
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'Get Template', value: 'getTemplate' },
					{ name: 'List Templates', value: 'listTemplates' },
				],
				default: 'getTemplate',
				displayOptions: {
					show: {
						subcategory: ['osTemplates'],
					},
				},
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'Get Post Install Script', value: 'getPostInstallScript' },
					{ name: 'Update Post Install Script', value: 'updatePostInstallScript' },
					{ name: 'Delete Post Install Script', value: 'deletePostInstallScript' },
					{ name: 'List Post Install Scripts', value: 'listPostInstallScripts' },
					{ name: 'Create Post Install Script', value: 'createPostInstallScript' },
				],
				default: 'getPostInstallScript',
				displayOptions: {
					show: {
						subcategory: ['installScripts'],
					},
				},
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'Attach Public Key', value: 'attachPublicKey' },
					{ name: 'Delete Public Key', value: 'deletePublicKey' },
					{ name: 'List Public Keys', value: 'listPublicKeys' },
					{ name: 'Create Public Key', value: 'createPublicKey' },
				],
				default: 'attachPublicKey',
				displayOptions: {
					show: {
						subcategory: ['publicKeys'],
					},
				},
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'Create Recovery', value: 'createRecovery' },
					{ name: 'Delete Recovery', value: 'deleteRecovery' },
				],
				default: 'createRecovery',
				displayOptions: {
					show: {
						subcategory: ['recovery'],
					},
				},
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'Get Snapshot', value: 'getSnapshot' },
					{ name: 'Create Snapshot', value: 'createSnapshot' },
					{ name: 'Delete Snapshot', value: 'deleteSnapshot' },
					{ name: 'Restore Snapshot', value: 'restoreSnapshot' },
				],
				default: 'getSnapshot',
				displayOptions: {
					show: {
						subcategory: ['snapshots'],
					},
				},
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'Get VM Public Keys', value: 'getVmPublicKeys' },
					{ name: 'Update Hostname', value: 'updateHostname' },
					{ name: 'Delete Hostname', value: 'deleteHostname' },
					{ name: 'Get VM', value: 'getVm' },
					{ name: 'List VMs', value: 'listVms' },
					{ name: 'Get VM Metrics', value: 'getVmMetrics' },
					{ name: 'Update Nameservers', value: 'updateNameservers' },
					{ name: 'Update Panel Password', value: 'updatePanelPassword' },
					{ name: 'Recreate VM', value: 'recreateVm' },
					{ name: 'Restart VM', value: 'restartVm' },
					{ name: 'Update Root Password', value: 'updateRootPassword' },
					{ name: 'Setup VM', value: 'setupVm' },
					{ name: 'Start VM', value: 'startVm' },
					{ name: 'Stop VM', value: 'stopVm' },
				],
				default: 'getVm',
				displayOptions: {
					show: {
						subcategory: ['virtualMachine'],
					},
				},
			},
			{
				displayName: 'DNS Action',
				name: 'dnsAction',
				type: 'options',
				options: [
					{ name: 'Get DNS Snapshot', value: 'getDnsSnapshot' },
					{ name: 'List DNS Snapshots', value: 'listDnsSnapshots' },
					{ name: 'Restore DNS Snapshot', value: 'restoreDnsSnapshot' },
					{ name: 'Get DNS Zone', value: 'getDnsZone' },
					{ name: 'Update DNS Zone', value: 'updateDnsZone' },
					{ name: 'Delete DNS Zone', value: 'deleteDnsZone' },
					{ name: 'Reset DNS Zone', value: 'resetDnsZone' },
					{ name: 'Validate DNS Zone', value: 'validateDnsZone' },
				],
				default: 'listDnsSnapshots',
				displayOptions: {
					show: {
						category: ['dns'],
					},
				},
			},
			{
				displayName: 'Domains Action',
				name: 'domainsAction',
				type: 'options',
				options: [
					{ name: 'Check Domain Availability', value: 'checkDomainAvailability' },
				],
				default: 'checkDomainAvailability',
				displayOptions: {
					show: {
						category: ['domains'],
					},
				},
			},
			{
				displayName: 'Virtual Machine ID',
				name: 'virtualMachineId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						vpsAction: [
							'getAction', 'listActions', 'deleteBackup', 'listBackups', 'restoreBackup', 'createPTR', 'deletePTR', 'activateFirewall', 'deactivateFirewall', 'syncFirewall', 'getMonarx', 'addMonarx', 'removeMonarx', 'attachPublicKey', 'createRecovery', 'deleteRecovery', 'getSnapshot', 'createSnapshot', 'deleteSnapshot', 'restoreSnapshot', 'getVmPublicKeys', 'updateHostname', 'deleteHostname', 'getVm', 'getVmMetrics', 'updateNameservers', 'updatePanelPassword', 'recreateVm', 'restartVm', 'updateRootPassword', 'setupVm', 'startVm', 'stopVm'
						]
					}
				}
			},
			{
				displayName: 'Date from',
				name: 'date_from',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						vpsAction: [
							'getVmMetrics'
						]
					}
				}
			},
			{
				displayName: 'Date to',
				name: 'date_to',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						vpsAction: [
							'getVmMetrics'
						]
					}
				}
			},
			{
				displayName: 'Action ID',
				name: 'actionId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						vpsAction: ['getAction']
					}
				}
			},
			{
				displayName: 'Backup ID',
				name: 'backupId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						vpsAction: ['deleteBackup', 'restoreBackup']
					}
				}
			},
			{
				displayName: 'Firewall ID',
				name: 'firewallId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						vpsAction: [
							'activateFirewall', 'deactivateFirewall', 'getFirewall', 'deleteFirewall', 'updateFirewallRule', 'deleteFirewallRule', 'createFirewallRule', 'syncFirewall'
						]
					}
				}
			},
			{
				displayName: 'Snapshot ID',
				name: 'snapshotId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						vpsAction: [
							'getDnsSnapshot', 'restoreDnsSnapshot'
						]
					}
				}
			},
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						category: ['dns']
					}
				}
			},
			{
				displayName: 'Rule ID',
				name: 'ruleId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						vpsAction: ['updateFirewallRule', 'deleteFirewallRule']
					}
				}
			},
			{
				displayName: 'Post Install Script ID',
				name: 'postInstallScriptId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						vpsAction: ['getPostInstallScript', 'updatePostInstallScript', 'deletePostInstallScript']
					}
				}
			},
			{
				displayName: 'Public Key ID',
				name: 'publicKeyId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						vpsAction: ['deletePublicKey']
					}
				}
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						vpsAction: ['getTemplate']
					}
				}
			},
			{
				displayName: 'Request Body',
				name: 'requestBody',
				type: 'json',
				default: '{}',
				description: 'Raw JSON body for POST/PUT requests.',
				displayOptions: {
					show: {
						vpsAction: [
							'createFirewall', 'updateFirewallRule', 'createFirewallRule', 'updatePostInstallScript', 'createPostInstallScript', 'attachPublicKey', 'createPublicKey', 'createRecovery', 'updateHostname', 'updateNameservers', 'updatePanelPassword', 'recreateVm', 'updateRootPassword', 'setupVm'
						]
					}
				}
			},
			{
				displayName: 'Request Body',
				name: 'requestBody',
				type: 'json',
				default: '{}',
				description: 'Raw JSON body for POST/PUT requests.',
				displayOptions: {
					show: {
						category: ['domains', 'dns']
					}
				}
			}
		]
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {

			const category = this.getNodeParameter('category', i) as string;
			let action: string;

			switch (category) {
				case 'vps':
					action = this.getNodeParameter('vpsAction', i) as string;
					break;
				case 'dns':
					action = this.getNodeParameter('dnsAction', i) as string;
					break;
				case 'domains':
					action = this.getNodeParameter('domainsAction', i) as string;
					break;
				default:
					throw new Error(`Unknown category: ${category}`);
			}

			const getParam = (name: string) => this.getNodeParameter(name, i) as string;
			let method: IHttpRequestMethods = 'GET';
			let endpoint = '';
			let requestBody: IDataObject | undefined;

			try {
				requestBody = JSON.parse(this.getNodeParameter('requestBody', i) as string);
			} catch (e) {}

			switch (action) {
				//VPS Actions
				case 'getAction': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/actions/${getParam('actionId')}`; break;
				case 'listActions': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/actions`; break;
				//VPS Backups
				case 'deleteBackup': method = 'DELETE'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/backups/${getParam('backupId')}`; break;
				case 'listBackups': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/backups`; break;
				case 'restoreBackup': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/backups/${getParam('backupId')}/restore`; break;
				//VPS Data Centers
				case 'listDataCenters': endpoint = '/api/vps/v1/data-centers'; break;
				//VPS PTR
				case 'createPTR': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/ptr`; break;
				case 'deletePTR': method = 'DELETE'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/ptr`; break;
				//VPS Firewall
				case 'activateFirewall': method = 'POST'; endpoint = `/api/vps/v1/firewall/${getParam('firewallId')}/activate/${getParam('virtualMachineId')}`; break;
				case 'deactivateFirewall': method = 'POST'; endpoint = `/api/vps/v1/firewall/${getParam('firewallId')}/deactivate/${getParam('virtualMachineId')}`; break;
				case 'getFirewall': endpoint = `/api/vps/v1/firewall/${getParam('firewallId')}`; break;
				case 'deleteFirewall': method = 'DELETE'; endpoint = `/api/vps/v1/firewall/${getParam('firewallId')}`; break;
				case 'listFirewalls': endpoint = '/api/vps/v1/firewall'; break;
				case 'createFirewall': method = 'POST'; endpoint = '/api/vps/v1/firewall'; break;
				case 'updateFirewallRule': method = 'PUT'; endpoint = `/api/vps/v1/firewall/${getParam('firewallId')}/rules/${getParam('ruleId')}`; break;
				case 'deleteFirewallRule': method = 'DELETE'; endpoint = `/api/vps/v1/firewall/${getParam('firewallId')}/rules/${getParam('ruleId')}`; break;
				case 'createFirewallRule': method = 'POST'; endpoint = `/api/vps/v1/firewall/${getParam('firewallId')}/rules`; break;
				case 'syncFirewall': method = 'POST'; endpoint = `/api/vps/v1/firewall/${getParam('firewallId')}/sync/${getParam('virtualMachineId')}`; break;
				//VPS Malware
				case 'getMonarx': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/monarx`; break;
				case 'addMonarx': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/monarx`; break;
				case 'removeMonarx': method = 'DELETE'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/monarx`; break;
				//VPS Templates
				case 'getTemplate': endpoint = `/api/vps/v1/templates/${getParam('templateId')}`; break;
				case 'listTemplates': endpoint = '/api/vps/v1/templates'; break;
				//VPS Post-install scripts
				case 'getPostInstallScript': endpoint = `/api/vps/v1/post-install-scripts/${getParam('postInstallScriptId')}`; break;
				case 'updatePostInstallScript': method = 'PUT'; endpoint = `/api/vps/v1/post-install-scripts/${getParam('postInstallScriptId')}`; break;
				case 'deletePostInstallScript': method = 'DELETE'; endpoint = `/api/vps/v1/post-install-scripts/${getParam('postInstallScriptId')}`; break;
				case 'listPostInstallScripts': endpoint = '/api/vps/v1/post-install-scripts'; break;
				case 'createPostInstallScript': method = 'POST'; endpoint = '/api/vps/v1/post-install-scripts'; break;
				//VPS Public Keys
				case 'attachPublicKey': method = 'POST'; endpoint = `/api/vps/v1/public-keys/attach/${getParam('virtualMachineId')}`; break;
				case 'deletePublicKey': method = 'DELETE'; endpoint = `/api/vps/v1/public-keys/${getParam('publicKeyId')}`; break;
				case 'listPublicKeys': endpoint = '/api/vps/v1/public-keys'; break;
				case 'createPublicKey': method = 'POST'; endpoint = '/api/vps/v1/public-keys'; break;
				//VPS Recovery
				case 'createRecovery': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/recovery`; break;
				case 'deleteRecovery': method = 'DELETE'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/recovery`; break;
				//VPS Snapshots
				case 'getSnapshot': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/snapshot`; break;
				case 'createSnapshot': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/snapshot`; break;
				case 'deleteSnapshot': method = 'DELETE'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/snapshot`; break;
				case 'restoreSnapshot': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/snapshot/restore`; break;
				//VPS Virtual Machine
				case 'getVmPublicKeys': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/public-keys`; break;
				case 'updateHostname': method = 'PUT'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/hostname`; break;
				case 'deleteHostname': method = 'DELETE'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/hostname`; break;
				case 'getVm': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}`; break;
				case 'listVms': endpoint = '/api/vps/v1/virtual-machines'; break;
				case 'getVmMetrics': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/metrics?date_from=${getParam('date_from')}&date_to=${getParam('date_to')}`; break;
				case 'updateNameservers': method = 'PUT'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/nameservers`; break;
				case 'updatePanelPassword': method = 'PUT'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/panel-password`; break;
				case 'recreateVm': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/recreate`; break;
				case 'restartVm': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/restart`; break;
				case 'updateRootPassword': method = 'PUT'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/root-password`; break;
				case 'setupVm': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/setup`; break;
				case 'startVm': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/start`; break;
				case 'stopVm': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/stop`; break;
				//DNS Snapshots
				case 'getDnsSnapshot': endpoint = `/api/dns/v1/snapshots/${getParam('domain')}/${getParam('snapshotId')}`; break;
				case 'listDnsSnapshots': endpoint = `/api/dns/v1/snapshots/${getParam('domain')}`; break;
				case 'restoreDnsSnapshot': method = 'POST'; endpoint = `/api/dns/v1/snapshots/${getParam('domain')}/${getParam('snapshotId')}/restore`; break;
				//DNS Zone
				case 'getDnsZone': endpoint = `/api/dns/v1/zones/${getParam('domain')}`; break;
				case 'updateDnsZone': method = 'PUT'; endpoint = `/api/dns/v1/zones/${getParam('domain')}`; break;
				case 'deleteDnsZone': method = 'DELETE'; endpoint = `/api/dns/v1/zones/${getParam('domain')}`; break;
				case 'resetDnsZone': method = 'POST'; endpoint = `/api/dns/v1/zones/${getParam('domain')}/reset`; break;
				case 'validateDnsZone': method = 'POST'; endpoint = `/api/dns/v1/zones/${getParam('domain')}/validate`; break;
				//Domains
				case 'checkDomainAvailability': method = 'POST'; endpoint = '/api/domains/v1/availability'; break;

				default: throw new Error(`Unsupported action: ${action}`);
			}

			const requestConfig = {
				method,
				url: 'https://developers.hostinger.com' + endpoint,
				body: requestBody,
				json: true,
			};

			try {
				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'hostingerApi', requestConfig);
				returnData.push({ json: { response } });
			} catch (error) {
				returnData.push({ json: { error: (error as Error).message, request: requestConfig } });
			}
		}

		return [returnData];
	}
}
