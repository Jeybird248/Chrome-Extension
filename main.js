document.addEventListener('DOMContentLoaded', function () {
    // Get references to HTML elements
    const downloadButton = document.getElementById('download');
    const clearButton = document.getElementById('clear');
    const filenameInput = document.getElementById('filename');

    // Disable the download button initially
    downloadButton.disabled = true;

    // Event listener for the filename input
    filenameInput.addEventListener('input', function () {
        // Enable the download button if the filename is not empty
        downloadButton.disabled = !filenameInput.value.trim();
    });

    // Event listener for the download button
    downloadButton.addEventListener('click', function () {
        // Extract the filename from the input
        const filename = filenameInput.value.trim();
        // Check if the filename is not empty
        if (filename) {
            // Get the current tab's URL
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const currentUrl = tabs[0].url;

                // Check if the current URL is a YouTube link
                if (isYouTubeLink(currentUrl)) {
                    // Start the API call sequence if it's a YouTube link
                    fetch('http://localhost:5000/transcribe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ url: currentUrl }),
                    })
                    .then((response) => response.json())
                    .then((transcriptionData) => {
                        alert('Step 1: Transcription successful');
                        // Use the transcribed text for the llama API call
                        return fetch('https://llama.k8s-gosha.atlas.illinois.edu/completion', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic YXRsYXNhaXRlYW06anhAVTJXUzhCR1Nxd3U=',
                            },
                            body: JSON.stringify({
                                prompt: '<s>[INST]Generate a summary with bullet points for the following text: ' + transcriptionData.transcript + '[/INST]',
                                n_predict: -1,
                            }),
                        });
                    })
                    .then(response => {
                        // Check if the response status is OK (200)
                        if (response.ok) {
                            // Parse the JSON response
                            return response.json();
                        } else {
                            // If the response status is not OK, throw an error
                            throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
                        }
                    })
                    .then(llamaOutput => {
                        alert('Step 2: Llama API call successful');
                        // Display the response in an alert
                        alert('Step 3: Llama Output:\n\n' + llamaOutput.content);
                        // Convert and download the llama API output as a text file
                        downloadFileObject(llamaOutput.content, filename);
                        alert('Step 4: File downloaded successfully');
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        // Handle errors and provide user feedback
                        alert('Error: ' + error.message);
                    });
                }
            });
        }
    });

    // Event listener for the clear button
    clearButton.addEventListener('click', function () {
        // Clear the filename input
        filenameInput.value = '';

        // Disable the download button
        downloadButton.disabled = true;
    });

    // Function to check if a URL is a YouTube link
    function isYouTubeLink(url) {
        // You can use a simple pattern matching here to identify YouTube links
        return /(?:youtube\.com|youtu\.be)/.test(url);
    }

    // Function to download the string as a text file
    function downloadFileObject(content, filename) {
        const element = document.createElement('a');
        const blob = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(blob);
        element.download = filename + '.txt';

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
        URL.revokeObjectURL(element.href); // Clean up the URL.createObjectURL
    }
});
