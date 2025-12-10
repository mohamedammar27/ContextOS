# Quick Flow Registration Script
# This script tests different methods to register the flow

Write-Host "🔍 Testing Kestra Connection..." -ForegroundColor Cyan

$KESTRA_URL = "http://localhost:8080"

# Test 1: Check if Kestra is running
Write-Host "`n1️⃣  Checking if Kestra is accessible..."
try {
    $health = Invoke-WebRequest -Uri "$KESTRA_URL/api/v1/flows" -Method GET -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ Kestra API is accessible (Status: $($health.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Cannot reach Kestra API" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "`n   💡 Make sure Kestra is running:" -ForegroundColor Yellow
    Write-Host "      docker compose up -d"
    exit 1
}

# Test 2: Try to upload flow
Write-Host "`n2️⃣  Attempting to upload flow..."
$flowFile = Join-Path $PSScriptRoot "flows\context-parsing-flow.yaml"

if (-not (Test-Path $flowFile)) {
    Write-Host "   ❌ Flow file not found: $flowFile" -ForegroundColor Red
    exit 1
}

try {
    # Method 1: Direct POST with InFile
    Write-Host "   Method 1: Using Invoke-WebRequest with InFile..."
    $response = Invoke-WebRequest `
        -Uri "$KESTRA_URL/api/v1/flows" `
        -Method POST `
        -ContentType "application/x-yaml" `
        -InFile $flowFile `
        -UseBasicParsing `
        -ErrorAction Stop
    
    $result = $response.Content | ConvertFrom-Json
    Write-Host "   ✅ SUCCESS! Flow uploaded" -ForegroundColor Green
    Write-Host "   Namespace: $($result.namespace)"
    Write-Host "   ID: $($result.id)"
    Write-Host "   Revision: $($result.revision)"
    
    Write-Host "`n🎉 Flow is now available!" -ForegroundColor Green
    Write-Host "   View in UI: $KESTRA_URL/ui/flows/edit/contextos/context_parsing_flow"
    Write-Host "   Test it: npm run test:flow"
    
    exit 0
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "   ❌ Failed with HTTP $statusCode" -ForegroundColor Red
    
    if ($statusCode -eq 401) {
        Write-Host "`n💡 Got 401 Unauthorized - This usually means:" -ForegroundColor Yellow
        Write-Host "   Option A: Kestra Enterprise Edition requires login"
        Write-Host "   Option B: API endpoint changed in newer version"
        Write-Host "`n   Let's try alternative method..."
        
        # Method 2: Try with Body instead of InFile
        Write-Host "`n   Method 2: Using request body..."
        try {
            $flowContent = Get-Content $flowFile -Raw
            $response2 = Invoke-WebRequest `
                -Uri "$KESTRA_URL/api/v1/flows" `
                -Method POST `
                -ContentType "application/x-yaml" `
                -Body $flowContent `
                -UseBasicParsing `
                -ErrorAction Stop
            
            $result2 = $response2.Content | ConvertFrom-Json
            Write-Host "   ✅ SUCCESS with method 2!" -ForegroundColor Green
            Write-Host "   Namespace: $($result2.namespace)"
            Write-Host "   ID: $($result2.id)"
            exit 0
            
        } catch {
            Write-Host "   ❌ Method 2 also failed" -ForegroundColor Red
        }
        
        # Method 3: Suggest manual upload
        Write-Host "`n📋 Alternative: Manual Upload via UI" -ForegroundColor Cyan
        Write-Host "   1. Open: $KESTRA_URL/ui/flows"
        Write-Host "   2. Click 'Create'"
        Write-Host "   3. Copy/paste content from: $flowFile"
        Write-Host "   4. Click 'Save'"
        
    } else {
        Write-Host "   Error: $($_.Exception.Message)"
    }
    
    Write-Host "`n🔧 Debug Info:" -ForegroundColor Yellow
    Write-Host "   Kestra URL: $KESTRA_URL"
    Write-Host "   Flow file: $flowFile"
    Write-Host "   File size: $((Get-Item $flowFile).Length) bytes"
    
    exit 1
}
