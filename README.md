# Youtube Video Note Taker

## Overview

Welcome to the Youtube Video Note Taker project, a tool designed to streamline the conversion of videos into transcripts and generate organized PDF notes. This Chrome Extension leverages APIs for video conversion, providing a seamless and efficient workflow.

https://github.com/Jeybird248/Chrome-Extension/assets/69325815/892a1799-9bb8-4350-87ee-37d55335d436

## Installation

To get started, follow these simple steps:

1. **Clone the Repository:** Begin by cloning this repository to your local machine.

    ```bash
    git clone https://github.com/Jeybird248/Chrome-Extension.git
    ```

2. **Configure API Credentials:** Obtain the necessary API credentials for video conversion and ensure they are properly configured.

3. **Install as Chrome Extension:** Add the extension to your Google Chrome browser.

## Usage

Once installed, the Youtube Video Note Taker simplifies the entire process:

1. **Enter Filename:** Provide a filename for the notes you wish to generate.

2. **Download Video:** Click the "Download" button to initiate the video download and transcript creation.

3. **Organized Notes:** The transcript is transformed into organized notes for easy consumption.

4. **Download PDF:** Finally, download the PDF containing the structured notes.

## API Calls

The extension executes a sequence of API calls as follows:

### 1. Video Transcription API

- **Endpoint:** `http://localhost:5000/transcribe`
- **Method:** POST
- **Description:** Transcribes the video content from a YouTube link.
- **Request:**
  - Body: JSON object
    - `url` (string): YouTube video URL.
- **Response:**
  - Status 200: Successful response with transcription data.
  - Status 400: Bad request with an error message.

### 2. Summarization with Llama API

- **Endpoint:** `https://llama.k8s-gosha.atlas.illinois.edu/completion`
- **Method:** POST
- **Description:** Generates a summary with bullet points for the transcribed text.
- **Request:**
  - Body: JSON object
    - `prompt` (string): Summarization prompt with the transcribed text.
    - `n_predict` (number): Number of predictions.
- **Response:**
  - Status 200: Successful response with summarized content.
  - Status 400: Bad request with an error message.

## Implementation Details

The Chrome Extension includes a content script that interacts with the YouTube page. Here's a breakdown of the key components:

- **Event Listeners:** The extension includes event listeners for user interactions with the filename input, download button, and clear button.

- **YouTube Link Detection:** It checks if the current URL is a YouTube link before initiating the API call sequence.

- **Error Handling:** Proper error handling ensures a smooth user experience even in the presence of issues.

## Getting Help

If you encounter any issues or have questions, feel free to open an issue on the [GitHub repository](https://github.com/Jeybird248/Chrome-Extension).

---
