export interface Config {
  rewards: {
    [key: string]: number; // key is the role id, value is the invite count
  };
}
