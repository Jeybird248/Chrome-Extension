# Youtube Video Note Taker
A project to streamline video to transcript conversion with automatic PDF note generation.

## Introduction

This project simplifies the process of converting videos to transcripts and generating PDFs from the transcripts.

[](demo.mp4)

## Prerequisites

- API credentials for video conversion

## Getting Started

1. Clone this repository.
2. Configure API credentials.
3. Install as Google Chrome Extension.

## Usage

1. Enter a filename and click "Download."
2. The system will download the video and create a transcript.
3. The transcript is transformed into organized notes.
4. Download the PDF of organized notes.

## API Endpoints

### 1. Downloading Video API

- **Endpoint:** `/api/download-video`
- **Method:** POST
- **Description:** Downloads video based on the provided filename.
- **Request:**
  - Body: JSON object
    - `filename` (string): Name of the video file.
- **Response:**
  - Status 200: Successful response with video data
  - Status 400: Bad request with an error message

### 2. Video to Transcript API

- **Endpoint:** `/api/video-to-transcript`
- **Method:** POST
- **Description:** Converts a video into a transcript, making it easier to work with textual content from the video.
- **Request:**
  - Body: JSON object
    - `videoFile` (string): Base64 encoded video data.
- **Response:**
  - Status 200: Successful response with the `transcript` property containing the video transcript.
  - Status 400: Bad request with an error message.

### 3. Transcript to Organized Notes API

- **Endpoint:** `/api/transcript-to-notes`
- **Method:** POST
- **Description:** Transforms a transcript into organized notes, simplifying the structure and content for easy consumption.
- **Request:**
  - Body: JSON object
    - `transcript` (string): The transcript to be converted.
- **Response:**
  - Status 200: Successful response with the `notes` property containing the organized notes in a string format.
  - Status 400: Bad request with an error message.

## License

This project is licensed under the [MIT License](LICENSE).

