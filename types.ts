export interface User {
    id: string;
    Key: string;
    Username: string;
    ProjectID: string;
    HWID?: string;
    Exploit?: string;
    Note?: string;
    DiscordID?: string;

    Executions: number;
    CrackAttempts: number;
    MaxExecutions: number;
    ExpireAt?: number;

    Whitelisted: boolean;

    CreatedAt: Date;
};

export interface Project {
    id: string;
    Name: string;
    SuccessWebhook: string;
    BlacklistWebhook: string;
    UnaunthorizedWebhook: string;
    Owner: string;

    Executions: number;
    CrackAttempts: number;
    Users: number;

    Online: number;
    SynapseX: number;
    ScriptWare: number;
    SynapseV3: number;
};

export interface Script {
    id: string;
    Name: string;
    ProjectID: string;
    Version: string;
    Versions: string[];  
};

export interface Buyer {
    id: string;
    Email: string;
    Password: string;
    APIKey: string;
    Username: string;
    SubscriptionID: string;
    Projects: string[];
};

export interface Subscription {
    SubscriptionID: string;
    Email?: string;

    Expire: number;
    Reset: number;
    Obfuscations?: number;
    Projects?: number;
    Scripts?: number;
};