$sources = @{
    "data"   = "D:\Games\Ragnarok Online\reROll dev\data"
    "System" = "D:\Games\Ragnarok Online\reROll dev\System"
}

$patcherRoot = "$PSScriptRoot\patcher"

foreach ($subfolder in $sources.Keys) {
    $destBase = Join-Path $patcherRoot $subfolder
    $srcBase  = $sources[$subfolder]

    Get-ChildItem -Path $destBase -Recurse -File | Where-Object { $_.BaseName -notmatch '^(s?clientinfo)' } | ForEach-Object {
        $relative = $_.FullName.Substring($destBase.Length).TrimStart('\')
        $srcFile  = Join-Path $srcBase $relative

        if (Test-Path $srcFile) {
            Copy-Item -Path $srcFile -Destination $_.FullName -Force
            Write-Host "Copied: $subfolder\$relative"
        } else {
            Write-Warning "Source not found: $srcFile"
        }
    }
}

Write-Host "`nDone."
