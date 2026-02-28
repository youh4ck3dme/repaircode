# Načítanie API kľúča z .env súboru
$env_path = Join-Path $PSScriptRoot ".env"
if (Test-Path $env_path) {
    $line = Get-Content $env_path | Select-String "GEMINI_API_KEY="
    if ($line) { 
        $gemini_key = $line.ToString().Split("=")[1].Trim() 
    }
}

if (-not $gemini_key) {
    Write-Host "Chyba: GEMINI_API_KEY nenájdený v .env súbore." -ForegroundColor Red
    return
}

Write-Host "Odosielam požiadavku na Gemini API..." -ForegroundColor Cyan

# Vytvorenie dočasného JSON súboru pre spoľahlivé odoslanie cez curl.exe
$json_body = @"
{
  "contents": [
    {
      "parts": [
        {
          "text": "Explain how AI works in a few words"
        }
      ]
    }
  ]
}
"@
$temp_file = Join-Path $PSScriptRoot "temp_gemini_request.json"
$json_body | Out-File -FilePath $temp_file -Encoding UTF8

try {
    # Používame natívny curl.exe s odkazom na súbor @
    # Používame presne ten model, ktorý si uviedol v pôvodnom príkaze
    curl.exe "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=$gemini_key" `
             -H "Content-Type: application/json" `
             -X POST -d "@$temp_file"
} finally {
    if (Test-Path $temp_file) { Remove-Item $temp_file }
}
