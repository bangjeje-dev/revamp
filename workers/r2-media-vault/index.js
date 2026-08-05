/**
 * bangjeje.dev Studio V2 — Cloudflare R2 Media Vault Edge Worker
 * Handles production file uploads directly into Cloudflare R2 Object Storage buckets.
 * Returns canonical public CDN URL references with zero-latency global delivery.
 */

export default {
  async fetch(request, env, ctx) {
    // 1. CORS Headers for Studio V2 Dashboard & Editorial Web Application
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Studio-Timestamp, X-Asset-Hash',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 2. Route Handling: UPLOAD TO CLOUDFLARE R2 VAULT (POST /upload or PUT /upload)
    const url = new URL(request.url);
    if (request.method === 'POST' || request.method === 'PUT') {
      try {
        const contentType = request.headers.get('content-type') || '';
        if (!contentType.includes('multipart/form-data')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Unsupported media payload: Request must be multipart/form-data' }),
            { status: 415, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const formData = await request.formData();
        const file = formData.get('file');
        const customFilename = formData.get('filename');
        const clientHash = formData.get('hash') || request.headers.get('X-Asset-Hash');

        if (!file || !(file instanceof File)) {
          return new Response(
            JSON.stringify({ success: false, error: 'No valid file attached to upload stream' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // MIME Type Security Verification (Only allow validated media formats)
        const allowedMimePrefixes = ['image/', 'video/', 'audio/', 'application/pdf', 'application/zip'];
        const isMimeValid = allowedMimePrefixes.some(prefix => file.type.startsWith(prefix));
        if (!isMimeValid) {
          return new Response(
            JSON.stringify({ success: false, error: `Unsupported MIME Type (${file.type}). Exclusively media attachments are permitted in Studio V2.` }),
            { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // File Size Guard (Max 25 MB per asset)
        const maxSizeBytes = 25 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
          return new Response(
            JSON.stringify({ success: false, error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum allowed threshold of 25MB.` }),
            { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Generate sanitized unique filename for R2 bucket path
        const fileExt = file.name.split('.').pop().toLowerCase() || 'webp';
        const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
        const uniqueSuffix = Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
        const targetObjectKey = customFilename ? customFilename : `vault/${rawName}_${uniqueSuffix}.${fileExt}`;

        // Stream binary data directly to Cloudflare R2 Bucket Binding
        const arrayBuffer = await file.arrayBuffer();
        await env.STUDIO_MEDIA_VAULT.put(targetObjectKey, arrayBuffer, {
          httpMetadata: {
            contentType: file.type,
            cacheControl: 'public, max-age=31536000, immutable',
          },
          customMetadata: {
            originalName: file.name,
            uploadedBy: 'Studio-V2-Editorial-OS',
            clientHash: clientHash || 'none',
            timestamp: new Date().toISOString()
          }
        });

        // Compute Public Canonical CDN Edge URL (Custom Custom Domain or Managed Workers Domain)
        const cdnBaseDomain = env.CDN_DOMAIN || 'https://cdn.bangjeje.dev';
        const publicCdnUrl = `${cdnBaseDomain}/${targetObjectKey}`;

        return new Response(
          JSON.stringify({
            success: true,
            objectKey: targetObjectKey,
            url: publicCdnUrl,
            filename: file.name,
            mimeType: file.type,
            size: file.size,
            sizeFormatted: `${Math.max(1, Math.round(file.size / 1024))} KB`,
            uploadedAt: new Date().toISOString(),
            message: 'Asset encrypted and broadcast to Cloudflare R2 Edge nodes successfully.'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (err) {
        console.error('Cloudflare R2 Worker Upload Error:', err);
        return new Response(
          JSON.stringify({ success: false, error: `Edge Worker Exception: ${err.message || 'Unknown server storage failure'}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 3. Route Handling: GET ASSET FROM R2 BUCKET (If direct Worker proxy is used)
    if (request.method === 'GET') {
      const objectKey = url.pathname.slice(1);
      if (!objectKey) {
        return new Response('bangjeje.dev Studio V2 Cloudflare R2 Edge Worker V1.0 - Operational ⚡', { status: 200, headers: corsHeaders });
      }

      const object = await env.STUDIO_MEDIA_VAULT.get(objectKey);
      if (!object) {
        return new Response('Asset not found in Cloudflare R2 Media Vault', { status: 404, headers: corsHeaders });
      }

      const headers = new Headers(corsHeaders);
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      return new Response(object.body, { headers });
    }

    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }
};
