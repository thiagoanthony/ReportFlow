import sqlite3
from pathlib import Path


def read_database_path() -> Path:
    env_path = Path(".env")
    if not env_path.exists():
        raise SystemExit("Arquivo .env nao encontrado. Copie .env.example para .env primeiro.")

    for line in env_path.read_text(encoding="utf-8-sig").splitlines():
        if line.startswith("DATABASE_URL="):
            value = line.split("=", 1)[1].strip().strip('"')
            if value.startswith("file:"):
                return Path(value[5:])

    raise SystemExit("DATABASE_URL=file:... nao encontrada no .env")


db_path = read_database_path()
db_path.parent.mkdir(parents=True, exist_ok=True)

conn = sqlite3.connect(db_path)
conn.execute("PRAGMA foreign_keys = ON")
conn.executescript(
    r'''
CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT, "email" TEXT NOT NULL UNIQUE, "emailVerified" DATETIME, "image" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS "Account" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "type" TEXT NOT NULL, "provider" TEXT NOT NULL, "providerAccountId" TEXT NOT NULL, "refresh_token" TEXT, "access_token" TEXT, "expires_at" INTEGER, "token_type" TEXT, "scope" TEXT, "id_token" TEXT, "session_state" TEXT, CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE);
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE TABLE IF NOT EXISTS "Session" ("id" TEXT NOT NULL PRIMARY KEY, "sessionToken" TEXT NOT NULL UNIQUE, "userId" TEXT NOT NULL, "expires" DATETIME NOT NULL, CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE);
CREATE TABLE IF NOT EXISTS "VerificationToken" ("identifier" TEXT NOT NULL, "token" TEXT NOT NULL UNIQUE, "expires" DATETIME NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE TABLE IF NOT EXISTS "Agency" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "userId" TEXT NOT NULL UNIQUE, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Agency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE);
CREATE TABLE IF NOT EXISTS "Client" ("id" TEXT NOT NULL PRIMARY KEY, "agencyId" TEXT NOT NULL, "name" TEXT NOT NULL, "active" BOOLEAN NOT NULL DEFAULT 1, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Client_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE CASCADE ON UPDATE CASCADE);
CREATE TABLE IF NOT EXISTS "Integration" ("id" TEXT NOT NULL PRIMARY KEY, "clientId" TEXT NOT NULL, "platform" TEXT NOT NULL, "accessToken" TEXT NOT NULL, "refreshToken" TEXT, "expiresAt" DATETIME, "accountId" TEXT NOT NULL, "accountName" TEXT NOT NULL, "active" BOOLEAN NOT NULL DEFAULT 1, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Integration_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE);
CREATE UNIQUE INDEX IF NOT EXISTS "Integration_clientId_platform_accountId_key" ON "Integration"("clientId", "platform", "accountId");
CREATE TABLE IF NOT EXISTS "Report" ("id" TEXT NOT NULL PRIMARY KEY, "clientId" TEXT NOT NULL, "periodStart" DATETIME NOT NULL, "periodEnd" DATETIME NOT NULL, "status" TEXT NOT NULL DEFAULT 'PENDING', "data" TEXT, "aiAnalysis" TEXT, "pdfUrl" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Report_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE);
'''
)
conn.commit()
conn.close()

print(f"Banco pronto em {db_path}")
