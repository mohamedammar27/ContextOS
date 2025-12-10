# Register Kestra Flow using curl
# Run with: ./register-flow.ps1

$KESTRA_URL = if ($env:KESTRA_URL) { $env:KESTRA_URL } else { "http://localhost:8080" }
$FLOW_FILE = Join-Path $PSScriptRoot "flows\context-parsing-flow.yaml"

Write-Host "📤 Uploading Kestra flow...`n" -ForegroundColor Cyan

# Check if file exists
if (-not (Test-Path $FLOW_FILE)) {
    Write-Host "❌ Flow file not found: $FLOW_FILE" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Read flow file: $FLOW_FILE" -ForegroundColor Green
$fileSize = (Get-Item $FLOW_FILE).Length
Write-Host "   Size: $fileSize bytes`n"

# Upload to Kestra
$url = "$KESTRA_URL/api/v1/flows"
Write-Host "🚀 Uploading to: $url" -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $url `
        -Method POST `
        -ContentType "application/x-yaml" `
        -InFile $FLOW_FILE `
        -UseBasicParsing
    
    $result = $response.Content | ConvertFrom-Json
    
    Write-Host "`n✅ Flow uploaded successfully!`n" -ForegroundColor Green
    
    Write-Host "📋 Flow Details:" -ForegroundColor Cyan
    Write-Host "   Namespace: $($result.namespace)"
    Write-Host "   ID: $($result.id)"
    Write-Host "   Revision: $($result.revision)"
    Write-Host "   Tasks: $($result.tasks.Count)"
    
    Write-Host "`n🔗 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. View in UI: $KESTRA_URL/ui/flows/edit/contextos/context_parsing_flow"
    Write-Host "   2. List flows: curl $KESTRA_URL/api/v1/flows"
    Write-Host "   3. Test: npm run test:flow"
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    Write-Host "`n❌ Upload failed with HTTP $statusCode" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($statusCode -eq 401) {
        Write-Host "`n💡 Authentication required. Options:" -ForegroundColor Yellow
        Write-Host "   1. Use Kestra OSS (no auth): Restart with OSS docker image"
        Write-Host "   2. Login to Kestra UI first: $KESTRA_URL"
        Write-Host "   3. Use API token in Authorization header"
    }
    
    Write-Host "`n💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Is Kestra running? Check: docker compose ps"
    Write-Host "   2. Is the API accessible? Check: curl $KESTRA_URL/api/v1/flows"
    Write-Host "   3. Check docker logs: docker compose logs -f"
    
    exit 1
}
