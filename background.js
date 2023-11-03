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
                    initiateDownload(filename, currentUrl)
                        .then(data => initiateVideoToTranscript(data.videoFile))
                        .then(data => initiateTranscriptToNotes(data.transcript))
                        .then(pdfString => {
                            // Use the downloadFileObject function to download the PDF
                            downloadFileObject(pdfString, filename);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            // Handle errors and provide user feedback
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

    // Function to initiate the download
    function initiateDownload(filename, currentUrl) {
        return fetch('YOUR_API_ENDPOINT_FOR_DOWNLOADING_VIDEO', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'YOUR_AUTH_TOKEN' // Use the provided credentials
            },
            body: JSON.stringify({
                filename: filename,
                url: currentUrl // Pass the current URL to the API
            })
        })
            .then(response => response.json())
            .catch(error => {
                throw error;
            });
    }

    // Function to initiate the API call to convert the video to a transcript
    function initiateVideoToTranscript(videoFile) {
        return fetch('YOUR_API_ENDPOINT_FOR_VIDEO_TO_TRANSCRIPT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'YOUR_AUTH_TOKEN' // Use the provided credentials
            },
            body: JSON.stringify({
                videoFile: videoFile
            })
        })
            .then(response => response.json())
            .catch(error => {
                throw error;
            });
    }

    // Function to initiate the API call to turn the transcript into organized notes
    function initiateTranscriptToNotes(transcript) {
        return fetch('YOUR_API_ENDPOINT_FOR_TRANSCRIPT_TO_NOTES', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'YOUR_AUTH_TOKEN' // Use the provided credentials
            },
            body: JSON.stringify({
                transcript: transcript
            })
        })
            .then(response => response.text()) // Assuming the last API call returns a string
            .catch(error => {
                throw error;
            });
    }

    // Function to download the PDF using the provided base64 string
    function downloadFileObject(base64String, filename) {
        if (base64String.startsWith("data:application/pdf;base64")) {
            const linkSource = base64String;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = filename + '.pdf';
            downloadLink.click();
        } else {
            alert("Not a valid Base64 PDF string. Please check.");
        }
    }
});
