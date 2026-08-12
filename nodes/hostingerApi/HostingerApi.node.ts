import {
	ApplicationError,
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodePropertyOptions,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

// Kept out of the node description so that product names such as DNS and VPS are
// not singularized into DN and VP by the resource naming lint rule.
const resourceOptions: INodePropertyOptions[] = [
	{ name: 'Billing', value: 'billing' },
	{ name: 'DNS', value: 'dns' },
	{ name: 'Domain', value: 'domain' },
	{ name: 'Domain Forwarding', value: 'domainForwarding' },
	{ name: 'Domain WHOIS', value: 'whois' },
	{ name: 'Reach', value: 'reach' },
	{ name: 'Reach Contact Fields', value: 'reachContactFields' },
	{ name: 'Reach Segments', value: 'reachSegments' },
	{ name: 'Reach Tags', value: 'reachTags' },
	{ name: 'VPS', value: 'vps' },
	{ name: 'VPS Actions', value: 'vpsActions' },
	{ name: 'VPS Backups', value: 'vpsBackups' },
	{ name: 'VPS Data Centers', value: 'vpsDataCenters' },
	{ name: 'VPS Docker Manager', value: 'vpsDocker' },
	{ name: 'VPS Firewall', value: 'vpsFirewall' },
	{ name: 'VPS Malware Scanner', value: 'vpsMonarx' },
	{ name: 'VPS Post Install Scripts', value: 'vpsScripts' },
	{ name: 'VPS PTR', value: 'vpsPTR' },
	{ name: 'VPS Public Keys', value: 'vpsPublicKeys' },
	{ name: 'VPS Snapshots', value: 'vpsSnapshots' },
	{ name: 'VPS Templates', value: 'vpsTemplates' },
];

export class HostingerApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Hostinger API',
		name: 'hostingerApi',
		icon: { light: 'file:hostingerLogo.svg', dark: 'file:hostingerLogo.dark.svg' },
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
				options: resourceOptions,
				default: 'vps',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Action', value: 'getAction', action: 'Get VPS action' },
					{ name: 'List Actions', value: 'listActions', action: 'List VPS actions' },
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
					{ name: 'Create Project', value: 'createProject', action: 'Create docker project' },
					{ name: 'Delete Project', value: 'deleteProject', action: 'Delete docker project' },
					{ name: 'Get Project Logs', value: 'getLogs', action: 'Get docker project logs' },
					{ name: 'List Containers', value: 'listContainers', action: 'List docker containers' },
					{ name: 'List Contents', value: 'listContents', action: 'List docker containers content' },
					{ name: 'List Projects', value: 'listProjects', action: 'List docker projects' },
					{ name: 'Restart Project', value: 'restartProject', action: 'Restart docker project' },
					{ name: 'Start Project', value: 'startProject', action: 'Start docker project' },
					{ name: 'Stop Project', value: 'stopProject', action: 'Stop docker project' },
					{ name: 'Update Project', value: 'updateProject', action: 'Update docker project' },
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
					{ name: 'Delete Backup', value: 'deleteBackup', action: 'Delete VPS backup' },
					{ name: 'List Backups', value: 'listBackups', action: 'List VPS backups' },
					{ name: 'Restore Backup', value: 'restoreBackup', action: 'Restore VPS backup' },
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
					{ name: 'List Data Centers', value: 'listDataCenters', action: 'List VPS data centers' },
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
					{ name: 'Create PTR', value: 'createPTR', action: 'Create PTR record' },
					{ name: 'Delete PTR', value: 'deletePTR', action: 'Delete PTR record' },
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
					{ name: 'Firewall Activate', value: 'activateFirewall', action: 'Activate VPS firewall' },
					{ name: 'Firewall Create', value: 'createFirewall', action: 'Create VPS firewall' },
					{ name: 'Firewall Deactivate', value: 'deactivateFirewall', action: 'Deactivate VPS firewall' },
					{ name: 'Firewall Delete', value: 'deleteFirewall', action: 'Delete VPS firewall' },
					{ name: 'Firewall Get', value: 'getFirewall', action: 'Get VPS firewall' },
					{ name: 'Firewall List', value: 'listFirewalls', action: 'List VPS firewalls' },
					{ name: 'Firewall Rule Create', value: 'createFirewallRule', action: 'Create VPS firewall rule' },
					{ name: 'Firewall Rule Delete', value: 'deleteFirewallRule', action: 'Delete VPS firewall rule' },
					{ name: 'Firewall Rule Update', value: 'updateFirewallRule', action: 'Update VPS firewall rule' },
					{ name: 'Firewall Sync', value: 'syncFirewall', action: 'Sync VPS firewall' },
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
					{ name: 'Get Monarx', value: 'getMonarx', action: 'Get VPS malware scanner status' },
					{ name: 'Add Monarx', value: 'addMonarx', action: 'Add VPS malware scanner' },
					{ name: 'Remove Monarx', value: 'removeMonarx', action: 'Remove VPS malware scanner' },
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
					{ name: 'Get Template', value: 'getTemplate', action: 'Get VPS template' },
					{ name: 'List Templates', value: 'listTemplates', action: 'List VPS templates' },
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
					{ name: 'Post Install Script Create', value: 'createPostInstallScript', action: 'Create VPS post install script' },
					{ name: 'Post Install Script Delete', value: 'deletePostInstallScript', action: 'Delete VPS post install script' },
					{ name: 'Post Install Script Get', value: 'getPostInstallScript', action: 'Get VPS post install script' },
					{ name: 'Post Install Script List', value: 'listPostInstallScripts', action: 'List VPS post install scripts' },
					{ name: 'Post Install Script Update', value: 'updatePostInstallScript', action: 'Update VPS post install script' },
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
					{ name: 'Attach Public Key', value: 'attachPublicKey', action: 'Attach VPS public key' },
					{ name: 'Delete Public Key', value: 'deletePublicKey', action: 'Delete VPS public key' },
					{ name: 'List Public Keys', value: 'listPublicKeys', action: 'List VPS public keys' },
					{ name: 'Create Public Key', value: 'createPublicKey', action: 'Create VPS public key' },
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
					{ name: 'Get Snapshot', value: 'getSnapshot', action: 'Get VPS snapshot' },
					{ name: 'Create Snapshot', value: 'createSnapshot', action: 'Create VPS snapshot' },
					{ name: 'Delete Snapshot', value: 'deleteSnapshot', action: 'Delete VPS snapshot' },
					{ name: 'Restore Snapshot', value: 'restoreSnapshot', action: 'Restore VPS snapshot' },
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
					{ name: 'Get Metrics', value: 'getVmMetrics', action: 'Get VPS metrics' },
					{ name: 'Get Public Keys', value: 'getVmPublicKeys', action: 'Get VPS public keys' },
					{ name: 'Get VPS', value: 'getVm', action: 'Get VPS' },
					{ name: 'Hostname Reset', value: 'resetHostname', action: 'Reset VPS hostname' },
					{ name: 'Hostname Update', value: 'updateHostname', action: 'Update VPS hostname' },
					{ name: 'List VPS', value: 'listVms', action: 'List VPS' },
					{ name: 'Purchase New VPS', value: 'purchaseVm', action: 'Purchase new VPS' },
					{ name: 'Recreate', value: 'recreateVm', action: 'Recreate VPS' },
					{ name: 'Restart', value: 'restartVm', action: 'Restart VPS' },
					{ name: 'Setup', value: 'setupVm', action: 'Setup VPS' },
					{ name: 'Start', value: 'startVm', action: 'Start VPS' },
					{ name: 'Start Recovery', value: 'createRecovery', action: 'Start VPS recovery mode' },
					{ name: 'Stop', value: 'stopVm', action: 'Stop VPS' },
					{ name: 'Stop Recovery', value: 'deleteRecovery', action: 'Stop VPS recovery mode' },
					{ name: 'Update Nameservers', value: 'updateNameservers', action: 'Update VPS nameservers' },
					{ name: 'Update Panel Password', value: 'updatePanelPassword', action: 'Update VPS control panel password' },
					{ name: 'Update Root Password', value: 'updateRootPassword', action: 'Update VPS root password' },
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
					{ name: 'DNS Snapshot Get', value: 'getDnsSnapshot', action: 'Get DNS snapshot' },
					{ name: 'DNS Snapshot List', value: 'listDnsSnapshots', action: 'List DNS snapshots' },
					{ name: 'DNS Snapshot Restore', value: 'restoreDnsSnapshot', action: 'Restore DNS snapshot' },
					{ name: 'DNS Zone Delete', value: 'deleteDnsZone', action: 'Delete DNS zone' },
					{ name: 'DNS Zone Get', value: 'getDnsZone', action: 'Get DNS zone' },
					{ name: 'DNS Zone Reset', value: 'resetDnsZone', action: 'Reset DNS zone' },
					{ name: 'DNS Zone Update', value: 'updateDnsZone', action: 'Update DNS zone' },
					{ name: 'DNS Zone Validate', value: 'validateDnsZone', action: 'Validate DNS zone' },
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
					{ name: 'Check Domain Availability', value: 'checkDomainAvailability', action: 'Check domain availability', },
					{ name: 'Disable Domain Lock', value: 'disableDomainLock', action: 'Disable domain lock' },
					{ name: 'Disable Privacy Protection', value: 'disablePrivacyProtection', action: 'Disable domain privacy protection' },
					{ name: 'Enable Domain Lock', value: 'enableDomainLock', action: 'Enable domain lock' },
					{ name: 'Enable Privacy Protection', value: 'enablePrivacyProtection', action: 'Enable domain privacy protection' },
					{ name: 'Get Domain', value: 'getDomain', action: 'Get a domain' },
					{ name: 'List Domains', value: 'listDomains', action: 'List domains' },
					{ name: 'Purchase Domain', value: 'purchaseDomain', action: 'Purchase domain' },
					{ name: 'Update Nameservers', value: 'updateDomainNameservers', action: 'Update domain nameservers' },
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
					{ name: 'Create WHOIS Profile', value: 'createWhoisProfile', action: 'Create WHOIS profile' },
					{ name: 'Delete WHOIS Profile', value: 'deleteWhoisProfile', action: 'Delete WHOIS profile' },
					{ name: 'Get WHOIS Profile', value: 'getWhoisProfile', action: 'Get WHOIS profile' },
					{ name: 'Get WHOIS Profile Usage', value: 'getWhoisProfileUsage', action: 'Get WHOIS profile usage' },
					{ name: 'List WHOIS Profiles', value: 'listWhoisProfiles', action: 'List WHOIS profiles' },
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
					{ name: 'Get Forwarding Data', value: 'getForwardingData', action: 'Get domain forwarding' },
					{ name: 'Delete Forwarding Data', value: 'deleteForwardingData', action: 'Delete domain forwarding' },
					{ name: 'Create Forwarding Data', value: 'createForwardingData', action: 'Create domain forwarding' },
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
					{ name: 'Cancel Subscription', value: 'deleteSubscription', action: 'Cancel subscription' },
					{ name: 'Delete Payment Method', value: 'deletePaymentMethod', action: 'Delete payment method' },
					{ name: 'Get Catalog Item List', value: 'getCatalogList', action: 'Get catalog item list' },
					{ name: 'Get Payment Method List', value: 'getPaymentList', action: 'Get payment method list' },
					{ name: 'Get Subscription List', value: 'getSubscriptionList', action: 'Get subscription list' },
					{ name: 'Set Default Payment Method', value: 'setPaymentMethod', action: 'Set default payment method' },
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
					{ name: 'Create Contact', value: 'createContact', action: 'Create reach contact', description: 'Deprecated: use Create Profile Contact to target an explicit profile' },
					{ name: 'Create Contacts in Bulk', value: 'createProfileContactsBulk', action: 'Create reach profile contacts in bulk' },
					{ name: 'Create Profile Contact', value: 'createProfileContact', action: 'Create reach profile contact' },
					{ name: 'Delete Contact', value: 'deleteContact', action: 'Delete reach contact', description: 'Deprecated: use Delete Profile Contact to target an explicit profile' },
					{ name: 'Delete Profile Contact', value: 'deleteProfileContact', action: 'Delete reach profile contact' },
					{ name: 'Get Profile Contact', value: 'getProfileContact', action: 'Get reach profile contact' },
					{ name: 'Get Segment', value: 'getSegment', action: 'Get reach segment', description: 'Deprecated: use Reach Segments to target an explicit profile' },
					{ name: 'Get Segment Contacts', value: 'getSegmentContacts', action: 'Get reach segment contacts', description: 'Deprecated: use Reach Segments to target an explicit profile' },
					{ name: 'List Contacts', value: 'listContacts', action: 'List reach contacts', description: 'Deprecated: use List Profile Contacts to target an explicit profile' },
					{ name: 'List Profile Contacts', value: 'listProfileContacts', action: 'List reach profile contacts' },
					{ name: 'List Profiles', value: 'listProfiles', action: 'List reach profiles' },
					{ name: 'List Segments', value: 'listSegments', action: 'List reach segments', description: 'Deprecated: use Reach Segments to target an explicit profile' },
					{ name: 'Update Profile Contact', value: 'updateProfileContact', action: 'Update reach profile contact' },
				],
				default: 'listProfileContacts',
				displayOptions: {
					show: {
						resource: ['reach']
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Create Contact Field', value: 'createContactField', action: 'Create reach contact field' },
					{ name: 'Delete Contact Field', value: 'deleteContactField', action: 'Delete reach contact field' },
					{ name: 'List Contact Fields', value: 'listContactFields', action: 'List reach contact fields' },
					{ name: 'Update Contact Field', value: 'updateContactField', action: 'Update reach contact field' },
				],
				default: 'listContactFields',
				displayOptions: {
					show: {
						resource: ['reachContactFields']
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Count Profile Segment Contacts', value: 'countProfileSegmentContacts', action: 'Count reach profile segment contacts' },
					{ name: 'Create Profile Segment', value: 'createProfileSegment', action: 'Create reach profile segment' },
					{ name: 'Delete Profile Segment', value: 'deleteProfileSegment', action: 'Delete reach profile segment' },
					{ name: 'Get Profile Segment', value: 'getProfileSegment', action: 'Get reach profile segment' },
					{ name: 'List Profile Segment Contacts', value: 'listProfileSegmentContacts', action: 'List reach profile segment contacts' },
					{ name: 'List Profile Segments', value: 'listProfileSegments', action: 'List reach profile segments' },
					{ name: 'Update Profile Segment', value: 'updateProfileSegment', action: 'Update reach profile segment' },
				],
				default: 'listProfileSegments',
				displayOptions: {
					show: {
						resource: ['reachSegments']
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Assign Tag to Contact', value: 'assignTagToContact', action: 'Assign reach tag to contact' },
					{ name: 'Assign Tag to Contacts', value: 'assignTagToContacts', action: 'Assign reach tag to multiple contacts' },
					{ name: 'Create Tags', value: 'createTags', action: 'Create reach tags' },
					{ name: 'Delete Tag', value: 'deleteTag', action: 'Delete reach tag' },
					{ name: 'List Tags', value: 'listTags', action: 'List reach tags' },
					{ name: 'Remove Tag From Contact', value: 'removeTagFromContact', action: 'Remove reach tag from contact' },
					{ name: 'Remove Tag From Contacts', value: 'removeTagFromContacts', action: 'Remove reach tag from multiple contacts' },
					{ name: 'Update Tag', value: 'updateTag', action: 'Update reach tag' },
				],
				default: 'listTags',
				displayOptions: {
					show: {
						resource: ['reachTags']
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
				default: 1077,
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
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates', 'domain'],
						operation: ['updateNameservers', 'updateDomainNameservers']
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
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates', 'domain'],
						operation: ['updateNameservers', 'updateDomainNameservers']
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
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates', 'domain'],
						operation: ['updateNameservers', 'updateDomainNameservers']
					}
				}
			},
			{
				displayName: 'Nameserver 4',
				name: 'ns4',
				type: 'string',
				default: '',
				placeholder: '4.3.2.5',
				description: 'Quaternary nameserver IP address (optional)',
				displayOptions: {
					show: {
						resource: ['vps', 'vpsActions', 'vpsBackups', 'vpsDataCenters', 'vpsDocker', 'vpsFirewall', 'vpsMonarx', 'vpsScripts', 'vpsPTR', 'vpsPublicKeys', 'vpsSnapshots', 'vpsTemplates', 'domain'],
						operation: ['updateNameservers', 'updateDomainNameservers']
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
				required: true,
				placeholder: 'my-new-domain.tld',
				description: 'Full domain name (including TLD)',
				displayOptions: {
					show: {
						resource: ['domain', 'whois', 'domainForwarding'],
						operation: [
							'getDomain', 'enableDomainLock', 'disableDomainLock',
							'enablePrivacyProtection', 'disablePrivacyProtection',
							'updateDomainNameservers', 'getForwardingData',
							'deleteForwardingData', 'purchaseDomain'
						]
					}
				}
			},
			{
				displayName: 'Domain Name',
				name: 'domainName',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'mydomain',
				description: 'Domain name to check availability (without TLD)',
				displayOptions: {
					show: {
						resource: ['domain', 'whois', 'domainForwarding'],
						operation: ['checkDomainAvailability']
					}
				}
			},
			{
				displayName: 'TLDs',
				name: 'tlds',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'com, net, org',
				description: 'Comma-separated list of TLDs to check (e.g., com, net, org)',
				displayOptions: {
					show: {
						resource: ['domain', 'whois', 'domainForwarding'],
						operation: ['checkDomainAvailability']
					}
				}
			},
			{
				displayName: 'With Alternatives',
				name: 'withAlternatives',
				type: 'boolean',
				default: true,
				description: 'Whether to include alternative domain suggestions',
				displayOptions: {
					show: {
						resource: ['domain', 'whois', 'domainForwarding'],
						operation: ['checkDomainAvailability']
					}
				}
			},
			{
				displayName: 'Item ID',
				name: 'itemId',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'hostingercom-domain-com-usd-1y',
				description: 'Catalog price item ID for the domain',
				displayOptions: {
					show: {
						resource: ['domain', 'whois', 'domainForwarding'],
						operation: ['purchaseDomain']
					}
				}
			},
			{
				displayName: 'Owner Contact ID',
				name: 'ownerContactId',
				type: 'number',
				default: '',
				placeholder: '741288',
				description: 'Owner contact WHOIS record ID',
				displayOptions: {
					show: {
						resource: ['domain', 'whois', 'domainForwarding'],
						operation: ['purchaseDomain']
					}
				}
			},
			{
				displayName: 'Admin Contact ID',
				name: 'adminContactId',
				type: 'number',
				default: '',
				placeholder: '546123',
				description: 'Administrative contact WHOIS record ID',
				displayOptions: {
					show: {
						resource: ['domain', 'whois', 'domainForwarding'],
						operation: ['purchaseDomain']
					}
				}
			},
			{
				displayName: 'Billing Contact ID',
				name: 'billingContactId',
				type: 'number',
				default: '',
				placeholder: '741288',
				description: 'Billing contact WHOIS record ID',
				displayOptions: {
					show: {
						resource: ['domain', 'whois', 'domainForwarding'],
						operation: ['purchaseDomain']
					}
				}
			},
			{
				displayName: 'Tech Contact ID',
				name: 'techContactId',
				type: 'number',
				default: '',
				placeholder: '741288',
				description: 'Technical contact WHOIS record ID',
				displayOptions: {
					show: {
						resource: ['domain', 'whois', 'domainForwarding'],
						operation: ['purchaseDomain']
					}
				}
			},
			{
				displayName: 'Additional Details (JSON)',
				name: 'additionalDetails',
				type: 'json',
				default: '{}',
				description: 'Additional registration data as JSON (depends on TLD)',
				displayOptions: {
					show: {
						resource: ['domain', 'whois', 'domainForwarding'],
						operation: ['purchaseDomain']
					}
				}
			},
			{
				displayName: 'Coupon Code',
				name: 'couponCode',
				type: 'string',
				default: '',
				placeholder: 'COUPON1',
				description: 'Discount coupon code',
				displayOptions: {
					show: {
						resource: ['domain', 'whois', 'domainForwarding'],
						operation: ['purchaseDomain']
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
				placeholder: '1327362',
				displayOptions: {
					show: {
						resource: ['billing', 'domain'],
						operation: ['setPaymentMethod', 'deletePaymentMethod', 'purchaseDomain']
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
							'createWhoisProfile', 'createForwardingData'
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
						operation: ['createContact', 'createProfileContact']
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
						operation: ['createContact', 'createProfileContact']
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
						operation: ['createContact', 'createProfileContact']
					}
				}
			},
			{
				displayName: 'Phone',
				name: 'contactPhone',
				type: 'string',
				default: '',
				placeholder: '+37060000000',
				description: 'Phone number of the contact in E.164 format',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['createContact', 'createProfileContact']
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
						operation: ['createContact', 'createProfileContact', 'createProfileContactsBulk']
					}
				}
			},


			{
				displayName: 'Contact UUID',
				name: 'contactUuid',
				type: 'string',
				required: true,
				default: '',
				description: 'UUID of the contact',
				displayOptions: {
					show: {
						resource: ['reach', 'reachTags'],
						operation: [
							'deleteContact', 'getProfileContact', 'updateProfileContact', 'deleteProfileContact', 'assignTagToContact', 'removeTagFromContact'
						]
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
						operation: ['listContacts', 'listProfileContacts']
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
						resource: ['reach', 'reachSegments'],
						operation: [
							'listContacts', 'listProfileContacts', 'listProfileSegments', 'listProfileSegmentContacts'
						]
					}
				}
			},
			{
				displayName: 'Per Page',
				name: 'perPage',
				type: 'number',
				default: 50,
				description: 'Number of results to return per page',
				displayOptions: {
					show: {
						resource: ['reach', 'reachSegments'],
						operation: ['listProfileContacts', 'listProfileSegments', 'listProfileSegmentContacts']
					}
				}
			},
			{
				displayName: 'Segment UUID',
				name: 'segmentUuid',
				type: 'string',
				required: true,
				default: '',
				description: 'UUID of the segment',
				displayOptions: {
					show: {
						resource: ['reach', 'reachSegments'],
						operation: [
							'getSegment', 'getSegmentContacts', 'getProfileSegment', 'updateProfileSegment', 'deleteProfileSegment', 'countProfileSegmentContacts', 'listProfileSegmentContacts'
						]
					}
				}
			},
			{
				displayName: 'Profile UUID',
				name: 'profileUuid',
				type: 'string',
				required: true,
				default: '',
				description: 'UUID of the Reach profile. Use the List Profiles operation to look it up.',
				displayOptions: {
					show: {
						resource: ['reach', 'reachContactFields', 'reachSegments', 'reachTags'],
						operation: [
							'listProfileContacts', 'createProfileContact', 'createProfileContactsBulk', 'getProfileContact', 'updateProfileContact', 'deleteProfileContact', 'listContactFields', 'createContactField', 'updateContactField', 'deleteContactField', 'listProfileSegments', 'createProfileSegment', 'getProfileSegment', 'updateProfileSegment', 'deleteProfileSegment', 'countProfileSegmentContacts', 'listProfileSegmentContacts', 'listTags', 'createTags', 'updateTag', 'deleteTag', 'assignTagToContact', 'assignTagToContacts', 'removeTagFromContact', 'removeTagFromContacts'
						]
					}
				}
			},
			{
				displayName: 'Tag UUID Filter',
				name: 'tagUuidFilter',
				type: 'string',
				default: '',
				description: 'Only return contacts assigned to this tag',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['listProfileContacts']
					}
				}
			},
			{
				displayName: 'Search',
				name: 'contactSearch',
				type: 'string',
				default: '',
				description: 'Search contacts by email, name or surname',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['listProfileContacts']
					}
				}
			},
			{
				displayName: 'Contacts (JSON)',
				name: 'bulkContacts',
				type: 'json',
				required: true,
				default: `[
				{
					"email": "contact@example.com",
					"name": "John",
					"surname": "Doe"
				}
				]`,
				description: 'Contacts to create. Each entry accepts email, name, surname and phone.',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['createProfileContactsBulk']
					}
				}
			},
			{
				displayName: 'Tag UUIDs',
				name: 'bulkContactTagUuids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tag UUIDs to assign to every created contact',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['createProfileContactsBulk']
					}
				}
			},
			{
				displayName: 'Email',
				name: 'contactUpdateEmail',
				type: 'string',
				default: '',
				description: 'New email address for the contact. Leave empty to keep the current value.',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['updateProfileContact']
					}
				}
			},
			{
				displayName: 'Name',
				name: 'contactUpdateName',
				type: 'string',
				default: '',
				description: 'New first name for the contact. Leave empty to keep the current value.',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['updateProfileContact']
					}
				}
			},
			{
				displayName: 'Surname',
				name: 'contactUpdateSurname',
				type: 'string',
				default: '',
				description: 'New last name for the contact. Leave empty to keep the current value.',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['updateProfileContact']
					}
				}
			},
			{
				displayName: 'Phone',
				name: 'contactUpdatePhone',
				type: 'string',
				default: '',
				placeholder: '+37060000000',
				description: 'New phone number in E.164 format. Leave empty to keep the current value.',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['updateProfileContact']
					}
				}
			},
			{
				displayName: 'Subscription Status',
				name: 'contactUpdateSubscriptionStatus',
				type: 'options',
				options: [
					{ name: 'Confirmed', value: 'confirmed', },
					{ name: 'Pending', value: 'pending', },
					{ name: 'Subscribed', value: 'subscribed', },
					{ name: 'Unchanged', value: '', },
					{ name: 'Unsubscribed', value: 'unsubscribed', },
				],
				default: '',
				description: 'New subscription status for the contact',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['updateProfileContact']
					}
				}
			},
			{
				displayName: 'Note',
				name: 'contactUpdateNote',
				type: 'string',
				default: '',
				description: 'New note for the contact (max 75 characters)',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['updateProfileContact']
					}
				}
			},
			{
				displayName: 'Custom Fields (JSON)',
				name: 'contactUpdateFields',
				type: 'json',
				default: '[]',
				description: 'Custom field values to set. Each entry needs the field uuid plus value or selected_option_uuids.',
				displayOptions: {
					show: {
						resource: ['reach'],
						operation: ['updateProfileContact']
					}
				}
			},
			{
				displayName: 'Field UUID',
				name: 'contactFieldUuid',
				type: 'string',
				required: true,
				default: '',
				description: 'UUID of the custom contact field',
				displayOptions: {
					show: {
						resource: ['reachContactFields'],
						operation: ['updateContactField', 'deleteContactField']
					}
				}
			},
			{
				displayName: 'Type',
				name: 'contactFieldType',
				type: 'options',
				options: [
					{ name: 'Date', value: 'date', },
					{ name: 'Multi Choice', value: 'multi_choice', },
					{ name: 'Number', value: 'number', },
					{ name: 'Single Choice', value: 'single_choice', },
					{ name: 'Text', value: 'text', },
				],
				default: 'text',
				description: 'Type of the custom contact field',
				displayOptions: {
					show: {
						resource: ['reachContactFields'],
						operation: ['createContactField']
					}
				}
			},
			{
				displayName: 'Label',
				name: 'contactFieldLabel',
				type: 'string',
				required: true,
				default: '',
				description: 'Label shown for the custom contact field',
				displayOptions: {
					show: {
						resource: ['reachContactFields'],
						operation: ['createContactField', 'updateContactField']
					}
				}
			},
			{
				displayName: 'Options',
				name: 'contactFieldOptions',
				type: 'string',
				default: '',
				description: 'Comma-separated list of choices. Required for single choice and multi choice fields.',
				displayOptions: {
					show: {
						resource: ['reachContactFields'],
						operation: ['createContactField']
					}
				}
			},
			{
				displayName: 'Options (JSON)',
				name: 'contactFieldUpdateOptions',
				type: 'json',
				default: '[]',
				description: 'Replaces the choice set. Entries with a uuid are relabelled, entries without one are created, and omitted choices are deleted along with the values contacts hold for them. Leave empty to keep the current choices.',
				displayOptions: {
					show: {
						resource: ['reachContactFields'],
						operation: ['updateContactField']
					}
				}
			},
			{
				displayName: 'Tag UUID',
				name: 'tagUuid',
				type: 'string',
				required: true,
				default: '',
				description: 'UUID of the tag',
				displayOptions: {
					show: {
						resource: ['reachTags'],
						operation: [
							'updateTag', 'deleteTag', 'assignTagToContact', 'assignTagToContacts', 'removeTagFromContact', 'removeTagFromContacts'
						]
					}
				}
			},
			{
				displayName: 'Tag Names',
				name: 'tagNames',
				type: 'string',
				required: true,
				default: '',
				description: 'Comma-separated list of tag names to create. Existing tags are returned as they are.',
				displayOptions: {
					show: {
						resource: ['reachTags'],
						operation: ['createTags']
					}
				}
			},
			{
				displayName: 'Tag Name',
				name: 'tagName',
				type: 'string',
				required: true,
				default: '',
				description: 'New name for the tag. Names are unique within a profile.',
				displayOptions: {
					show: {
						resource: ['reachTags'],
						operation: ['updateTag']
					}
				}
			},
			{
				displayName: 'Contact UUIDs',
				name: 'tagContactUuids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of contact UUIDs. Ignored when All Contacts is enabled.',
				displayOptions: {
					show: {
						resource: ['reachTags'],
						operation: ['assignTagToContacts', 'removeTagFromContacts']
					}
				}
			},
			{
				displayName: 'All Contacts',
				name: 'tagAllContacts',
				type: 'boolean',
				default: false,
				description: 'Whether to apply the change to every contact in the profile instead of a list of UUIDs',
				displayOptions: {
					show: {
						resource: ['reachTags'],
						operation: ['assignTagToContacts', 'removeTagFromContacts']
					}
				}
			},
			{
				displayName: 'Count Type',
				name: 'segmentCountType',
				type: 'options',
				options: [
					{ name: 'All', value: 'all', },
					{ name: 'Subscribed', value: 'subscribed', },
				],
				default: 'all',
				description: 'Which contacts to include in the returned segment counts',
				displayOptions: {
					show: {
						resource: ['reachSegments'],
						operation: ['listProfileSegments']
					}
				}
			},
			{
				displayName: 'Segment Name',
				name: 'segmentName',
				type: 'string',
				required: true,
				default: '',
				description: 'Name of the segment',
				displayOptions: {
					show: {
						resource: ['reachSegments'],
						operation: ['createProfileSegment', 'updateProfileSegment']
					}
				}
			},
			{
				displayName: 'Logic',
				name: 'segmentLogic',
				type: 'options',
				options: [
					{ name: 'AND', value: 'AND', },
					{ name: 'OR', value: 'OR', },
				],
				default: 'AND',
				description: 'Whether every condition must match or any single condition is enough',
				displayOptions: {
					show: {
						resource: ['reachSegments'],
						operation: ['createProfileSegment', 'updateProfileSegment']
					}
				}
			},
			{
				displayName: 'Conditions (JSON)',
				name: 'segmentConditions',
				type: 'json',
				required: true,
				default: `[
  {
    "attribute": "email",
    "operator": "contains",
    "value": "@example.com"
  }
]`,
				description: 'Segment conditions. Use cf:{fieldUuid} as the attribute to target a custom contact field.',
				displayOptions: {
					show: {
						resource: ['reachSegments'],
						operation: ['createProfileSegment']
					}
				}
			},
			{
				displayName: 'Conditions (JSON)',
				name: 'segmentUpdateConditions',
				type: 'json',
				default: '[]',
				description: 'Replaces the segment conditions. Use cf:{fieldUuid} as the attribute to target a custom contact field. Leave empty to rename the segment without touching its conditions.',
				displayOptions: {
					show: {
						resource: ['reachSegments'],
						operation: ['updateProfileSegment']
					}
				}
			}
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
			const getPathParam = (name: string) => encodeURIComponent(getParam(name));
			const getListParam = (name: string) => (this.getNodeParameter(name, i) as string)
				.split(',')
				.map(value => value.trim())
				.filter(value => value);
			const parseJsonParam = (name: string, displayName: string) => {
				const raw = this.getNodeParameter(name, i) as string;

				try {
					return JSON.parse(raw);
				} catch {
					throw new NodeOperationError(
						this.getNode(),
						`Parameter "${displayName}" contains invalid JSON`,
						{ itemIndex: i }
					);
				}
			};
			let method: IHttpRequestMethods = 'GET';
			let endpoint = '';
			let requestBody: IDataObject | undefined;

			try {
				// For Reach createContact, build request body from individual fields
				if (resource === 'reach' && (operation === 'createContact' || operation === 'createProfileContact')) {
					const contactEmail = this.getNodeParameter('contactEmail', i) as string;
					const contactName = this.getNodeParameter('contactName', i) as string;
					const contactSurname = this.getNodeParameter('contactSurname', i) as string;
					const contactPhone = this.getNodeParameter('contactPhone', i) as string;
					const contactNote = this.getNodeParameter('contactNote', i) as string;

					const contactData: IDataObject = {
						email: contactEmail
					};

					if (contactName) contactData.name = contactName;
					if (contactSurname) contactData.surname = contactSurname;
					if (contactPhone) contactData.phone = contactPhone;
					if (contactNote) contactData.note = contactNote;

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
				} else if (operation === 'checkDomainAvailability') {
					// For checkDomainAvailability, build request body from individual fields
					const domainName = this.getNodeParameter('domainName', i) as string;
					const tldsString = this.getNodeParameter('tlds', i) as string;
					const withAlternatives = this.getNodeParameter('withAlternatives', i) as boolean;

					// Convert comma-separated TLDs to array
					const tlds = tldsString.split(',').map(tld => tld.trim()).filter(tld => tld);

					requestBody = {
						domain: domainName,
						tlds: tlds
					};

					if (withAlternatives !== undefined) requestBody.with_alternatives = withAlternatives;
				} else if (operation === 'purchaseDomain') {
					// For purchaseDomain, build request body from individual fields
					const domain = this.getNodeParameter('domain', i) as string;
					const itemId = this.getNodeParameter('itemId', i) as string;
					const paymentMethodId = this.getNodeParameter('paymentMethodId', i) as number;
					const ownerContactId = this.getNodeParameter('ownerContactId', i) as number;
					const adminContactId = this.getNodeParameter('adminContactId', i) as number;
					const billingContactId = this.getNodeParameter('billingContactId', i) as number;
					const techContactId = this.getNodeParameter('techContactId', i) as number;
					const additionalDetailsStr = this.getNodeParameter('additionalDetails', i) as string;
					const couponCode = this.getNodeParameter('couponCode', i) as string;

					requestBody = {
						domain: domain,
						item_id: itemId
					};

					if (paymentMethodId) requestBody.payment_method_id = paymentMethodId;

					// Build domain_contacts object if any contact IDs are provided
					if (ownerContactId || adminContactId || billingContactId || techContactId) {
						const domainContacts: IDataObject = {};
						if (ownerContactId) domainContacts.owner_id = ownerContactId;
						if (adminContactId) domainContacts.admin_id = adminContactId;
						if (billingContactId) domainContacts.billing_id = billingContactId;
						if (techContactId) domainContacts.tech_id = techContactId;
						requestBody.domain_contacts = domainContacts;
					}

					// Parse additional_details JSON
					if (additionalDetailsStr && additionalDetailsStr !== '{}') {
						try {
							requestBody.additional_details = JSON.parse(additionalDetailsStr);
						} catch {
							requestBody.additional_details = {};
						}
					} else {
						requestBody.additional_details = {};
					}

					if (couponCode) requestBody.coupons = [couponCode];
				} else if (operation === 'updateDomainNameservers') {
					// For updateDomainNameservers, build request body from nameserver fields
					const ns1 = this.getNodeParameter('ns1', i) as string;
					const ns2 = this.getNodeParameter('ns2', i) as string;
					const ns3 = this.getNodeParameter('ns3', i) as string;
					const ns4 = this.getNodeParameter('ns4', i) as string;

					requestBody = { ns1 };

					if (ns2) requestBody.ns2 = ns2;
					if (ns3) requestBody.ns3 = ns3;
					if (ns4) requestBody.ns4 = ns4;
				} else if (operation === 'createProfileContactsBulk') {
					const contactNote = this.getNodeParameter('contactNote', i) as string;
					const tagUuids = getListParam('bulkContactTagUuids');

					requestBody = {
						contacts: parseJsonParam('bulkContacts', 'Contacts (JSON)')
					};

					if (tagUuids.length > 0) requestBody.tag_uuids = tagUuids;
					if (contactNote) requestBody.note = contactNote;
				} else if (operation === 'updateProfileContact') {
					const email = this.getNodeParameter('contactUpdateEmail', i) as string;
					const name = this.getNodeParameter('contactUpdateName', i) as string;
					const surname = this.getNodeParameter('contactUpdateSurname', i) as string;
					const phone = this.getNodeParameter('contactUpdatePhone', i) as string;
					const subscriptionStatus = this.getNodeParameter('contactUpdateSubscriptionStatus', i) as string;
					const note = this.getNodeParameter('contactUpdateNote', i) as string;
					const fields = this.getNodeParameter('contactUpdateFields', i) as string;

					requestBody = {};

					if (email) requestBody.email = email;
					if (name) requestBody.name = name;
					if (surname) requestBody.surname = surname;
					if (phone) requestBody.phone = phone;
					if (subscriptionStatus) requestBody.subscription_status = subscriptionStatus;
					if (note) requestBody.note = note;
					if (fields && fields !== '[]') requestBody.fields = parseJsonParam('contactUpdateFields', 'Custom Fields (JSON)');
				} else if (operation === 'createContactField') {
					const options = getListParam('contactFieldOptions');

					requestBody = {
						type: getParam('contactFieldType'),
						label: getParam('contactFieldLabel')
					};

					if (options.length > 0) requestBody.options = options;
				} else if (operation === 'updateContactField') {
					const options = this.getNodeParameter('contactFieldUpdateOptions', i) as string;

					requestBody = {
						label: getParam('contactFieldLabel')
					};

					if (options && options !== '[]') requestBody.options = parseJsonParam('contactFieldUpdateOptions', 'Options (JSON)');
				} else if (operation === 'createTags') {
					requestBody = { names: getListParam('tagNames') };
				} else if (operation === 'updateTag') {
					requestBody = { value: getParam('tagName') };
				} else if (operation === 'assignTagToContacts' || operation === 'removeTagFromContacts') {
					const allContacts = this.getNodeParameter('tagAllContacts', i) as boolean;

					requestBody = allContacts
						? { all_contacts: true }
						: { contact_uuids: getListParam('tagContactUuids') };
				} else if (operation === 'createProfileSegment') {
					requestBody = {
						name: getParam('segmentName'),
						logic: getParam('segmentLogic'),
						conditions: parseJsonParam('segmentConditions', 'Conditions (JSON)')
					};
				} else if (operation === 'updateProfileSegment') {
					const segmentConditions = this.getNodeParameter('segmentUpdateConditions', i) as string;

					requestBody = { name: getParam('segmentName') };

					// The API only accepts logic together with conditions, and leaves the
					// existing conditions alone when they are omitted.
					if (segmentConditions && segmentConditions !== '[]') {
						requestBody.logic = getParam('segmentLogic');
						requestBody.conditions = parseJsonParam('segmentUpdateConditions', 'Conditions (JSON)');
					}
				} else {
					// For other actions, use the request body field
					requestBody = parseJsonParam('requestBody', 'Request Body');
				}
			} catch (error) {
				// Invalid JSON supplied by the user must fail the item rather than send a
				// partial body. Everything else reaching this point is an operation with no
				// Request Body parameter to read, which correctly leaves the body unset.
				if (error instanceof NodeOperationError) {
					if (!continueOnFail) {
						throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
					}

					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
						error
					});
					continue;
				}
			}

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
				case 'listContacts': {
					let contactsEndpoint = `/api/reach/v1/contacts?page=${getParam('page')}`;
					const subscriptionStatus = this.getNodeParameter('subscriptionStatus', i) as string;

					if (subscriptionStatus) {
						contactsEndpoint += `&subscription_status=${subscriptionStatus}`;
					}
					endpoint = contactsEndpoint;
					break;
				}
				case 'createContact': method = 'POST'; endpoint = '/api/reach/v1/contacts'; break;
				case 'deleteContact': method = 'DELETE'; endpoint = `/api/reach/v1/contacts/${getParam('contactUuid')}`; break;
				case 'listSegments': method = 'GET'; endpoint = '/api/reach/v1/segmentation/segments'; break;
				case 'getSegment': method = 'GET'; endpoint = `/api/reach/v1/segmentation/segments/${getParam('segmentUuid')}`; break;
				case 'getSegmentContacts': method = 'GET'; endpoint = `/api/reach/v1/segmentation/segments/${getParam('segmentUuid')}/contacts`; break;
				//Reach - Profiles
				case 'listProfiles': method = 'GET'; endpoint = '/api/reach/v1/profiles'; break;
				//Reach - Profile contacts
				case 'listProfileContacts': {
					let profileContactsEndpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/contacts?page=${getParam('page')}&per_page=${getParam('perPage')}`;
					const profileSubscriptionStatus = this.getNodeParameter('subscriptionStatus', i) as string;
					const tagUuidFilter = this.getNodeParameter('tagUuidFilter', i) as string;
					const contactSearch = this.getNodeParameter('contactSearch', i) as string;

					if (profileSubscriptionStatus) {
						profileContactsEndpoint += `&subscription_status=${profileSubscriptionStatus}`;
					}

					if (tagUuidFilter) {
						profileContactsEndpoint += `&tag_uuid=${encodeURIComponent(tagUuidFilter)}`;
					}

					if (contactSearch) {
						profileContactsEndpoint += `&search=${encodeURIComponent(contactSearch)}`;
					}

					endpoint = profileContactsEndpoint;
					break;
				}
				case 'createProfileContact': method = 'POST'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/contacts`; break;
				case 'createProfileContactsBulk': method = 'POST'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/contacts/bulk`; break;
				case 'getProfileContact': method = 'GET'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/contacts/${getPathParam('contactUuid')}`; break;
				case 'updateProfileContact': method = 'PATCH'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/contacts/${getPathParam('contactUuid')}`; break;
				case 'deleteProfileContact': method = 'DELETE'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/contacts/${getPathParam('contactUuid')}`; break;
				//Reach - Contact fields
				case 'listContactFields': method = 'GET'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/contacts/fields`; break;
				case 'createContactField': method = 'POST'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/contacts/fields`; break;
				case 'updateContactField': method = 'PATCH'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/contacts/fields/${getPathParam('contactFieldUuid')}`; break;
				case 'deleteContactField': method = 'DELETE'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/contacts/fields/${getPathParam('contactFieldUuid')}`; break;
				//Reach - Tags
				case 'listTags': method = 'GET'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/tags`; break;
				case 'createTags': method = 'POST'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/tags`; break;
				case 'updateTag': method = 'PATCH'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/tags/${getPathParam('tagUuid')}`; break;
				case 'deleteTag': method = 'DELETE'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/tags/${getPathParam('tagUuid')}`; break;
				case 'assignTagToContact': method = 'POST'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/tags/${getPathParam('tagUuid')}/contacts/${getPathParam('contactUuid')}`; break;
				case 'assignTagToContacts': method = 'POST'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/tags/${getPathParam('tagUuid')}/contacts`; break;
				case 'removeTagFromContact': method = 'DELETE'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/tags/${getPathParam('tagUuid')}/contacts/${getPathParam('contactUuid')}`; break;
				case 'removeTagFromContacts': method = 'DELETE'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/tags/${getPathParam('tagUuid')}/contacts`; break;
				//Reach - Profile segments
				case 'listProfileSegments': method = 'GET'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/segmentation/segments?page=${getParam('page')}&per_page=${getParam('perPage')}&count_type=${getParam('segmentCountType')}`; break;
				case 'createProfileSegment': method = 'POST'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/segmentation/segments`; break;
				case 'getProfileSegment': method = 'GET'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/segmentation/segments/${getPathParam('segmentUuid')}`; break;
				case 'updateProfileSegment': method = 'PUT'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/segmentation/segments/${getPathParam('segmentUuid')}`; break;
				case 'deleteProfileSegment': method = 'DELETE'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/segmentation/segments/${getPathParam('segmentUuid')}`; break;
				case 'countProfileSegmentContacts': method = 'GET'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/segmentation/segments/${getPathParam('segmentUuid')}/count`; break;
				case 'listProfileSegmentContacts': method = 'GET'; endpoint = `/api/reach/v1/profiles/${getPathParam('profileUuid')}/segmentation/segments/${getPathParam('segmentUuid')}/contacts?page=${getParam('page')}&per_page=${getParam('perPage')}`; break;

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
