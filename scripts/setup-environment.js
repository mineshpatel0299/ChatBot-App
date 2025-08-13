const fs = require("fs")
const path = require("path")

// Environment setup script
function setupEnvironment() {
  console.log("🔧 Setting up environment configuration...")

  const envTemplate = `# Nhost Configuration
NEXT_PUBLIC_NHOST_SUBDOMAIN=your-nhost-subdomain
NEXT_PUBLIC_NHOST_REGION=your-nhost-region

# n8n Configuration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot-message
N8N_WEBHOOK_SECRET=your-webhook-secret-here

# Hasura Configuration
NHOST_ADMIN_SECRET=your-hasura-admin-secret
HASURA_GRAPHQL_ENDPOINT=https://your-hasura-endpoint/v1/graphql

# OpenRouter Configuration (for n8n)
OPENROUTER_API_KEY=your-openrouter-api-key

# Deployment Configuration
NETLIFY_URL=https://your-app.netlify.app
`

  const envPath = path.join(process.cwd(), ".env.local")

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envTemplate)
    console.log("✅ Created .env.local template")
    console.log("📝 Please update the environment variables with your actual values")
  } else {
    console.log("⚠️  .env.local already exists")
  }

  // Create Netlify environment variables guide
  const netlifyEnvGuide = `# Netlify Environment Variables Setup

Add these environment variables in your Netlify dashboard:
Site Settings > Environment Variables

## Required Variables:

NEXT_PUBLIC_NHOST_SUBDOMAIN=your-nhost-subdomain
NEXT_PUBLIC_NHOST_REGION=your-nhost-region
N8N_WEBHOOK_SECRET=your-webhook-secret-here
NHOST_ADMIN_SECRET=your-hasura-admin-secret

## Optional Variables:

NODE_VERSION=18
NPM_VERSION=9
NETLIFY_NEXT_PLUGIN_SKIP=true

## Build Settings:

Build command: npm run build
Publish directory: .next
Functions directory: .netlify/functions
`

  fs.writeFileSync(path.join(process.cwd(), "NETLIFY_ENV_SETUP.md"), netlifyEnvGuide)
  console.log("✅ Created Netlify environment setup guide")
}

if (require.main === module) {
  setupEnvironment()
}

module.exports = { setupEnvironment }
