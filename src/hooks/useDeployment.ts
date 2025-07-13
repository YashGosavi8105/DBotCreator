
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Make sure this matches the type in DeploymentStatus.tsx
type DeploymentStatus = 'idle' | 'preparing' | 'generating' | 'complete' | 'error';

export interface DeploymentOptions {
  apiKey?: string;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface BotData {
  name: string;
  description: string;
  features: { name: string; description: string }[];
  [key: string]: any;
}

export interface DeploymentResult {
  success: boolean;
  downloadUrl?: string;
  setupInstructions?: string;
  error?: string;
}

export const useDeployment = (options: DeploymentOptions = {}) => {
  const [status, setStatus] = useState<DeploymentStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [setupInstructions, setSetupInstructions] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(options?.apiKey || '');
  const { toast } = useToast();
  
  // Function to generate a downloadable Discord bot
  const deployBot = async (botData: BotData): Promise<DeploymentResult> => {
    try {
      setStatus('preparing');
      
      // Preparation step
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('generating');
      
      // Generate the bot files based on the features
      // In a real implementation, this would generate actual files
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Instead of a server-side download, let's create a data blob for download
      // This will work in the browser without needing a server to handle the download
      
      // Generate actual code for the bot based on features
      const hasModerationFeature = botData.features.some(f => 
        f.name.toLowerCase().includes('moderation') || 
        f.description.toLowerCase().includes('moderation')
      );
      
      const hasMusicFeature = botData.features.some(f => 
        f.name.toLowerCase().includes('music') || 
        f.description.toLowerCase().includes('music')
      );
      
      const hasWelcomeFeature = botData.features.some(f => 
        f.name.toLowerCase().includes('welcome') || 
        f.description.toLowerCase().includes('welcome') ||
        f.name.toLowerCase().includes('greet') || 
        f.description.toLowerCase().includes('greet')
      );
      
      // Create a simple text representation of what would be in the zip
      const fakeZipContent = `
Discord Bot: ${botData.name}
Description: ${botData.description}

Files included:
- index.js (Main bot code)
- .env.example (Configuration template)
- package.json (Dependencies)
- README.md (Setup instructions)

Features implemented:
${botData.features.map(f => `- ${f.name}: ${f.description}`).join('\n')}

This is a simulated download. In a production app, this would be a real zip file with working code.
      `;
      
      // Create a blob with the text content (not actually a zip file)
      const blob = new Blob([fakeZipContent], { type: 'text/plain' });
      const downloadUrl = URL.createObjectURL(blob);
      
      setDownloadUrl(downloadUrl);
      
      // Generate setup instructions
      const setupInstructions = generateSetupInstructions(botData);
      setSetupInstructions(setupInstructions);
      
      setStatus('complete');
      
      toast({
        title: "Bot Generated Successfully",
        description: `Your bot "${botData.name}" is ready to download`,
      });
      
      if (options.onComplete) {
        options.onComplete();
      }
      
      return {
        success: true,
        downloadUrl,
        setupInstructions
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown generation error');
      setError(error);
      setStatus('error');
      
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
      
      if (options.onError) {
        options.onError(error);
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Generate simple setup instructions based on the bot features including sample code
  const generateSetupInstructions = (botData: BotData): string => {
    const hasModerationFeature = botData.features.some(f => 
      f.name.toLowerCase().includes('moderation') || 
      f.description.toLowerCase().includes('moderation')
    );
    
    const hasMusicFeature = botData.features.some(f => 
      f.name.toLowerCase().includes('music') || 
      f.description.toLowerCase().includes('music')
    );
    
    const hasWelcomeFeature = botData.features.some(f => 
      f.name.toLowerCase().includes('welcome') || 
      f.description.toLowerCase().includes('welcome') ||
      f.name.toLowerCase().includes('greet') || 
      f.description.toLowerCase().includes('greet')
    );
    
    // Generate sample code based on features
    const sampleCode = `
\`\`\`javascript
// index.js - Main bot file for ${botData.name}
require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    ${hasMusicFeature ? 'GatewayIntentBits.GuildVoiceStates,' : ''}
    ${hasWelcomeFeature ? 'GatewayIntentBits.GuildMembers,' : ''}
  ]
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, () => {
  console.log(\`Ready! Logged in as \${client.user.tag}\`);
  console.log(\`Invite link: https://discord.com/api/oauth2/authorize?client_id=\${client.user.id}&permissions=8&scope=bot%20applications.commands\`);
});

${hasWelcomeFeature ? `
// Welcome new members
client.on(Events.GuildMemberAdd, (member) => {
  const channel = member.guild.systemChannel;
  if (!channel) return;
  
  channel.send(\`Welcome to the server, \${member.user.toString()}!\`);
});
` : ''}

${hasModerationFeature ? `
// Moderation: Delete messages with bad words
client.on(Events.MessageCreate, (message) => {
  // Skip messages from bots
  if (message.author.bot) return;
  
  const badWords = ['badword1', 'badword2', 'badword3'];
  
  if (badWords.some(word => message.content.toLowerCase().includes(word))) {
    message.delete();
    message.channel.send(\`\${message.author.toString()}, please watch your language!\`);
  }
});
` : ''}

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
\`\`\`

\`\`\`
# .env.example - Rename to .env and add your bot token
DISCORD_TOKEN=your_bot_token_here
\`\`\`

\`\`\`json
// package.json - Dependencies for your bot
{
  "name": "${botData.name.toLowerCase()}-bot",
  "version": "1.0.0",
  "description": "${botData.description}",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "discord.js": "^14.14.1",
    "dotenv": "^16.3.1"${hasMusicFeature ? ',\n    "discord-player": "^6.6.6"' : ''}
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
\`\`\`
`;
    
    return `
## Quick Setup for ${botData.name}

1. **Download** the bot files using the button above.
2. **Extract** the zip file to a folder on your computer.
3. **Install Node.js** if you haven't already (download from [nodejs.org](https://nodejs.org/)).
4. **Open a terminal** in the extracted folder.
5. **Install dependencies**: \`npm install\`
6. **Create a Discord bot**:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and name it "${botData.name}"
   - Go to the "Bot" tab and click "Add Bot"
   - Under "Privileged Gateway Intents" enable:
     - Message Content Intent
     ${hasMusicFeature ? '- Voice Intent' : ''}
     ${hasWelcomeFeature ? '- Server Members Intent' : ''}
   - Copy your bot token (you'll need this in the next step)
7. **Configure the bot**:
   - Rename \`.env.example\` to \`.env\`
   - Paste your Discord bot token into the \`.env\` file
${hasModerationFeature ? '   - Customize the moderation words in `index.js`\n' : ''}${hasMusicFeature ? '   - Make sure your server has ffmpeg installed for music features\n' : ''}
8. **Start the bot**: \`npm start\`
9. **Invite the bot** to your server using the invite link printed in console.

## Bot Code

Below is the code that's included in the download:

${sampleCode}

## Next Steps

- Add more commands by extending the code
- Store data in a database for persistence
- Host your bot on a service like [Railway](https://railway.app/), [Heroku](https://www.heroku.com/), or [Replit](https://replit.com/) to keep it online 24/7
`;
  };
  
  const reset = () => {
    setStatus('idle');
    setError(null);
    setDownloadUrl(null);
    setSetupInstructions(null);
  };
  
  return {
    status,
    error,
    downloadUrl,
    setupInstructions,
    isDeploying: status === 'preparing' || status === 'generating',
    isComplete: status === 'complete',
    isError: status === 'error',
    isIdle: status === 'idle',
    deployBot,
    reset,
    setApiKey,
    apiKey
  };
};
