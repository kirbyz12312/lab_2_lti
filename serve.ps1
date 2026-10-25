$port = 8089
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
} catch {
    Write-Warning "El puerto $port ya esta en uso. Si ya hay un servidor ejecutandose, puedes abrir http://localhost:$port/ en tu navegador."
    exit
}

$baseDir = $PSScriptRoot
Write-Output "=========================================================="
Write-Output " SERVIDOR DE PRESENTACION WEB UNSA - LABORATORIO 02"
Write-Output " URL Activa: http://localhost:$port/"
Write-Output " Directorio Base: $baseDir"
Write-Output "=========================================================="
Write-Output "Presiona Ctrl + C en esta ventana para detener el servidor."

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response
        
        $localPath = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($localPath)) { $localPath = "index.html" }
        $filePath = Join-Path $baseDir ($localPath -replace '/', '\')
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $res.ContentType = "text/html; charset=utf-8" }
                ".css"  { $res.ContentType = "text/css; charset=utf-8" }
                ".js"   { $res.ContentType = "application/javascript; charset=utf-8" }
                ".png"  { $res.ContentType = "image/png" }
                ".jpg"  { $res.ContentType = "image/jpeg" }
                ".svg"  { $res.ContentType = "image/svg+xml" }
                ".py"   { $res.ContentType = "text/plain; charset=utf-8" }
                ".m"    { $res.ContentType = "text/plain; charset=utf-8" }
                Default { $res.ContentType = "application/octet-stream" }
            }
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $res.ContentLength64 = $errBytes.Length
            $res.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $res.Close()
    }
} finally {
    $listener.Stop()
}
