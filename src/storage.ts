type IStorage = {
    xupopterClient?: string;
    visibility?: string[];
};

const defaultStorage: IStorage = {
    xupopterClient: null,
    visibility: []
};

export const storage = {
    get: (): Promise<IStorage> =>
        chrome.storage.sync.get(defaultStorage) as Promise<IStorage>,
    set: (value: IStorage): Promise<void> => chrome.storage.sync.set(value)
};


export const shouldLoadOn = async (host: string) : Promise<boolean> => {
    const data = await storage.get();
    return data.visibility.includes(host);
};