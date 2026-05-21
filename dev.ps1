$nodeDir = Join-Path $env:LOCALAPPDATA "nodejs"
if (-not (Test-Path "$nodeDir\npm.cmd")) {
    Write-Error "Node.js no encontrado en $nodeDir"
    exit 1
}
$env:PATH = "$nodeDir;$env:PATH"
Set-Location $PSScriptRoot
& "$nodeDir\npm.cmd" run dev
