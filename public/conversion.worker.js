// This is a simplified worker to simulate file processing
// without blocking the main UI thread.

self.onmessage = function(event) {
    const { file, targetFormat } = event.data;

    // Simulate a delay for processing (e.g., 1.5 seconds)
    const processingTime = 1500;

    setTimeout(() => {
        // In a real scenario, you'd use a wasm library or complex logic here.
        // For this simulation, we'll just create a new blob with the same content
        // but pretend it has been "converted".
        const newFileName = file.name.substring(0, file.name.lastIndexOf('.')) + targetFormat.extension;

        const convertedBlob = new Blob([file], { type: 'application/octet-stream' });

        self.postMessage({
            success: true,
            convertedBlob: convertedBlob,
            fileName: newFileName,
        });

    }, processingTime);
};
