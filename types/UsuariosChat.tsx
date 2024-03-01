export interface UsuarioChat {
  _id: string;
  username: string;
  avatar: string;
  estado?: "online" | "offline";
  publicKey?: string;
  privateKey?: {
    originFileObj?: Blob;
    
  };
}

export interface Chat {
  fecha: string;
  from: {
    username: string;
    mensaje: string;
  };
  to: {
    username: string;
    mensaje: string;
  };
}

export interface ChatVista {
  from: string;
  to: string;
  alineacion: string;
  mensaje: string;
  fecha: string;
}
