/// <reference types="vite/client" />

declare module "@/lib/shared/kliv-auth.js" {
  const auth: any;
  export default auth;
}

declare module "@/lib/shared/kliv-database.js" {
  const db: any;
  export default db;
}

declare module "@/lib/shared/kliv-content.js" {
  export const content: any;
}

declare module "@/lib/shared/kliv-functions.js" {
  const functions: any;
  export default functions;
}
