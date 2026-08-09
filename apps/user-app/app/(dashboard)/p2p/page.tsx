import { SendCard } from "../../../components/SendCard";
import { P2PTransactions } from "../../../components/P2PTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getP2PTransactions() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (!userId) {
    return [];
  }

  const txns = await prisma.p2pTransfer.findMany({
    where: {
      OR: [
        {
          fromUserId: userId,
        },
        {
          toUserId: userId,
        },
      ],
    },
    orderBy: {
      timestamp: "desc",
    },
    include: {
      fromUser: true,
      toUser: true,
    },
  });
  return txns.map((t: (typeof txns)[number]) => ({
    id: t.id,
    time: t.timestamp,
    amount: t.amount,
    type: t.toUserId === userId ? ("received" as const) : ("sent" as const),
    counterpartyName:
      t.toUserId === userId
        ? t.fromUser.name || t.fromUser.number
        : t.toUser.name || t.toUser.number,
  }));
}

export default async function () {
  const transactions = await getP2PTransactions();
  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        P2P Transfer
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <SendCard />
        </div>
        <div>
          <P2PTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
