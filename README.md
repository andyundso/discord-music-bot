# Discord Music Bot

## Installation

Install the dependencies:

````
npm install
````

If you want to test the changes against a real voice channel, you need a real Discord server.

1. Register an application at the [Discord developer portal](https://discord.com/developers/applications/).
2. Afterwards, copy the secret token which you find in the bot tab
3. Create a `.env` file in the root folder of this application with the content listed below
```
TOKEN=<TOKEN from step 2>
PREFIX=!
```
4. Go-to the OAuth2 tab in the developer portal and generate an invite link for your bot. Select the following privileges:
   1. `Send Messages`
   2. `Manage Messages`
   3. `Connect`
   4. `Speak`
5. With the generated link, invite the bot to one of your servers
6. Now, when you start the application with `npm run start:dev`, the bot is able to connect to your server
