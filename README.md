# n8n-nodes-hostinger-api

This is an n8n community node. It lets you use Hostinger API in your n8n workflows.

Hostinger API allows you to manage your virtual private servers, domains, billing, email marketing, and more. Automate provisioning, monitor resources, and perform various administrative actions programmatically.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

The Hostinger API node supports the following operations:

- **Server Management**
	- List VPS instances
	- Start/Stop/Restart/Purchase a VPS
	- Reinstall operating system
	- Reset root password
	- Manage SSH keys and post-install scripts

- **Domain Management**
	- List domains and check availability
	- Purchase and manage domains
	- Configure privacy protection and domain lock
	- Manage DNS zones and records
	- Domain forwarding and WHOIS profiles

- **Monitoring**
	- Fetch VPS resource usage (CPU, RAM, Disk)
	- Get server status and uptime
	- View action history

- **Networking**
	- Manage IP addresses and PTR records
	- Configure firewall rules
	- Enable/disable backups and snapshots
	- Malware scanner integration

- **Provisioning**
	- Create new VPS instance
	- Delete VPS instance
	- Manage data centers and templates

- **Billing**
	- View catalog and pricing
	- Manage payment methods and subscriptions

- **Email Marketing (Reach)**
	- List and manage email contacts
	- Create new contacts with custom fields
	- Delete contacts by UUID
	- Manage contact groups
	- Filter contacts by subscription status

## Credentials

To use this node, you will need to authenticate with the Hostinger API.

1. **Sign up** for a Hostinger account and obtain a VPS.
2. **Obtain API Access**:
	- Hostinger provides API tokens via your account dashboard or API settings (refer to official API docs).
3. **Set up credentials in n8n**:
	- Go to **Settings > Credentials** in n8n.
	- Add a new set of credentials for **Hostinger API** using:
		- **API Key**

## Compatibility

No known version incompatibilities at this time.

## Usage

1. **Add the Hostinger API node** to your workflow.
2. **Select the desired operation** (e.g., Start VPS, Create Contact, Check Domain).
3. **Provide required parameters**, such as VPS ID, contact details, domain name, etc.
4. **Execute the workflow** and automate your Hostinger management tasks.

For more complex workflows, combine this node with standard n8n nodes such as HTTP Request, Function, and Set.

Helpful link for beginners: [Try it out](https://docs.n8n.io/try-it-out/)

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Hostinger API documentation](https://developers.hostinger.com/)
* [Hostinger VPS Overview](https://www.hostinger.com/vps-hosting)

## Version history

- **v1.0.5**:
	- Added Email Marketing (Reach) endpoints

- **v1.0.4**:
	- Added Purchase VM Method
	- Added Billing methods
	- Added Domain Portfolio methods
	- Added Domain WHOIS methods
	- Added Domain Forwarding methods
	
- **v1.0.3**:
	- No significant changes
- **v1.0.2**:
	- Fixed inputs on category selection
- **v1.0.1**:
	- Added `User-Agent` header
- **v1.0.0**:
	- Initial release
	- Supports full suite of VPS operations including server management, monitoring, and networking.
