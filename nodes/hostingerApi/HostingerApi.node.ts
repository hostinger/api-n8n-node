import {
	ApplicationError,
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';


export class HostingerApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Hostinger API',
		name: 'hostingerApi',
		icon: 'file:hostingerLogo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Hostinger API',
		defaults: {
			name: 'Hostinger API',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'hostingerApi',
				required: true,
			},
		],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Billing', value: 'billing', },
					{ name: 'DNS', value: 'dns', },
					{ name: 'Domain', value: 'domain', },
					{ name: 'Domain Forwarding', value: 'domainForwarding', },
					{ name: 'Domain WHOIS', value: 'whois', },
					{ name: 'Reach', value: 'reach', },
					{ name: 'VPS', value: 'vps', },
					{ name: 'VPS Actions', value: 'vpsActions', },
					{ name: 'VPS Backups', value: 'vpsBackups', },
					{ name: 'VPS Data Centers', value: 'vpsDataCenters', },
					{ name: 'VPS Docker Manager', value: 'vpsDocker', },
					{ name: 'VPS Firewall', value: 'vpsFirewall', },
					{ name: 'VPS Malware Scanner', value: 'vpsMonarx', },
					{ name: 'VPS Post Install Scripts', value: 'vpsScripts', },
					{ name: 'VPS PTR', value: 'vpsPTR', },
					{ name: 'VPS Public Keys', value: 'vpsPublicKeys', },
					{ name: 'VPS Snapshots', value: 'vpsSnapshots', },
					{ name: 'VPS Templates', value: 'vpsTemplates', },
				],
				default: 'vps',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Action', value: 'getAction', action: 'Get VPS action'},
					{ name: 'List Actions', value: 'listActions', action: 'List VPS actions'},
				],
				default: 'getAction',
				displayOptions: {
					show: {
						resource: ['vpsActions'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Create Project', value: 'createProject', action: 'Create Docker project'},
					{ name: 'Delete Project', value: 'deleteProject', action: 'Delete Docker project'},
					{ name: 'Get Project Logs', value: 'getLogs', action: 'Get Docker project logs'},
					{ name: 'List Containers', value: 'listContainers', action: 'List Docker containers'},
					{ name: 'List Contents', value: 'listContents', action: 'List Docker containers content'},
					{ name: 'List Projects', value: 'listProjects', action: 'List Docker projects'},
					{ name: 'Restart Project', value: 'restartProject', action: 'Restart Docker project'},
					{ name: 'Start Project', value: 'startProject', action: 'Start Docker project'},
					{ name: 'Stop Project', value: 'stopProject', action: 'Stop Docker project'},
					{ name: 'Update Project', value: 'updateProject', action: 'Update Docker project'},
				],
				default: 'listProjects',
				displayOptions: {
					show: {
						resource: ['vpsDocker'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Delete Backup', value: 'deleteBackup', action: 'Delete VPS backup'},
					{ name: 'List Backups', value: 'listBackups', action: 'List VPS backups'},
					{ name: 'Restore Backup', value: 'restoreBackup', action: 'Restore VPS backup'},
				],
				default: 'listBackups',
				displayOptions: {
					show: {
						resource: ['vpsBackups'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'List Data Centers', value: 'listDataCenters', action: 'List VPS data centers'},
				],
				default: 'listDataCenters',
				displayOptions: {
					show: {
						resource: ['vpsDataCenters'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Create PTR', value: 'createPTR', action: 'Create PTR record'},
					{ name: 'Delete PTR', value: 'deletePTR', action: 'Delete PTR record'},
				],
				default: 'createPTR',
				displayOptions: {
					show: {
						resource: ['vpsPTR'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Firewall Activate', value: 'activateFirewall', action: 'Activate VPS firewall'},
					{ name: 'Firewall Create', value: 'createFirewall', action: 'Create VPS firewall'},
					{ name: 'Firewall Deactivate', value: 'deactivateFirewall', action: 'Deactivate VPS firewall'},
					{ name: 'Firewall Delete', value: 'deleteFirewall', action: 'Delete VPS firewall'},
					{ name: 'Firewall Get', value: 'getFirewall', action: 'Get VPS firewall'},
					{ name: 'Firewall List', value: 'listFirewalls', action: 'List VPS firewalls'},
					{ name: 'Firewall Rule Create', value: 'createFirewallRule', action: 'Create VPS firewall rule'},
					{ name: 'Firewall Rule Delete', value: 'deleteFirewallRule', action: 'Delete VPS firewall rule'},
					{ name: 'Firewall Rule Update', value: 'updateFirewallRule', action: 'Update VPS firewall rule'},
					{ name: 'Firewall Sync', value: 'syncFirewall', action: 'Sync VPS firewall'},
				],
				default: 'activateFirewall',
				displayOptions: {
					show: {
						resource: ['vpsFirewall'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Monarx', value: 'getMonarx', action: 'Get VPS malware scanner status'},
					{ name: 'Add Monarx', value: 'addMonarx', action: 'Add VPS malware scanner'},
					{ name: 'Remove Monarx', value: 'removeMonarx', action: 'Remove VPS malware scanner'},
				],
				default: 'getMonarx',
				displayOptions: {
					show: {
						resource: ['vpsMonarx'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Template', value: 'getTemplate', action: 'Get VPS template'},
					{ name: 'List Templates', value: 'listTemplates', action: 'List VPS templates'},
				],
				default: 'getTemplate',
				displayOptions: {
					show: {
						resource: ['vpsTemplates'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Post Install Script Create', value: 'createPostInstallScript', action: 'Create VPS post install script'},
					{ name: 'Post Install Script Delete', value: 'deletePostInstallScript', action: 'Delete VPS post install script'},
					{ name: 'Post Install Script Get', value: 'getPostInstallScript', action: 'Get VPS post install script'},
					{ name: 'Post Install Script List', value: 'listPostInstallScripts', action: 'List VPS post install scripts'},
					{ name: 'Post Install Script Update', value: 'updatePostInstallScript', action: 'Update VPS post install script'},
				],
				default: 'getPostInstallScript',
				displayOptions: {
					show: {
						resource: ['vpsScripts'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Attach Public Key', value: 'attachPublicKey', action: 'Attach VPS public key'},
					{ name: 'Delete Public Key', value: 'deletePublicKey', action: 'Delete VPS public key'},
					{ name: 'List Public Keys', value: 'listPublicKeys', action: 'List VPS public keys'},
					{ name: 'Create Public Key', value: 'createPublicKey', action: 'Create VPS public key'},
				],
				default: 'attachPublicKey',
				displayOptions: {
					show: {
						resource: ['vpsPublicKeys'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Snapshot', value: 'getSnapshot', action: 'Get VPS snapshot'},
					{ name: 'Create Snapshot', value: 'createSnapshot', action: 'Create VPS snapshot'},
					{ name: 'Delete Snapshot', value: 'deleteSnapshot', action: 'Delete VPS snapshot'},
					{ name: 'Restore Snapshot', value: 'restoreSnapshot', action: 'Restore VPS snapshot'},
				],
				default: 'getSnapshot',
				displayOptions: {
					show: {
						resource: ['vpsSnapshots'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Metrics', value: 'getVmMetrics', action: 'Get VPS metrics'},
					{ name: 'Get Public Keys', value: 'getVmPublicKeys', action: 'Get VPS public keys'},
					{ name: 'Get VPS', value: 'getVm', action: 'Get VPS'},
					{ name: 'Hostname Reset', value: 'resetHostname', action: 'Reset VPS hostname'},
					{ name: 'Hostname Update', value: 'updateHostname', action: 'Update VPS hostname'},
					{ name: 'List VPS', value: 'listVms', action: 'List VPS'},
					{ name: 'Purchase New VPS', value: 'purchaseVm', action: 'Purchase new VPS'},
					{ name: 'Recreate', value: 'recreateVm', action: 'Recreate VPS'},
					{ name: 'Restart', value: 'restartVm', action: 'Restart VPS'},
					{ name: 'Setup', value: 'setupVm', action: 'Setup VPS'},
					{ name: 'Start', value: 'startVm', action: 'Start VPS'},
					{ name: 'Start Recovery', value: 'createRecovery', action: 'Start VPS recovery mode'},
					{ name: 'Stop', value: 'stopVm', action: 'Stop VPS'},
					{ name: 'Stop Recovery', value: 'deleteRecovery', action: 'Stop VPS recovery mode'},
					{ name: 'Update Nameservers', value: 'updateNameservers', action: 'Update VPS nameservers'},
					{ name: 'Update Panel Password', value: 'updatePanelPassword', action: 'Update VPS control panel password'},
					{ name: 'Update Root Password', value: 'updateRootPassword', action: 'Update VPS root password'},
				],
				default: 'getVm',
				displayOptions: {
					show: {
					resource: ['vps'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'DNS Snapshot Get', value: 'getDnsSnapshot', action: 'Get DNS snapshot'},
					{ name: 'DNS Snapshot List', value: 'listDnsSnapshots', action: 'List DNS snapshots'},
					{ name: 'DNS Snapshot Restore', value: 'restoreDnsSnapshot', action: 'Restore DNS snapshot'},
					{ name: 'DNS Zone Delete', value: 'deleteDnsZone', action: 'Delete DNS zone'},
					{ name: 'DNS Zone Get', value: 'getDnsZone', action: 'Get DNS zone'},
					{ name: 'DNS Zone Reset', value: 'resetDnsZone', action: 'Reset DNS zone'},
					{ name: 'DNS Zone Update', value: 'updateDnsZone', action: 'Update DNS zone'},
					{ name: 'DNS Zone Validate', value: 'validateDnsZone', action: 'Validate DNS zone'},
				],
				default: 'listDnsSnapshots',
				displayOptions: {
					show: {
						resource: ['dns'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Check Domain Availability', value: 'checkDomainAvailability', action: 'Check domain availability',},
					{ name: 'Disable Domain Lock', value: 'disableDomainLock', action: 'Disable domain lock'},
					{ name: 'Disable Privacy Protection', value: 'disablePrivacyProtection', action: 'Disable domain privacy protection'},
					{ name: 'Enable Domain Lock', value: 'enableDomainLock', action: 'Enable domain lock'},
					{ name: 'Enable Privacy Protection', value: 'enablePrivacyProtection', action: 'Enable domain privacy protection'},
					{ name: 'Get Domain', value: 'getDomain', action: 'Get a domain'},
					{ name: 'List Domains', value: 'listDomains', action: 'List domains'},
					{ name: 'Purchase Domain', value: 'purchaseDomain', action: 'Purchase domain'},
					{ name: 'Update Nameservers', value: 'updateDomainNameservers', action: 'Update domain nameservers'},
				],
				default: 'listDomains',
				displayOptions: {
					show: {
					resource: ['domain'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Create WHOIS Profile', value: 'createWhoisProfile', action: 'Create WHOIS profile'},
					{ name: 'Delete WHOIS Profile', value: 'deleteWhoisProfile', action: 'Delete WHOIS profile'},
					{ name: 'Get WHOIS Profile', value: 'getWhoisProfile', action: 'Get WHOIS profile'},
					{ name: 'Get WHOIS Profile Usage', value: 'getWhoisProfileUsage', action: 'Get WHOIS profile usage'},
					{ name: 'List WHOIS Profiles', value: 'listWhoisProfiles', action: 'List WHOIS profiles'},
				],
				default: 'listWhoisProfiles',
				displayOptions: {
					show: {
						resource: ['whois'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Forwarding Data', value: 'getForwardingData', action: 'Get domain forwarding'},
					{ name: 'Delete Forwarding Data', value: 'deleteForwardingData', action: 'Delete domain forwarding'},
					{ name: 'Create Forwarding Data', value: 'createForwardingData', action: 'Create domain forwarding'},
				],
				default: 'getForwardingData',
				displayOptions: {
					show: {
						resource: ['domainForwarding'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Cancel Subscription', value: 'deleteSubscription', action: 'Cancel subscription'},
					{ name: 'Delete Payment Method', value: 'deletePaymentMethod', action: 'Delete payment method'},
					{ name: 'Get Catalog Item List', value: 'getCatalogList', action: 'Get catalog item list'},
					{ name: 'Get Payment Method List', value: 'getPaymentList', action: 'Get payment method list'},
					{ name: 'Get Subscription List', value: 'getSubscriptionList', action: 'Get subscription list'},
					{ name: 'Set Default Payment Method', value: 'setPaymentMethod', action: 'Set default payment method'},
				],
				default: 'getCatalogList',
				displayOptions: {
					show: {
						resource: ['billing']
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'List Contacts', value: 'listContacts', action: 'List Reach contacts'},
					{ name: 'Create Contact', value: 'createContact', action: 'Create Reach contact'},
					{ name: 'Delete Contact', value: 'deleteContact', action: 'Delete Reach contact'},
					{ name: 'List Contact Groups', value: 'listContactGroups', action: 'List Reach contact groups'},
				],
				default: 'listContacts',
				displayOptions: {
					show: {
						resource: ['reach']
					},
				},
			},
			{
				displayName: 'Virtual Machine ID',
				name: 'virtualMachineId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: [
							'getAction', 'listActions', 'deleteBackup', 'listBackups', 'restoreBackup', 'createPTR', 'deletePTR', 'activateFirewall', 'deactivateFirewall', 'syncFirewall', 'getMonarx', 'addMonarx', 'removeMonarx', 'attachPublicKey', 'createRecovery', 'deleteRecovery', 'getSnapshot', 'createSnapshot', 'deleteSnapshot', 'restoreSnapshot', 'getVmPublicKeys', 'updateHostname', 'resetHostname', 'getVm', 'getVmMetrics', 'updateNameservers', 'updatePanelPassword', 'restartVm', 'updateRootPassword', 'setupVm', 'recreateVm', 'startVm', 'stopVm', 'listContainers', 'listProjects', 'listContents', 'createProject', 'deleteProject', 'getLogs', 'restartProject', 'startProject', 'stopProject', 'updateProject'
						]
					}
				}
			},
			{
				displayName: 'Docker Project Name',
				name: 'dockerProjectName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['listContainers', 'listContents', 'deleteProject', 'getLogs', 'restartProject', 'startProject', 'stopProject', 'updateProject']
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
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: [
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
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: [
							'getVmMetrics'
						]
					}
				}
			},
			{
				displayName: 'Action ID',
				name: 'actionId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['getAction']
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
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['deleteBackup', 'restoreBackup']
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
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: [
							'activateFirewall', 'deactivateFirewall', 'getFirewall', 'deleteFirewall', 'updateFirewallRule', 'deleteFirewallRule', 'createFirewallRule', 'syncFirewall'
						]
					}
				}
			},
			{
				displayName: 'Hostname',
				name: 'hostname',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'my.server.tld',
				description: 'The new hostname for the VPS',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['updateHostname']
					}
				}
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'number',
				required: true,
				default: '',
				description: 'The ID of the OS template to use for recreating the VPS',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['recreateVm', 'setupVm', 'getTemplate']
					}
				}
			},
			{
				displayName: 'Root Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true
				},
				default: '',
				placeholder: 'oMeNRusto#sIO',
				description: 'Root password for the VPS. Must be at least 12 characters with uppercase, lowercase, and a number.',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['recreateVm', 'updateRootPassword', 'setupVm']
					}
				}
			},
			{
				displayName: 'Panel Password',
				name: 'panelPassword',
				type: 'string',
				typeOptions: {
					password: true
				},
				default: '',
				placeholder: 'Mna58c#17a4d',
				description: 'Control panel password. Must be at least 12 characters with uppercase, lowercase, and a number.',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['recreateVm', 'updatePanelPassword']
					}
				}
			},
			{
				displayName: 'Post Install Script ID',
				name: 'postInstallScriptId',
				type: 'number',
				default: '',
				description: 'Optional post-install script ID to run after VPS recreation',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['recreateVm', 'setupVm']
					}
				}
			},
			{
				displayName: 'Nameserver 1',
				name: 'ns1',
				type: 'string',
				default: '',
				required: true,
				placeholder: '4.3.2.1',
				description: 'Primary nameserver IP address',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['updateNameservers']
					}
				}
			},
			{
				displayName: 'Nameserver 2',
				name: 'ns2',
				type: 'string',
				default: '',
				placeholder: '1.2.3.4',
				description: 'Secondary nameserver IP address (optional)',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['updateNameservers']
					}
				}
			},
			{
				displayName: 'Nameserver 3',
				name: 'ns3',
				type: 'string',
				default: '',
				placeholder: '5.2.3.4',
				description: 'Tertiary nameserver IP address (optional)',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['updateNameservers']
					}
				}
			},
			{
				displayName: 'Data Center ID',
				name: 'dataCenterId',
				type: 'number',
				required: true,
				default: '',
				description: 'The ID of the data center where the VPS will be set up',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['setupVm']
					}
				}
			},
			{
				displayName: 'Install Monarx',
				name: 'installMonarx',
				type: 'boolean',
				default: false,
				description: 'Whether to install Monarx malware scanner',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['setupVm']
					}
				}
			},
			{
				displayName: 'Enable Backups',
				name: 'enableBackups',
				type: 'boolean',
				default: true,
				description: 'Whether to enable automatic backups',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['setupVm']
					}
				}
			},
			{
				displayName: 'Public Key Name',
				name: 'publicKeyName',
				type: 'string',
				default: '',
				placeholder: 'my-key',
				description: 'Name for the SSH public key',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['setupVm']
					}
				}
			},
			{
				displayName: 'Public Key',
				name: 'publicKey',
				type: 'string',
				typeOptions: {
					rows: 4
				},
				default: '',
				placeholder: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC2X...',
				description: 'SSH public key content',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['setupVm']
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
						resource: ['dns'],
						operation: [
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
						resource: ['dns']
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
						resource: ['domain', 'whois', 'domainForwarding'],
						operation: [
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
						resource: ['domain', 'whois', 'domainForwarding'],
						operation: [
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
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['updateFirewallRule', 'deleteFirewallRule']
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
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['getPostInstallScript', 'updatePostInstallScript', 'deletePostInstallScript']
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
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['deletePublicKey']
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
						resource: ['billing'],
						operation: ['setPaymentMethod', 'deletePaymentMethod']
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
						resource: ['billing'],
						operation: ['deleteSubscription']
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
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: [
							'createFirewall', 'updateFirewallRule', 'createFirewallRule', 'updatePostInstallScript', 'createPostInstallScript', 'attachPublicKey', 'createPublicKey', 'createRecovery'
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
						resource: ['dns']
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
						resource: ['domain', 'whois', 'domainForwarding'],
						operation: [
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
  "project_name": "my-project-1",
  "content": "",
  "environment": null
}`,
				description: 'Raw JSON body for POST/PUT requests',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: [
							'createProject'
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
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates'],
						operation: ['purchaseVm']
					}
				}
			},
			{
				displayName: 'Email',
				name: 'contactEmail',
				type: 'string',
				default: '',
				description: 'Email address for the contact',
				required: true,
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['createContact']
					}
				}
			},
			{
				displayName: 'Name',
				name: 'contactName',
				type: 'string',
				default: '',
				description: 'First name of the contact',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['createContact']
					}
				}
			},
			{
				displayName: 'Surname',
				name: 'contactSurname',
				type: 'string',
				default: '',
				description: 'Last name of the contact',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['createContact']
					}
				}
			},
			{
				displayName: 'Group UUIDs',
				name: 'contactGroupUuids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of group UUIDs to assign the contact to',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['createContact']
					}
				}
			},
			{
				displayName: 'Note',
				name: 'contactNote',
				type: 'string',
				default: '',
				description: 'Note about the contact (max 75 characters)',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['createContact']
					}
				}
			},


			{
				displayName: 'Contact UUID',
				name: 'contactUuid',
				type: 'string',
				default: '',
				description: 'UUID of the contact to delete',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['deleteContact']
					}
				}
			},
			{
				displayName: 'Group UUID',
				name: 'groupUuid',
				type: 'string',
				default: '',
				description: 'Filter contacts by group UUID',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['listContacts']
					}
				}
			},
			{
				displayName: 'Subscription Status',
				name: 'subscriptionStatus',
				type: 'options',
				options: [
					{ name: 'All', value: '', },
					{ name: 'Subscribed', value: 'subscribed', },
					{ name: 'Unsubscribed', value: 'unsubscribed', },
				],
				default: '',
				description: 'Filter contacts by subscription status (leave as "All" to see all contacts)',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['listContacts']
					}
				}
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				description: 'Page number for pagination',
				required: true,
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['listContacts']
					}
				}
			},
		]
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const continueOnFail = this.continueOnFail();

		for (let i = 0; i < items.length; i++) {

			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			const getParam = (name: string) => this.getNodeParameter(name, i) as string;
			let method: IHttpRequestMethods = 'GET';
			let endpoint = '';
			let requestBody: IDataObject | undefined;

			try {
				// For Reach createContact, build request body from individual fields
				if (resource === 'reach' && operation === 'createContact') {
					const contactEmail = this.getNodeParameter('contactEmail', i) as string;
					const contactName = this.getNodeParameter('contactName', i) as string;
					const contactSurname = this.getNodeParameter('contactSurname', i) as string;
					const contactGroupUuids = this.getNodeParameter('contactGroupUuids', i) as string;
					const contactNote = this.getNodeParameter('contactNote', i) as string;

					const contactData: IDataObject = {
						email: contactEmail
					};

					if (contactName) contactData.name = contactName;
					if (contactSurname) contactData.surname = contactSurname;
					if (contactNote) contactData.note = contactNote;

					// Handle group UUIDs - convert comma-separated string to array
					if (contactGroupUuids) {
						const groupUuids = contactGroupUuids.split(',').map(uuid => uuid.trim()).filter(uuid => uuid);
						if (groupUuids.length > 0) {
							contactData.group_uuids = groupUuids;
						}
					}

					requestBody = contactData;
				} else if (operation === 'updateHostname') {
					// For updateHostname, build request body from hostname field
					const hostname = this.getNodeParameter('hostname', i) as string;
					requestBody = { hostname };
				} else if (operation === 'recreateVm') {
					// For recreateVm, build request body from individual fields
					const templateId = this.getNodeParameter('templateId', i) as number;
					const password = this.getNodeParameter('password', i) as string;
					const panelPassword = this.getNodeParameter('panelPassword', i) as string;
					const postInstallScriptId = this.getNodeParameter('postInstallScriptId', i) as number;

					requestBody = {
						template_id: templateId,
						password: password
					};

					if (panelPassword) requestBody.panel_password = panelPassword;
					if (postInstallScriptId) requestBody.post_install_script_id = postInstallScriptId;
				} else if (operation === 'updatePanelPassword') {
					// For updatePanelPassword, build request body from panelPassword field
					const panelPassword = this.getNodeParameter('panelPassword', i) as string;
					requestBody = { password: panelPassword };
				} else if (operation === 'updateRootPassword') {
					// For updateRootPassword, build request body from password field
					const password = this.getNodeParameter('password', i) as string;
					requestBody = { password: password };
				} else if (operation === 'updateNameservers') {
					// For updateNameservers, build request body from nameserver fields
					const ns1 = this.getNodeParameter('ns1', i) as string;
					const ns2 = this.getNodeParameter('ns2', i) as string;
					const ns3 = this.getNodeParameter('ns3', i) as string;

					requestBody = { ns1 };

					if (ns2) requestBody.ns2 = ns2;
					if (ns3) requestBody.ns3 = ns3;
				} else if (operation === 'setupVm') {
					// For setupVm, build request body from individual fields
					const templateId = this.getNodeParameter('templateId', i) as number;
					const dataCenterId = this.getNodeParameter('dataCenterId', i) as number;
					const password = this.getNodeParameter('password', i) as string;
					const postInstallScriptId = this.getNodeParameter('postInstallScriptId', i) as number;
					const installMonarx = this.getNodeParameter('installMonarx', i) as boolean;
					const enableBackups = this.getNodeParameter('enableBackups', i) as boolean;
					const publicKeyName = this.getNodeParameter('publicKeyName', i) as string;
					const publicKey = this.getNodeParameter('publicKey', i) as string;

					requestBody = {
						template_id: templateId,
						data_center_id: dataCenterId,
						password: password
					};

					if (postInstallScriptId) requestBody.post_install_script_id = postInstallScriptId;
					if (installMonarx !== undefined) requestBody.install_monarx = installMonarx;
					if (enableBackups !== undefined) requestBody.enable_backups = enableBackups;
					if (publicKeyName && publicKey) {
						requestBody.public_key = {
							name: publicKeyName,
							key: publicKey
						};
					}
				} else {
					// For other actions, use the request body field
					requestBody = JSON.parse(this.getNodeParameter('requestBody', i) as string);
				}
			} catch (e) {}

			switch (operation) {
				//VPS Actions
				case 'getAction': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/actions/${getParam('actionId')}`; break;
				case 'listActions': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/actions`; break;
				//VPS Backups
				case 'deleteBackup': method = 'DELETE'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/backups/${getParam('backupId')}`; break;
				case 'listBackups': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/backups`; break;
				case 'restoreBackup': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/backups/${getParam('backupId')}/restore`; break;
				//VPS Data Centers
				case 'listDataCenters': endpoint = '/api/vps/v1/data-centers'; break;
				//VPS Docker
				case 'listContainers': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/docker/${getParam('dockerProjectName')}/containers`; break;
				case 'listContents': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/docker/${getParam('dockerProjectName')}`; break;
				case 'listProjects': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/docker`; break;
				case 'createProject': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/docker`; break;
				case 'deleteProject': method = 'DELETE'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/docker/${getParam('dockerProjectName')}/down`; break;
				case 'getLogs': endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/docker/${getParam('dockerProjectName')}/logs`; break;
				case 'restartProject': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/docker/${getParam('dockerProjectName')}/restart`; break;
				case 'startProject': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/docker/${getParam('dockerProjectName')}/start`; break;
				case 'stopProject': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/docker/${getParam('dockerProjectName')}/stop`; break;
				case 'updateProject': method = 'POST'; endpoint = `/api/vps/v1/virtual-machines/${getParam('virtualMachineId')}/docker/${getParam('dockerProjectName')}/update`; break;
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
				//Reach
				case 'listContacts': 
					let contactsEndpoint = `/api/reach/v1/contacts?page=${getParam('page')}`;
					const groupUuid = this.getNodeParameter('groupUuid', i) as string;
					const subscriptionStatus = this.getNodeParameter('subscriptionStatus', i) as string;

					if (groupUuid) {
						contactsEndpoint += `&group_uuid=${groupUuid}`;
					}
					if (subscriptionStatus) {
						contactsEndpoint += `&subscription_status=${subscriptionStatus}`;
					}
					endpoint = contactsEndpoint;
					break;
				case 'createContact': method = 'POST'; endpoint = '/api/reach/v1/contacts'; break;
				case 'deleteContact': method = 'DELETE'; endpoint = `/api/reach/v1/contacts/${getParam('contactUuid')}`; break;
				case 'listContactGroups': endpoint = '/api/reach/v1/contacts/groups'; break;

				default: throw new ApplicationError(`Unsupported operation: ${operation}`);
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
				returnData.push({ json: { response }, pairedItem: { item: i } });
			} catch (error) {
				if (continueOnFail) {
					const executionError = new NodeOperationError(
						this.getNode(),
						error as Error,
						{ itemIndex: i }
					);
					returnData.push({
						json: {
							error: (error as Error).message,
							request: requestConfig
						},
						pairedItem: { item: i },
						error: executionError
					});
				} else {
					throw new NodeOperationError(
						this.getNode(),
						error as Error,
						{ itemIndex: i }
					);
				}
			}
		}

		return [returnData];
	}
}
