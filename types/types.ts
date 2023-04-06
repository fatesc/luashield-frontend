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
    key: number;

    Whitelisted: boolean;

    CreatedAt: Date;
};

export interface Project {
    id: string;
    Name: string;
    SuccessWebhook: string;
    BlacklistWebhook: string;
    UnauthorizedWebhook: string;
    Owner: string;

    Online: boolean;
    SynapseX: boolean;
    ScriptWare: boolean;
    SynapseV3: boolean;

    Executions: number;
    CrackAttempts: number;
    Users: number;

    Scripts?: Script[]
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
    APIKey: string;
    Username: string;
    SubscriptionID: string;
    Projects: string[];

    Subscription: Subscription;

    Admin?: boolean;
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