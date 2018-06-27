# Find my Mac

Open Source and self-hosted version of "Find my Mac". Using Docker and Node.js.

Reports the following data:
- Currently connected Wifi Network
- Available Wifi Networks in the surrounding
- Public IP address
- Screenshot
- Picture taken by the camera

## Requirements

- Install imagesnap (e.g. w/ Homebrew `brew install imagesnap`)

## Installation

- Run Docker container
- Adjust variable `DOMAIN` in the file report.sh
- Register report.sh in launchd (or as LoginHook)

## Activation

- Reports will only be sent, if service is activated
 - To do so create a file called `activated.flag` in the working directory of the Docker container

## Todo / Future Enhancements

- Take multiple pictures, screenshots (maybe also detect changes)
 - Cache images until connection is available
- Survive wipes
- Web UI (incl. data visualization)
