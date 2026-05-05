declare module 'bcryptjs' {
  const bcrypt: {
    genSaltSync(rounds?: number): string;
    genSalt(rounds: number): Promise<string>;
    hashSync(s: string, salt: string | number): string;
    hash(s: string, salt: string | number): Promise<string>;
    compareSync(s: string, hash: string): boolean;
    compare(s: string, hash: string): Promise<boolean>;
    getRounds(hash: string): number;
  };
  export default bcrypt;
}
