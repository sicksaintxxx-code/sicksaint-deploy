import { NextRequest } from 'next/server'
import { proxyLaravel } from '@/lib/laravel-proxy'
type Context = { params: Promise<{ id: string }> }
async function forward(request: NextRequest, context: Context) { const { id } = await context.params; return proxyLaravel(request, `submissions/${encodeURIComponent(id)}`) }
export async function GET(request: NextRequest, context: Context) { return forward(request, context) }
export async function PUT(request: NextRequest, context: Context) { return forward(request, context) }
export async function PATCH(request: NextRequest, context: Context) { return forward(request, context) }
export async function DELETE(request: NextRequest, context: Context) { return forward(request, context) }
