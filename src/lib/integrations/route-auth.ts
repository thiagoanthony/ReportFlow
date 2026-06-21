import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function getIntegrationContext(clientId: string) {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return null;

  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      agency: { userId: user.id },
    },
  });

  if (!client) return null;
  return { session, client };
}
