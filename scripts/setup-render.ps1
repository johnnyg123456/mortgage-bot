# Creates mortgage-notion-bot on Render and syncs env vars from local files.
# Requires: Render CLI logged in (render login) or RENDER_API_KEY set.
# Usage: .\scripts\setup-render.ps1 [-Plan free|starter]

param(
  [ValidateSet('free', 'starter')]
  [string]$Plan = 'starter'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$render = if ($env:RENDER_CLI) { $env:RENDER_CLI } else { Join-Path $env:USERPROFILE '.local\bin\render.exe' }

if (-not (Test-Path $render)) {
  throw "Render CLI not found at $render. Install from https://render.com/docs/cli"
}

function Read-EnvFile([string]$path) {
  $vars = @{}
  if (-not (Test-Path $path)) { return $vars }
  Get-Content $path | ForEach-Object {
    if ($_ -match '^\s*([A-Z_][A-Z0-9_]*)=(.*)$') {
      $vars[$matches[1]] = $matches[2]
    }
  }
  return $vars
}

# Merge: render template (Notion etc.) then .env overrides
$merged = Read-EnvFile (Join-Path $root '.env.render.template')
foreach ($kv in (Read-EnvFile (Join-Path $root '.env')).GetEnumerator()) {
  if ($kv.Value) { $merged[$kv.Key] = $kv.Value }
}

$required = @(
  'NOTION_TOKEN', 'NOTION_LOANS_DB_ID', 'NOTION_CONDITIONS_DB_ID',
  'ANTHROPIC_API_KEY',
  'GMAIL_CLIENT_ID_PRIMARY', 'GMAIL_CLIENT_SECRET_PRIMARY', 'GMAIL_REFRESH_TOKEN_PRIMARY',
  'GMAIL_CLIENT_ID_CHRISTY', 'GMAIL_CLIENT_SECRET_CHRISTY', 'GMAIL_REFRESH_TOKEN_CHRISTY',
  'JOHN_EMAIL', 'CHRISTINA_EMAIL', 'ZAPIER_STATIC_HEADER_KEY'
)

$missing = @($required | Where-Object { -not $merged.ContainsKey($_) -or -not $merged[$_] })
if ($missing.Count) {
  Write-Host "Missing env values locally: $($missing -join ', ')" -ForegroundColor Red
  exit 1
}

# Non-secret defaults for Render
$merged['VALIDATOR_ENABLED'] = 'true'
$merged['GMAIL_SCAN_SYNC'] = 'true'
$merged['GMAIL_SCAN_TIMEZONE'] = 'America/New_York'
$merged['DRY_RUN'] = 'false'
$merged['NODE_VERSION'] = '22'

$skipKeys = @(
  'VERCEL', 'VERCEL_ENV', 'VERCEL_URL', 'VERCEL_GIT_COMMIT_AUTHOR_LOGIN',
  'VERCEL_GIT_COMMIT_AUTHOR_NAME', 'VERCEL_GIT_COMMIT_MESSAGE', 'VERCEL_GIT_COMMIT_REF',
  'VERCEL_GIT_COMMIT_SHA', 'VERCEL_GIT_PREVIOUS_SHA', 'VERCEL_GIT_PROVIDER',
  'VERCEL_GIT_PULL_REQUEST_ID', 'VERCEL_GIT_REPO_ID', 'VERCEL_GIT_REPO_OWNER',
  'VERCEL_GIT_REPO_SLUG', 'VERCEL_OIDC_TOKEN', 'VERCEL_TARGET_ENV',
  'NX_DAEMON', 'TURBO_CACHE', 'TURBO_DOWNLOAD_LOCAL_ENABLED', 'TURBO_REMOTE_ONLY', 'TURBO_RUN_SUMMARY'
)

$envArgs = @()
foreach ($key in ($merged.Keys | Sort-Object)) {
  if ($key -in $skipKeys) { continue }
  $envArgs += "--env-var"
  $envArgs += "$key=$($merged[$key])"
}

$serviceName = 'mortgage-notion-bot'
$repo = 'https://github.com/johnnyg123456/mortgage-bot'

Write-Host "`nChecking for existing service '$serviceName'..."
$existing = & $render services list -o json --confirm | ConvertFrom-Json
$match = $existing | Where-Object { $_.service.name -eq $serviceName } | Select-Object -First 1

if ($match) {
  $serviceId = $match.service.id
  $url = $match.service.serviceDetails.url
  Write-Host "Service already exists: $serviceId ($url)"
} else {
  Write-Host "Creating service (plan=$Plan, region=ohio, branch=master)..."
  $createArgs = @(
    'services', 'create',
    '--name', $serviceName,
    '--type', 'web_service',
    '--runtime', 'node',
    '--repo', $repo,
    '--branch', 'master',
    '--region', 'ohio',
    '--plan', $Plan,
    '--build-command', 'npm install',
    '--start-command', 'npm start',
    '--health-check-path', '/health',
    '--auto-deploy'
  ) + $envArgs + @('-o', 'json', '--confirm')

  $createJson = & $render @createArgs 2>&1 | Out-String
  if ($LASTEXITCODE -ne 0) {
    if ($Plan -eq 'starter' -and $createJson -match 'payment|402|need_payment') {
      Write-Host "Starter plan requires payment info on Render. Retrying with free plan..." -ForegroundColor Yellow
      & $PSCommandPath -Plan free
      exit $LASTEXITCODE
    }
    Write-Host $createJson
    throw "render services create failed (exit $LASTEXITCODE)"
  }

  $created = $createJson | ConvertFrom-Json
  if ($created.service) {
    $serviceId = $created.service.id
    $url = $created.service.serviceDetails.url
  } else {
    # CLI sometimes returns bare service object
    $serviceId = $created.id
    $url = $created.serviceDetails.url
  }
  Write-Host "Created: $serviceId"
  Write-Host "URL: $url"
}

Write-Host "`nTriggering deploy..."
& $render deploys create $serviceId --wait -o json --confirm | Out-Null

Write-Host "`nHealth check..."
Start-Sleep -Seconds 5
try {
  $health = Invoke-RestMethod -Uri "$url/health" -TimeoutSec 30
  Write-Host "Health: $($health.status) | runtime=$($health.runtime) | validator=$($health.validator)"
} catch {
  Write-Host "Health check not ready yet - service may still be starting. URL: $url/health"
}

Write-Host "`n--- Render setup complete ---"
Write-Host "Service URL:     $url"
Write-Host "Health:          $url/health"
Write-Host "Gmail cron:      $url/api/gmail-watch"
Write-Host "Arive webhook:   $url/api/arive-webhook"
Write-Host "Dashboard:       https://dashboard.render.com/web/$serviceId"
Write-Host ""
