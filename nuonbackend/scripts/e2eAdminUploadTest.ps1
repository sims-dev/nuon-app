# E2E Admin Upload Test (PowerShell)
# Usage: Open PowerShell, cd to this folder and run: .\e2eAdminUploadTest.ps1
# This script logs in with the default admin credentials, uploads small placeholder files
# to the admin engage create endpoint, lists saved files in uploads/, and fetches activities.

# Ensure backend is running and accessible at http://192.168.0.209:5000

# Create tmp folder and small placeholder files
if (!(Test-Path -Path ..\tmp)) { New-Item -ItemType Directory -Path ..\tmp | Out-Null }
Set-Content -Path ..\tmp\sample-image.jpg -Value 'placeholder-image' -Encoding ASCII
Set-Content -Path ..\tmp\sample-video.mp4 -Value 'placeholder-video' -Encoding ASCII

# Login
$loginBody = @{ email='admin@nuonhub.com'; password='admin@123' } | ConvertTo-Json
Write-Host 'Logging in as admin...'
try {
    $login = Invoke-RestMethod -Method Post -Uri 'http://192.168.0.209:5000/api/auth/login' -ContentType 'application/json' -Body $loginBody -ErrorAction Stop
} catch {
    Write-Host 'Login failed:' $_.Exception.Message; exit 3
}

$token = $null
if ($login -is [System.Management.Automation.PSCustomObject]) { $token = $login.accessToken }
if (-not $token -and $login.token) { $token = $login.token }
if (-not $token -and $login.data -and $login.data.accessToken) { $token = $login.data.accessToken }
if (-not $token) { Write-Host 'Could not find token in login response:'; $login | ConvertTo-Json -Depth 5; exit 2 }
Write-Host 'Received token (truncated):' ($token.Substring(0, [Math]::Min(20,$token.Length)) + '...')

# Upload activity with files
$form = @{
    title = 'E2E Upload Test'
    category = 'wellness'
    description = 'Automated E2E upload test from script'
    image = Get-Item ..\tmp\sample-image.jpg
    videoFile = Get-Item ..\tmp\sample-video.mp4
}
Write-Host 'Uploading activity with files...'
try {
    $response = Invoke-RestMethod -Uri 'http://192.168.0.209:5000/api/admin/engage/activities' -Method Post -Headers @{ Authorization = "Bearer $token" } -Form $form -ErrorAction Stop
} catch {
    Write-Host 'Upload failed:' $_.Exception.Message; exit 4
}

Write-Host 'Upload response:'
$response | ConvertTo-Json -Depth 5

# List files in uploads folder (backend path)
Write-Host "\nFiles in uploads/ (backend):"
$uploadsPath = Join-Path -Path (Split-Path -Path $PSScriptRoot -Parent) -ChildPath 'uploads'
if (Test-Path $uploadsPath) { Get-ChildItem $uploadsPath | Select-Object Name,Length | Format-Table }
else { Write-Host 'uploads folder not found at' $uploadsPath }

# Fetch public activities
Write-Host "\nFetching /api/engage/activities..."
try {
    $activities = Invoke-RestMethod -Method Get -Uri 'http://192.168.0.209:5000/api/engage/activities?limit=10' -ErrorAction Stop
    $activities | ConvertTo-Json -Depth 5
} catch {
    Write-Host 'Fetch activities failed:' $_.Exception.Message; exit 5
}

Write-Host '\nE2E script completed.'
