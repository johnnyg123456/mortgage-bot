# Lists env vars needed for Render (names only — never prints secret values in full).
# Usage: .\scripts\prepare-render-env.ps1
$root = Split-Path $PSScriptRoot -Parent
$required = @(
  'NOTION_TOKEN', 'NOTION_LOANS_DB_ID', 'NOTION_CONDITIONS_DB_ID',
  'ANTHROPIC_API_KEY', 'VALIDATOR_ENABLED',
  'GMAIL_CLIENT_ID_PRIMARY', 'GMAIL_CLIENT_SECRET_PRIMARY', 'GMAIL_REFRESH_TOKEN_PRIMARY',
  'GMAIL_CLIENT_ID_CHRISTY', 'GMAIL_CLIENT_SECRET_CHRISTY', 'GMAIL_REFRESH_TOKEN_CHRISTY',
  'JOHN_EMAIL', 'CHRISTINA_EMAIL', 'ZAPIER_STATIC_HEADER_KEY'
)

Write-Host "`nRender environment checklist for mortgage-notion-bot`n"
Write-Host "Add each in: Render Dashboard > mortgage-notion-bot > Environment`n"

$local = @{}
$envPath = Join-Path $root '.env'
if (Test-Path $envPath) {
  Get-Content $envPath | ForEach-Object {
    if ($_ -match '^([A-Z_]+)=(.*)$') { $local[$matches[1]] = $matches[2] }
  }
}

foreach ($name in $required) {
  $has = $local.ContainsKey($name) -and $local[$name].Length -gt 0
  $status = if ($has) { 'OK (in local .env — copy to Render)' } else { 'MISSING — copy from Vercel dashboard' }
  Write-Host "  $name : $status"
}

Write-Host "`nAlso set on Render (non-secret, in render.yaml already):"
Write-Host "  VALIDATOR_ENABLED=true"
Write-Host "  GMAIL_SCAN_SYNC=true"
Write-Host "  GMAIL_SCAN_TIMEZONE=America/New_York"
Write-Host "  DRY_RUN=false   (or leave unset)"
Write-Host "`nAfter deploy, update cron-job.org URL to:"
Write-Host "  https://YOUR-SERVICE.onrender.com/api/gmail-watch"
Write-Host "`nUpdate Arive webhook to:"
Write-Host "  https://YOUR-SERVICE.onrender.com/api/arive-webhook"
Write-Host ""
