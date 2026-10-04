# Gera um par de chaves VAPID (P-256) para as notificações push.
# Uso: powershell -ExecutionPolicy Bypass -File scripts\gerar-chaves-vapid.ps1
#
# - Chave pública: vai em web/config.js e no secret VAPID_PUBLIC_KEY do Supabase.
# - Chave privada: vai SOMENTE no secret VAPID_PRIVATE_KEY do Supabase. Não salve no repositório.

Add-Type -AssemblyName System.Core

function ConvertTo-Base64Url([byte[]] $bytes) {
    [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
}

$parameters = New-Object System.Security.Cryptography.CngKeyCreationParameters
$parameters.ExportPolicy = [System.Security.Cryptography.CngExportPolicies]::AllowPlaintextExport
# [NullString]::Value cria uma chave temporária; $null viraria "" e salvaria a chave no Windows.
$key = [System.Security.Cryptography.CngKey]::Create(
    [System.Security.Cryptography.CngAlgorithm]::ECDsaP256, [NullString]::Value, $parameters)

# Formato ECCPRIVATEBLOB: 4 bytes de tipo, 4 bytes de tamanho, depois X, Y e D com 32 bytes cada.
$blob = $key.Export([System.Security.Cryptography.CngKeyBlobFormat]::EccPrivateBlob)
$x = $blob[8..39]
$y = $blob[40..71]
$d = $blob[72..103]
$key.Dispose()

$public = ConvertTo-Base64Url ([byte[]](@(4) + $x + $y))
$private = ConvertTo-Base64Url ([byte[]]$d)

Write-Output "VAPID_PUBLIC_KEY=$public"
Write-Output "VAPID_PRIVATE_KEY=$private"
