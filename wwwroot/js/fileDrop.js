export function initializeDropzone(dropzoneElement, dotNetHelper) {
    if (!dropzoneElement) return;
    
    // Prevent default drag behaviors on the document
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzoneElement.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
    
    // Handle drag enter
    dropzoneElement.addEventListener('dragenter', () => {
        dotNetHelper.invokeMethodAsync('SetDragOver', true);
    });
    
    // Handle drag over
    dropzoneElement.addEventListener('dragover', () => {
        dotNetHelper.invokeMethodAsync('SetDragOver', true);
    });
    
    // Handle drag leave
    dropzoneElement.addEventListener('dragleave', (e) => {
        // Only set dragOver to false if we're actually leaving the dropzone
        if (!dropzoneElement.contains(e.relatedTarget)) {
            dotNetHelper.invokeMethodAsync('SetDragOver', false);
        }
    });
    
    // Handle drop
    dropzoneElement.addEventListener('drop', async (e) => {
        dotNetHelper.invokeMethodAsync('SetDragOver', false);
        
        const files = e.dataTransfer.files;
        if (files.length === 0) return;
        
        const file = files[0];
        
        // Check file extension
        const fileName = file.name.toLowerCase();
        const allowedExtensions = ['.dll', '.exe', '.netmodule', '.il'];
        const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
        
        if (!hasValidExtension) {
            console.warn('Invalid file type dropped. Allowed types: .dll, .exe, .netmodule, .il');
            return;
        }
        
        try {
            // Read file as ArrayBuffer
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const byteArray = Array.from(uint8Array);
            
            // Call C# method with file data
            await dotNetHelper.invokeMethodAsync('OnFileDropped', byteArray, file.name, file.type || 'application/octet-stream');
        } catch (error) {
            console.error('Error processing dropped file:', error);
        }
    });
}

