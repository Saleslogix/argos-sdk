# Infor CRM Argos Platform SDK
argos-sdk is a JavaScript and HTML5 mobile SDK built on top of the [dojo library](http://dojotoolkit.org/). Out of the box it comes with a [SData client library](https://github.com/Saleslogix/SDataJavaScriptClientLib) for communicating to [SData](http://sage.github.io/SData-2.0/pages/core/0100/) endpoints.

## Installation

### Prerequisites

- [NodeJS](https://nodejs.org)

### Clone repository

- Open a command prompt.
- change to the base directory where you want to download source code, eg

  `cd C:\code`

- Execute the following commands (clone shown with SSH URL. Substitute with HTTP or Git Read-Only URL as applicable)

  - `mkdir mobile`
  - `cd mobile`
  - `git clone git@github.com:Saleslogix/argos-sdk.git`

You should end up with a folder structure like this:

- C:\code\mobile\argos-sdk\
- C:\code\mobile\products\

The products sub-folder is for applications that reference the SDK.

### Building the source
- Open a command prompt in the argos-sdk directory (C:\code\mobile\argos-sdk)
- Run `npm install` to install dependencies specified in the project.json file
- Run `npm run build`

### Development

Ensure you have a MIME type setup for .less files. Example using web.config in IIS:

```
<system.webServer>
    <staticContent>
            <mimeMap fileExtension=".less" mimeType="text/css" />
    </staticContent>
</system.webServer>
```
