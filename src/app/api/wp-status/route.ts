import { NextResponse } from 'next/server';
import {
  getWordPressApiUrl,
  getWordPressDiscoveryUrl,
  getWordPressSiteUrl,
  isWordPressConfigured,
} from '@/lib/wordpress';

export const dynamic = 'force-dynamic';

export type WordPressDiagnosticStatus =
  | 'not_configured'
  | 'unreachable'
  | 'invalid_response'
  | 'connected_empty'
  | 'connected';

export interface WordPressStatusPayload {
  live: boolean;
  status: WordPressDiagnosticStatus;
  endpoint: string;
  url: string;
  siteUrl: string;
  discoveryEndpoint: string;
  statusCode: number;
  httpStatus: number;
  latencyMs: number;
  postsCount: number;
  contentType: string | null;
  discovery: boolean;
  isJson: boolean;
  hasValidPostsArray: boolean;
  lastChecked: string;
  error?: string;
  message: string;
}

export async function GET(req: Request) {
  const startTime = Date.now();

  // This endpoint only probes the configured CMS. Accepting arbitrary URL
  // parameters here would turn it into an SSRF proxy.
  const customTarget: string | null = null;

  // 1. Verify environment configuration (unless testing a custom target URL)
  if (!customTarget && !isWordPressConfigured()) {
    return NextResponse.json<WordPressStatusPayload>({
      live: false,
      status: 'not_configured',
      endpoint: '',
      url: '',
      siteUrl: '',
      discoveryEndpoint: '',
      statusCode: 0,
      httpStatus: 0,
      latencyMs: 0,
      postsCount: 0,
      contentType: null,
      discovery: false,
      isJson: false,
      hasValidPostsArray: false,
      lastChecked: new Date().toISOString(),
      message:
        'WordPress CMS is not configured. Set WORDPRESS_SITE_URL or WORDPRESS_API_URL in environment variables.',
    });
  }

  let wpApiUrl = getWordPressApiUrl();
  if (!wpApiUrl.includes('/wp-json/wp/v2')) {
    if (wpApiUrl.endsWith('/wp-json')) {
      wpApiUrl = `${wpApiUrl}/wp/v2`;
    } else {
      wpApiUrl = `${wpApiUrl}/wp-json/wp/v2`;
    }
  }

  const wpSiteUrl = getWordPressSiteUrl();

  const wpDiscoveryUrl = wpApiUrl.replace(/\/wp\/v2\/?$/, '');
  const postsUrl = `${wpApiUrl}/posts?per_page=1&_fields=id,title,slug,date`;

  let latencyMs = 0;
  let httpStatus = 0;
  let contentType: string | null = null;
  let isJson = false;
  let discoveryOk = false;
  let hasValidPostsArray = false;
  let postsCount = 0;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    // 2. Query posts endpoint
    const postsRes = await fetch(postsUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'SICKSAINT-Diagnostics/2.0',
      },
      cache: 'no-store',
    });

    clearTimeout(timeout);
    latencyMs = Date.now() - startTime;
    httpStatus = postsRes.status;
    contentType = postsRes.headers.get('content-type');
    isJson = Boolean(contentType && contentType.toLowerCase().includes('application/json'));

    // 3. If HTTP status is not 2xx OR Content-Type is not JSON, it is an invalid response
    // (Crucial: HTTP 200 alone with text/html parking page is NOT connected)
    if (!postsRes.ok || !isJson) {
      return NextResponse.json<WordPressStatusPayload>({
        live: false,
        status: 'invalid_response',
        endpoint: wpApiUrl,
        url: wpApiUrl,
        siteUrl: wpSiteUrl,
        discoveryEndpoint: wpDiscoveryUrl,
        statusCode: httpStatus,
        httpStatus,
        latencyMs,
        postsCount: 0,
        contentType,
        discovery: false,
        isJson,
        hasValidPostsArray: false,
        lastChecked: new Date().toISOString(),
        message: !isJson
          ? `WordPress endpoint returned non-JSON response (${contentType || 'empty'}). The domain may be resolving to a registrar parking page, landing redirect, or maintenance page.`
          : `WordPress REST API returned HTTP error ${httpStatus}: ${postsRes.statusText}`,
      });
    }

    // 4. Validate that JSON parses cleanly
    let rawPosts: any;
    try {
      rawPosts = await postsRes.json();
    } catch {
      return NextResponse.json<WordPressStatusPayload>({
        live: false,
        status: 'invalid_response',
        endpoint: wpApiUrl,
        url: wpApiUrl,
        siteUrl: wpSiteUrl,
        discoveryEndpoint: wpDiscoveryUrl,
        statusCode: httpStatus,
        httpStatus,
        latencyMs,
        postsCount: 0,
        contentType,
        discovery: false,
        isJson: false,
        hasValidPostsArray: false,
        lastChecked: new Date().toISOString(),
        message:
          'WordPress endpoint returned application/json header, but body failed to parse as valid JSON.',
      });
    }

    // 5. Validate that posts is an array (WordPress /posts returns array)
    if (!Array.isArray(rawPosts)) {
      return NextResponse.json<WordPressStatusPayload>({
        live: false,
        status: 'invalid_response',
        endpoint: wpApiUrl,
        url: wpApiUrl,
        siteUrl: wpSiteUrl,
        discoveryEndpoint: wpDiscoveryUrl,
        statusCode: httpStatus,
        httpStatus,
        latencyMs,
        postsCount: 0,
        contentType,
        discovery: false,
        isJson: true,
        hasValidPostsArray: false,
        lastChecked: new Date().toISOString(),
        message:
          'WordPress posts endpoint responded with JSON, but payload was an object or error schema rather than a posts array.',
      });
    }

    hasValidPostsArray = true;
    const totalHeader = postsRes.headers.get('x-wp-total');
    postsCount = totalHeader ? parseInt(totalHeader, 10) : rawPosts.length;

    // 6. Verify discovery endpoint responds correctly
    try {
      const discController = new AbortController();
      const discTimeout = setTimeout(() => discController.abort(), 3000);
      const discRes = await fetch(wpDiscoveryUrl, {
        signal: discController.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'SICKSAINT-Diagnostics/2.0',
        },
        cache: 'no-store',
      });
      clearTimeout(discTimeout);

      if (discRes.ok && discRes.headers.get('content-type')?.includes('application/json')) {
        const discJson = await discRes.json();
        if (
          discJson &&
          (Array.isArray(discJson.namespaces)
            ? discJson.namespaces.includes('wp/v2')
            : Boolean(discJson.routes && discJson.routes['/wp/v2']))
        ) {
          discoveryOk = true;
        }
      }
    } catch {
      discoveryOk = hasValidPostsArray;
    }

    // 7. Check whether connected with posts or connected_empty
    if (postsCount === 0 && rawPosts.length === 0) {
      return NextResponse.json<WordPressStatusPayload>({
        live: true,
        status: 'connected_empty',
        endpoint: wpApiUrl,
        url: wpApiUrl,
        siteUrl: wpSiteUrl,
        discoveryEndpoint: wpDiscoveryUrl,
        statusCode: httpStatus,
        httpStatus,
        latencyMs,
        postsCount: 0,
        contentType,
        discovery: discoveryOk,
        isJson: true,
        hasValidPostsArray: true,
        lastChecked: new Date().toISOString(),
        message:
          'WordPress REST API is connected and responding, but no published posts were found in the archive.',
      });
    }

    return NextResponse.json<WordPressStatusPayload>({
      live: true,
      status: 'connected',
      endpoint: wpApiUrl,
      url: wpApiUrl,
      siteUrl: wpSiteUrl,
      discoveryEndpoint: wpDiscoveryUrl,
      statusCode: httpStatus,
      httpStatus,
      latencyMs,
      postsCount,
      contentType,
      discovery: discoveryOk,
      isJson: true,
      hasValidPostsArray: true,
      lastChecked: new Date().toISOString(),
      message: `WordPress REST API is connected and actively serving ${postsCount} published dispatch${
        postsCount === 1 ? '' : 'es'
      }.`,
    });
  } catch (err: any) {
    const isTimeout =
      err.name === 'AbortError' ||
      err.message?.includes('timeout') ||
      err.cause?.name === 'AbortError';

    const causeCode = err.cause?.code || err.code;
    const causeMsg = err.cause?.message || err.message || '';
    const isDnsError =
      causeCode === 'ENOTFOUND' ||
      causeMsg.includes('ENOTFOUND') ||
      causeMsg.includes('getaddrinfo');

    let hostname = 'WordPress host';
    try {
      hostname = new URL(wpApiUrl).hostname;
    } catch {
      // ignore
    }

    let errorDetail = err.cause?.message || err.message || 'Connection failed';
    if (isDnsError) {
      errorDetail = `DNS lookup failed for ${hostname} (ENOTFOUND). The subdomain is not yet pointed or active in DNS records.`;
    } else if (isTimeout) {
      errorDetail = `Connection timed out after 5000ms. Host took too long to respond.`;
    }

    return NextResponse.json<WordPressStatusPayload>({
      live: false,
      status: 'unreachable',
      endpoint: wpApiUrl,
      url: wpApiUrl,
      siteUrl: wpSiteUrl,
      discoveryEndpoint: wpDiscoveryUrl,
      statusCode: 0,
      httpStatus: 0,
      latencyMs: Date.now() - startTime,
      postsCount: 0,
      contentType: null,
      discovery: false,
      isJson: false,
      hasValidPostsArray: false,
      lastChecked: new Date().toISOString(),
      error: errorDetail,
      message: `WordPress host unreachable: ${errorDetail}`,
    });
  }
}
