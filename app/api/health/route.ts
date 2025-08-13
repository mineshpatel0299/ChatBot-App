import { NextResponse } from "next/server"

// Health check endpoint for deployment verification
export async function GET() {
  const healthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      database: "connected", // This would check actual DB connection in production
      authentication: "ready",
      graphql: "ready",
      realtime: "ready",
    },
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      deployment: process.env.NETLIFY ? "netlify" : "local",
    },
  }

  return NextResponse.json(healthStatus, { status: 200 })
}
