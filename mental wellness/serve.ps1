$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:8000/')
$listener.Start()
while ($true) {
  $context = $listener.GetContext()
  $requestPath = $context.Request.Url.AbsolutePath
  if ($requestPath -eq '/') { $requestPath = '/index.html' }
  $relativePath = $requestPath.TrimStart('/')
  $fullPath = Join-Path (Get-Location) $relativePath
  if ([System.IO.Path]::GetExtension($fullPath) -eq '') { $fullPath = Join-Path $fullPath 'index.html' }
  if (Test-Path $fullPath -PathType Leaf) {
    $contentType = 'text/html'
    switch ([System.IO.Path]::GetExtension($fullPath)) {
      '.css' { $contentType = 'text/css' }
      '.js' { $contentType = 'application/javascript' }
      '.json' { $contentType = 'application/json' }
      '.png' { $contentType = 'image/png' }
      '.jpg' { $contentType = 'image/jpeg' }
      '.jpeg' { $contentType = 'image/jpeg' }
      '.svg' { $contentType = 'image/svg+xml' }
    }
    $bytes = [System.IO.File]::ReadAllBytes($fullPath)
    $response = $context.Response
    $response.ContentType = $contentType
    $response.ContentLength64 = $bytes.Length
    $output = $response.OutputStream
    $output.Write($bytes, 0, $bytes.Length)
    $output.Close()
  } else {
    $response = $context.Response
    $response.StatusCode = 404
    $message = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
    $response.ContentLength64 = $message.Length
    $response.OutputStream.Write($message, 0, $message.Length)
    $response.OutputStream.Close()
  }
}
