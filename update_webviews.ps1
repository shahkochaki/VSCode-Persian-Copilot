# PowerShell script to add Hub link and copyright to webview files

$files = @(
    'lorem.html',
    'moneyConvert.html', 
    'numberToWords.html',
    'ipDetails.html',
    'jsonParser.html'
)

$hubLink = @"
    <!-- Back to Hub Link -->
    <div style="text-align: center; margin-bottom: 20px;">
        <button onclick="goToHub()" style="background: transparent; border: 1px solid var(--vscode-button-background); color: var(--vscode-button-background); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-family: 'Vazirmatn', sans-serif;">
            🏠 بازگشت به Hub
        </button>
    </div>
"@

$hubFunction = @"

        // Function to go back to hub
        function goToHub() {
            if (typeof vscode !== 'undefined') {
                vscode.postMessage({
                    command: 'openHub'
                });
            }
        }
"@

$copyright = @"
    
    <!-- Copyright Footer -->
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--vscode-input-border); color: var(--vscode-foreground); opacity: 0.7; font-size: 0.9em;">
        <p>© 2025 <a href="https://helpix.app" target="_blank" style="color: var(--vscode-button-background); text-decoration: none;">Helpix.app</a> - Persian Tools Hub for VS Code</p>
    </div>
"@

foreach ($file in $files) {
    $filePath = "i:\Final\airplus\VSCode-Copilot\src\webviews\$file"
    
    if (Test-Path $filePath) {
        Write-Host "Processing $file..."
        
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Add hub link after h2
        $content = $content -replace '(<h2[^>]*>.*?</h2>)', "`$1`n$hubLink"
        
        # Add hub function before closing script tag
        $content = $content -replace '(\s*</script>)', "$hubFunction`n`$1"
        
        # Add copyright before closing body tag
        $content = $content -replace '(\s*</body>)', "$copyright`n`$1"
        
        Set-Content $filePath $content -Encoding UTF8
        Write-Host "✅ Updated $file"
    }
}

Write-Host "All files updated!"
