const https = require("https")
const http = require("http")

// Deployment verification script
async function verifyDeployment() {
  const deploymentUrl = process.env.NETLIFY_URL || process.env.DEPLOYMENT_URL

  if (!deploymentUrl) {
    console.error("❌ No deployment URL provided")
    process.exit(1)
  }

  console.log("🔍 Verifying deployment at:", deploymentUrl)

  const checks = [
    {
      name: "Homepage Load",
      path: "/",
      expectedStatus: 200,
    },
    {
      name: "API Health Check",
      path: "/api/health",
      expectedStatus: 200,
    },
    {
      name: "Authentication Pages",
      path: "/login",
      expectedStatus: 200,
    },
  ]

  let allPassed = true

  for (const check of checks) {
    try {
      const result = await makeRequest(deploymentUrl + check.path)

      if (result.statusCode === check.expectedStatus) {
        console.log(`✅ ${check.name}: PASSED`)
      } else {
        console.log(`❌ ${check.name}: FAILED (Status: ${result.statusCode})`)
        allPassed = false
      }
    } catch (error) {
      console.log(`❌ ${check.name}: FAILED (${error.message})`)
      allPassed = false
    }
  }

  // Environment variables check
  console.log("\n🔧 Environment Variables Check:")
  const requiredEnvVars = [
    "NEXT_PUBLIC_NHOST_SUBDOMAIN",
    "NEXT_PUBLIC_NHOST_REGION",
    "N8N_WEBHOOK_SECRET",
    "NHOST_ADMIN_SECRET",
  ]

  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: SET`)
    } else {
      console.log(`❌ ${envVar}: MISSING`)
      allPassed = false
    }
  }

  if (allPassed) {
    console.log("\n🎉 All deployment checks passed!")
    process.exit(0)
  } else {
    console.log("\n💥 Some deployment checks failed!")
    process.exit(1)
  }
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http

    client
      .get(url, (res) => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
        })
      })
      .on("error", reject)
  })
}

// Health check API endpoint
if (require.main === module) {
  verifyDeployment()
}

module.exports = { verifyDeployment }
