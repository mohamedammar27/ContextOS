# Kestra Flow Setup for ContextOS

This directory contains the Kestra workflow configuration for the ContextOS parsing pipeline.

## 📁 Structure

```
kestra/
├── docker-compose.yml           # Kestra server setup
├── flows/
│   └── context-parsing-flow.yaml  # Main parsing workflow
├── register-flow.js             # Upload script
├── package.json                 # NPM scripts
└── README.md                    # This file
```

## 🚀 Setup

### 1. Start Kestra

```bash
docker compose up -d
```

Wait ~30 seconds, then verify:
```bash
curl http://localhost:8080/api/v1/flows
```

### 2. Register the Flow

```bash
npm run register:flow
```

This uploads `context-parsing-flow.yaml` to Kestra.

**Expected output:**
```
✅ Flow uploaded successfully!

📋 Flow Details:
   Namespace: contextos
   ID: context_parsing_flow
   Revision: 1
   Tasks: 4
```

### 3. Verify in UI

Open: http://localhost:8080/ui/flows/edit/contextos/context_parsing_flow

You should see:
- 4 log tasks
- Inputs: content, source, timestamp
- Outputs: workflow_status, processed_source

### 4. Test the Flow

**Option A: Using npm script**
```bash
npm run test:flow
```

**Option B: Using curl**
```bash
curl -X POST http://localhost:8080/api/v1/executions/contextos/context_parsing_flow \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Meeting notes: Discuss Q4 roadmap",
    "source": "manual-test",
    "timestamp": 1733702400000
  }'
```

**Expected response:**
```json
{
  "id": "execution-id-here",
  "namespace": "contextos",
  "flowId": "context_parsing_flow",
  "state": {
    "current": "CREATED",
    "histories": [...]
  }
}
```

### 5. View Execution

1. Go to: http://localhost:8080/ui/executions
2. Find your execution
3. Click to see logs

You should see 4 log messages:
- 📥 Received context from...
- 🔍 Starting LLM parsing...
- ⏰ Timestamp...
- ✅ Context parsing workflow completed

## 📋 Available Scripts

```bash
# Upload flow to Kestra
npm run register:flow

# Test the flow with sample data
npm run test:flow

# List all flows
npm run list:flows

# Verify specific flow
npm run verify
```

## 🔗 API Endpoints

### List all flows
```bash
GET http://localhost:8080/api/v1/flows
```

### Get specific flow
```bash
GET http://localhost:8080/api/v1/flows/contextos/context_parsing_flow
```

### Trigger execution
```bash
POST http://localhost:8080/api/v1/executions/contextos/context_parsing_flow
Content-Type: application/json

{
  "content": "text to parse",
  "source": "slack",
  "timestamp": 1733702400000
}
```

### List executions
```bash
GET http://localhost:8080/api/v1/executions
```

## 🔧 Troubleshooting

### Flow not appearing in UI

```bash
# Check if Kestra is running
docker compose ps

# Check API health
curl http://localhost:8080/api/v1/flows

# Re-register the flow
npm run register:flow
```

### Execution fails

1. Check logs in Kestra UI: http://localhost:8080/ui/executions
2. Verify input format matches schema
3. Check Kestra container logs: `docker compose logs -f`

### Docker issues

```bash
# Stop and remove
docker compose down

# Clean restart
docker compose up -d

# Check logs
docker compose logs -f
```

## 📖 Flow Details

**Namespace:** `contextos`  
**ID:** `context_parsing_flow`

**Inputs:**
- `content` (STRING, required) - Text to parse
- `source` (STRING, required) - Source identifier
- `timestamp` (INT, required) - Unix timestamp in ms

**Tasks:**
1. `log_received` - Log incoming context
2. `log_parsing` - Log parsing start
3. `log_timestamp` - Log timestamp
4. `log_complete` - Log completion

**Outputs:**
- `workflow_status` - Completion status
- `processed_source` - Source identifier

## 🔄 Integration with Backend

The ContextOS backend triggers this flow via:

```javascript
await fetch("http://localhost:8080/api/v1/executions/contextos/context_parsing_flow", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ content, source, timestamp })
});
```

This happens automatically when context is captured via the Chrome extension.

## 📝 Modifying the Flow

1. Edit `flows/context-parsing-flow.yaml`
2. Run `npm run register:flow` to upload changes
3. Revision number will increment automatically

## 🎯 Next Steps

Once the basic flow is working, you can extend it with:
- Node.js script tasks to call backend functions
- Conditional logic based on content type
- Error handling and retry logic
- Notifications on completion
- Data storage tasks

See Kestra documentation: https://kestra.io/docs
