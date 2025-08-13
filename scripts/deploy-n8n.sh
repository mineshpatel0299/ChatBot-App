#!/bin/bash

# Deployment script for n8n workflow

set -e

echo "🚀 Deploying n8n Chatbot Workflow"

# Check required environment variables
required_vars=("OPENROUTER_API_KEY" "HASURA_ADMIN_SECRET" "HASURA_GRAPHQL_ENDPOINT" "N8N_WEBHOOK_SECRET")

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Error: $var environment variable is not set"
    exit 1
  fi
done

echo "✅ Environment variables validated"

# Start n8n with Docker Compose
if [ -f "docker/docker-compose.n8n.yml" ]; then
  echo "📦 Starting n8n with Docker Compose..."
  docker-compose -f docker/docker-compose.n8n.yml up -d
  
  echo "⏳ Waiting for n8n to start..."
  sleep 30
  
  # Check if n8n is running
  if curl -f http://localhost:5678/healthz > /dev/null 2>&1; then
    echo "✅ n8n is running successfully"
    echo "🌐 Access n8n at: http://localhost:5678"
    echo "👤 Username: admin"
    echo "🔑 Password: ${N8N_PASSWORD:-changeme}"
  else
    echo "❌ n8n failed to start"
    exit 1
  fi
else
  echo "❌ Docker Compose file not found"
  exit 1
fi

# Test the workflow
echo "🧪 Testing workflow..."
if command -v node &> /dev/null; then
  npx ts-node scripts/test-n8n-workflow.ts
else
  echo "⚠️  Node.js not found, skipping workflow test"
fi

echo "🎉 n8n deployment completed successfully!"
echo ""
echo "Next steps:"
echo "1. Import the workflow from n8n/chatbot-workflow.json"
echo "2. Update Hasura Action handler URL"
echo "3. Test the complete integration"
