declare module "omise-react-native" {
  export interface Token {
    id: string;
    livemode: boolean;
    location: string;
    used: boolean;
    card: {
      id: string;
      livemode: boolean;
      country: string;
      city: string;
      postal_code: string;
      financing: string;
      last_digits: string;
      brand: string;
      expiration_month: number;
      expiration_year: number;
      fingerprint: string;
      name: string;
      security_code_check: boolean;
      created: string;
    };
    created: string;
  }

  export interface Omise {
    config: (PUBLIC_KEY: string, SECRET_KEY: string) => void;
    createToken: (params: {
      card: {
        name: string;
        city: string;
        postal_code: number;
        number: string;
        expiration_month: number;
        expiration_year: number;
        security_code: number;
      };
    }) => Promise<Token>;
  }

  const omise: Omise;
  export default omise;
}
