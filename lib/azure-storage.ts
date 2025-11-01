import { BlobServiceClient, ContainerClient } from '@azure/storage-blob'

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'uploads'

let blobServiceClient: BlobServiceClient | null = null

function getBlobServiceClient(): BlobServiceClient {
  if (!accountName || !accountKey) {
    throw new Error('Azure Storage credentials are not configured')
  }

  if (!blobServiceClient) {
    blobServiceClient = BlobServiceClient.fromConnectionString(
      `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`
    )
  }

  return blobServiceClient
}

export function getContainerClient(): ContainerClient {
  return getBlobServiceClient().getContainerClient(containerName)
}

export async function uploadBlob(
  buffer: Buffer,
  blobName: string,
  contentType: string
): Promise<string> {
  const containerClient = getContainerClient()
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: contentType,
    },
  })

  return blockBlobClient.url
}

export async function deleteBlob(blobName: string): Promise<boolean> {
  try {
    const containerClient = getContainerClient()
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    await blockBlobClient.delete()
    return true
  } catch (error) {
    if ((error as any)?.statusCode !== 404) {
      console.error('Delete blob error:', error)
    }
    return false
  }
}

export function getBlobUrl(blobName: string): string {
  const containerClient = getContainerClient()
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  return blockBlobClient.url
}

export function extractBlobNameFromUrl(url: string): string | null {
  if (!url) return null
  
  const match = url.match(/\.blob\.core\.windows\.net\/[^\/]+\/(.+)$/)
  if (match) {
    return match[1]
  }
  
  return null
}
