export interface WalletInterface {
  status: boolean;
  message: string;
  data: {
    transactions: string[];
    subscriptions: string[];
    authorizations: string[];
    domain: string;
    customer_code: string;
    risk_action: string;
    metadata:{id: string};
  };
}
