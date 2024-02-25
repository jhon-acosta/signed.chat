export interface UsuarioChat {
  _id: string;
  username: string;
  avatar: string;
  estado?: "online" | "offline";
  publicKey?: string;
  privateKey?: string;
}
