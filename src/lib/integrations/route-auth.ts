import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function getIntegrationContext(clientId: string) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) return null;

  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      agency: { userId: session.user.id },
    },
  });

  if (!client) return null;
  return { session, client };
}
