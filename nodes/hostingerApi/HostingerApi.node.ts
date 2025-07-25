import {
	ApplicationError,
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';


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
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
					{ name: 'Billing', value: 'billing' },
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
					{ name: 'Post-Install Scripts', value: 'installScripts' },
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
				displayName: 'Subcategory',
				name: 'domainSubcategory',
				type: 'options',
				options: [
					{ name: 'Availability', value: 'availability' },
					{ name: 'Portfolio', value: 'portfolio' },
					{ name: 'WHOIS', value: 'whois' },
					{ name: 'Forwarding', value: 'forwarding' },
				],
				default: 'availability',
				displayOptions: {
					show: {
						category: [
							'domains'
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
						category:    ['vps'],
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
						category:    ['vps'],
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
						category:    ['vps'],
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
						category:    ['vps'],
						subcategory: ['ptrRecords'],
					},
				},
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'Firewall Activate', value: 'activateFirewall' },
					{ name: 'Firewall Create', value: 'createFirewall' },
					{ name: 'Firewall Deactivate', value: 'deactivateFirewall' },
					{ name: 'Firewall Delete', value: 'deleteFirewall' },
					{ name: 'Firewall Get', value: 'getFirewall' },
					{ name: 'Firewall List', value: 'listFirewalls' },
					{ name: 'Firewall Rule Create', value: 'createFirewallRule' },
					{ name: 'Firewall Rule Delete', value: 'deleteFirewallRule' },
					{ name: 'Firewall Rule Update', value: 'updateFirewallRule' },
					{ name: 'Firewall Sync', value: 'syncFirewall' },
				],
				default: 'activateFirewall',
				displayOptions: {
					show: {
						category:    ['vps'],
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
						category:    ['vps'],
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
						category:    ['vps'],
						subcategory: ['osTemplates'],
					},
				},
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'Post Install Script Create', value: 'createPostInstallScript' },
					{ name: 'Post Install Script Delete', value: 'deletePostInstallScript' },
					{ name: 'Post Install Script Get', value: 'getPostInstallScript' },
					{ name: 'Post Install Script List', value: 'listPostInstallScripts' },
					{ name: 'Post Install Script Update', value: 'updatePostInstallScript' },
				],
				default: 'getPostInstallScript',
				displayOptions: {
					show: {
						category:    ['vps'],
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
						category:    ['vps'],
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
						category:    ['vps'],
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
						category:    ['vps'],
						subcategory: ['snapshots'],
					},
				},
			},
			{
				displayName: 'VPS Action',
				name: 'vpsAction',
				type: 'options',
				options: [
					{ name: 'Get Metrics', value: 'getVmMetrics' },
					{ name: 'Get Public Keys', value: 'getVmPublicKeys' },
					{ name: 'Hostname Reset', value: 'resetHostname' },
					{ name: 'Hostname Update', value: 'updateHostname' },
					{ name: 'Recreate', value: 'recreateVm' },
					{ name: 'Restart', value: 'restartVm' },
					{ name: 'Setup', value: 'setupVm' },
					{ name: 'Start', value: 'startVm' },
					{ name: 'Stop', value: 'stopVm' },
					{ name: 'Update Nameservers', value: 'updateNameservers' },
					{ name: 'Update Panel Password', value: 'updatePanelPassword' },
					{ name: 'Update Root Password', value: 'updateRootPassword' },
					{ name: 'Virtual Machine Get', value: 'getVm' },
					{ name: 'Virtual Machine List', value: 'listVms' },
					{ name: 'Purchase New Virtual Machine', value: 'purchaseVm' },
				],
				default: 'getVm',
				displayOptions: {
					show: {
						category:    ['vps'],
						subcategory: ['virtualMachine'],
					},
				},
			},
			{
				displayName: 'DNS Action',
				name: 'dnsAction',
				type: 'options',
				options: [
					{ name: 'DNS Snapshot Get', value: 'getDnsSnapshot' },
					{ name: 'DNS Snapshot List', value: 'listDnsSnapshots' },
					{ name: 'DNS Snapshot Restore', value: 'restoreDnsSnapshot' },
					{ name: 'DNS Zone Delete', value: 'deleteDnsZone' },
					{ name: 'DNS Zone Get', value: 'getDnsZone' },
					{ name: 'DNS Zone Reset', value: 'resetDnsZone' },
					{ name: 'DNS Zone Update', value: 'updateDnsZone' },
					{ name: 'DNS Zone Validate', value: 'validateDnsZone' },
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
						domainSubcategory: ['availability'],
					},
				},
			},
			{
				displayName: 'Domains Action',
				name: 'domainsAction',
				type: 'options',
				options: [
					{ name: 'Get Domain', value: 'getDomain' },
					{ name: 'List Domains', value: 'listDomains' },
					{ name: 'Purchase Domain', value: 'purchaseDomain' },
					{ name: 'Enable Domain Lock', value: 'enableDomainLock' },
					{ name: 'Disable Domain Lock', value: 'disableDomainLock' },
					{ name: 'Enable Privacy Protection', value: 'enablePrivacyProtection' },
					{ name: 'Disable Privacy Protection', value: 'disablePrivacyProtection' },
					{ name: 'Update Nameservers', value: 'updateDomainNameservers' },
				],
				default: 'listDomains',
				displayOptions: {
					show: {
						category: ['domains'],
						domainSubcategory: ['portfolio'],
					},
				},
			},
			{
				displayName: 'Domains Action',
				name: 'domainsAction',
				type: 'options',
				options: [
					{ name: 'Get WHOIS Profile', value: 'getWhoisProfile' },
					{ name: 'Delete WHOIS Profile', value: 'deleteWhoisProfile' },
					{ name: 'List WHOIS Profiles', value: 'listWhoisProfiles' },
					{ name: 'Create WHOIS Profile', value: 'createWhoisProfile' },
					{ name: 'Get WHOIS Profile Usage', value: 'getWhoisProfileUsage' },
				],
				default: 'listWhoisProfiles',
				displayOptions: {
					show: {
						category: ['domains'],
						domainSubcategory: ['whois'],
					},
				},
			},
			{
				displayName: 'Domains Action',
				name: 'domainsAction',
				type: 'options',
				options: [
					{ name: 'Get Forwarding Data', value: 'getForwardingData' },
					{ name: 'Delete Forwarding Data', value: 'deleteForwardingData' },
					{ name: 'Create Forwarding Data', value: 'createForwardingData' },
				],
				default: 'getForwardingData',
				displayOptions: {
					show: {
						category: ['domains'],
						domainSubcategory: ['forwarding'],
					},
				},
			},
			{
				displayName: 'Billing Action',
				name: 'billingAction',
				type: 'options',
				options: [
					{ name: 'Get catalog item list', value: 'getCatalogList' },
					{ name: 'Set default payment method', value: 'setPaymentMethod' },
					{ name: 'Delete payment method', value: 'deletePaymentMethod' },
					{ name: 'Get payment method list', value: 'getPaymentList' },
					{ name: 'Cancel subscription', value: 'deleteSubscription' },
					{ name: 'Get subscription list', value: 'getSubscriptionList' },
				],
				default: 'getCatalogList',
				displayOptions: {
					show: {
						category:    ['billing']
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
						category:    ['vps'],
						vpsAction: [
							'getAction', 'listActions', 'deleteBackup', 'listBackups', 'restoreBackup', 'createPTR', 'deletePTR', 'activateFirewall', 'deactivateFirewall', 'syncFirewall', 'getMonarx', 'addMonarx', 'removeMonarx', 'attachPublicKey', 'createRecovery', 'deleteRecovery', 'getSnapshot', 'createSnapshot', 'deleteSnapshot', 'restoreSnapshot', 'getVmPublicKeys', 'updateHostname', 'resetHostname', 'getVm', 'getVmMetrics', 'updateNameservers', 'updatePanelPassword', 'recreateVm', 'restartVm', 'updateRootPassword', 'setupVm', 'startVm', 'stopVm'
						]
					}
				}
			},
			{
				displayName: 'Date From',
				name: 'date_from',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						category:    ['vps'],
						vpsAction: [
							'getVmMetrics'
						]
					}
				}
			},
			{
				displayName: 'Date To',
				name: 'date_to',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						category:    ['vps'],
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
						category:    ['vps'],
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
						category:    ['vps'],
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
						category:    ['vps'],
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
						category:    ['dns'],
						dnsAction: [
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
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						category: ['domains'],
						domainsAction: [
							'getDomain', 'enableDomainLock', 'disableDomainLock', 
							'enablePrivacyProtection', 'disablePrivacyProtection', 
							'updateDomainNameservers', 'getForwardingData', 
							'deleteForwardingData'
						]
					}
				}
			},
			{
				displayName: 'WHOIS ID',
				name: 'whoisId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						category: ['domains'],
						domainsAction: [
							'getWhoisProfile', 'deleteWhoisProfile', 'getWhoisProfileUsage'
						]
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
						category:    ['vps'],
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
						category:    ['vps'],
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
						category:    ['vps'],
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
						category:    ['vps'],
						vpsAction: ['getTemplate']
					}
				}
			},
			{
				displayName: 'Payment Method ID',
				name: 'paymentMethodId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						category:    ['billing'],
						billingAction: ['setPaymentMethod', 'deletePaymentMethod']
					}
				}
			},
			{
				displayName: 'Subscription ID',
				name: 'subscriptionId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						category:    ['billing'],
						billingAction: ['deleteSubscription']
					}
				}
			},
			{
				displayName: 'Request Body',
				name: 'requestBody',
				type: 'json',
				default: '{}',
				description: 'Raw JSON body for POST/PUT requests',
				displayOptions: {
					show: {
						category:    ['vps'],
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
				description: 'Raw JSON body for POST/PUT requests',
				displayOptions: {
					show: {
						category: ['dns']
					}
				}
			},
			{
				displayName: 'Request Body',
				name: 'requestBody',
				type: 'json',
				default: '{}',
				description: 'Raw JSON body for POST/PUT requests',
				displayOptions: {
					show: {
						category: ['domains'],
						domainsAction: [
							'checkDomainAvailability', 'purchaseDomain', 
							'updateDomainNameservers', 'createWhoisProfile', 
							'createForwardingData'
						]
					}
				}
			},
			{
				displayName: 'Request Body',
				name: 'requestBody',
				type: 'json',
				default: `{
				"item_id": "hostingercom-vps-kvm2-usd-1m",
				"payment_method_id": 1327362,
					"setup": {
					"template_id": 1130,
					"data_center_id": 19,
					"post_install_script_id": 6324,
					"password": "oMeNRustosIO",
					"hostname": "my.server.tld",
					"install_monarx": false,
						"enable_backups": true,
						"ns1": "4.3.2.1",
						"ns2": "1.2.3.4",
						"public_key": {
						"name": "my-key",
						"key": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC2X..."
					}
				}, 
				"coupons": [[ "Coupon 3"]]
				}`,
				description: 'Raw JSON body for POST/PUT requests',
				displayOptions: {
					show: {
						category: ['vps'],
						vpsAction: ['purchaseVm']
					}
				}
			},
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
				case 'billing':
					action = this.getNodeParameter('billingAction', i) as string;
					break;
				default:
					throw new ApplicationError(`Unknown category: ${category}`);
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
				case 'resetHostname': method = 'DELETE'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/hostname`; break;
				case 'getVm': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}`; break;
				case 'listVms': endpoint = '/api/vps/v1/virtual-machines'; break;
				case 'purchaseVm': method = 'POST'; endpoint = '/api/vps/v1/virtual-machines'; break;
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
				//Domains - Availability
				case 'checkDomainAvailability': method = 'POST'; endpoint = '/api/domains/v1/availability'; break;
				//Domains - Portfolio
				case 'getDomain': method = 'GET'; endpoint = `/api/domains/v1/portfolio/${getParam('domain')}`; break;
				case 'listDomains': method = 'GET'; endpoint = '/api/domains/v1/portfolio'; break;
				case 'purchaseDomain': method = 'POST'; endpoint = '/api/domains/v1/portfolio'; break;
				case 'enableDomainLock': method = 'PUT'; endpoint = `/api/domains/v1/portfolio/${getParam('domain')}/domain-lock`; break;
				case 'disableDomainLock': method = 'DELETE'; endpoint = `/api/domains/v1/portfolio/${getParam('domain')}/domain-lock`; break;
				case 'enablePrivacyProtection': method = 'PUT'; endpoint = `/api/domains/v1/portfolio/${getParam('domain')}/privacy-protection`; break;
				case 'disablePrivacyProtection': method = 'DELETE'; endpoint = `/api/domains/v1/portfolio/${getParam('domain')}/privacy-protection`; break;
				case 'updateDomainNameservers': method = 'PUT'; endpoint = `/api/domains/v1/portfolio/${getParam('domain')}/nameservers`; break;
				//Domains - WHOIS
				case 'getWhoisProfile': method = 'GET'; endpoint = `/api/domains/v1/whois/${getParam('whoisId')}`; break;
				case 'deleteWhoisProfile': method = 'DELETE'; endpoint = `/api/domains/v1/whois/${getParam('whoisId')}`; break;
				case 'listWhoisProfiles': method = 'GET'; endpoint = '/api/domains/v1/whois'; break;
				case 'createWhoisProfile': method = 'POST'; endpoint = '/api/domains/v1/whois'; break;
				case 'getWhoisProfileUsage': method = 'GET'; endpoint = `/api/domains/v1/whois/${getParam('whoisId')}/usage`; break;
				//Domains - Forwarding
				case 'getForwardingData': method = 'GET'; endpoint = `/api/domains/v1/forwarding/${getParam('domain')}`; break;
				case 'deleteForwardingData': method = 'DELETE'; endpoint = `/api/domains/v1/forwarding/${getParam('domain')}`; break;
				case 'createForwardingData': method = 'POST'; endpoint = '/api/domains/v1/forwarding'; break;
				//Billing
				case 'getCatalogList': method = 'GET'; endpoint = '/api/billing/v1/catalog'; break;
				case 'setPaymentMethod': method = 'POST'; endpoint = `/api/billing/v1/payment-methods/${getParam('paymentMethodId')}`; break;
				case 'deletePaymentMethod': method = 'DELETE'; endpoint = `/api/billing/v1/payment-methods/${getParam('paymentMethodId')}`; break;
				case 'getPaymentList': method = 'GET'; endpoint = '/api/billing/v1/payment-methods'; break;
				case 'deleteSubscription': method = 'DELETE'; endpoint = `/api/billing/v1/subscriptions/${getParam('subscriptionId')}`; break;
				case 'getSubscriptionList': method = 'GET'; endpoint = '/api/billing/v1/subscriptions'; break;

				default: throw new ApplicationError(`Unsupported action: ${action}`);
			}

			const requestConfig = {
				method,
				url: 'https://developers.hostinger.com' + endpoint,
				body: requestBody,
				headers: {
					'User-Agent': 'hostinger-n8n-node',
				},
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
