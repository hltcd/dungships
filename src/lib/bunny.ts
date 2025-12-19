import crypto from 'crypto';

/**
 * Generates a signed URL for Bunny.net Stream (Video Delivery)
 * Formula: sha256(securityKey + videoId + expires)
 */
export function signBunnyStreamUrl(videoId: string, libraryId: string, securityKey: string, expirationTimeInSeconds: number = 21600) {
    // Default expiration: 6 hours
    const expires = Math.floor(Date.now() / 1000) + expirationTimeInSeconds;
    const hashableBase = securityKey + videoId + expires;
    const token = crypto.createHash('sha256').update(hashableBase).digest('hex');
    
    return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expires}`;
}

/**
 * Extracts libraryId and videoId from a Bunny.net embed URL
 * Example: https://iframe.mediadelivery.net/embed/123/456
 */
export function parseBunnyEmbedUrl(url: string) {
    const match = url.match(/iframe\.mediadelivery\.net\/embed\/(\d+)\/([a-zA-Z0-9-]+)/);
    if (match) {
        return {
            libraryId: match[1],
            videoId: match[2]
        };
    }
    return null;
}
