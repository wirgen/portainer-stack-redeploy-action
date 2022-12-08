# Portainer stack redeploy action

This action allows you to update the stack with pull new images if you can't use webhooks. For example, in Portainer Community Edition.

## Inputs

### `portainerUrl`

**Required** URL to the application instance. For example, https://example.com:9443

### `accessToken`

**Required** Token for API requests, can be created on the page https://example.com:9443/#!/account/tokens/new

### `stackId`

**Required** ID of stack to be updated. Must be integer

### `endpointId`

ID of endpoint (environment). Required if your stack is not in local environment

## Example usage

```yaml
uses:  wirgen/portainer-stack-redeploy-action@v1.1
with:
  portainerUrl: 'https://example.com:9443'
  accessToken: 'ptr_XXXyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy'
  stackId: 8
  endpointId: 3
```
