import prisma from "@repo/db/client";
import type { TransactionItem } from "../../components/TransactionsCard";

export async function getUserTransactions(
  userId: number,
): Promise<TransactionItem[]> {
  const [onRampTransactions, p2pTransactions] = await Promise.all([
    prisma.onRampTransaction.findMany({
      where: {
        userId,
      },
    }),
    prisma.p2pTransfer.findMany({
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
      include: {
        fromUser: true,
        toUser: true,
      },
    }),
  ]);

  const walletTransactions = onRampTransactions.map((t): TransactionItem => {
    const isSuccess = t.status === "Success";

    return {
      id: `onramp-${t.id}`,
      kind: "wallet",
      time: t.startTime,
      amount: t.amount,
      title: isSuccess
        ? "Added to wallet"
        : t.status === "Processing"
          ? "Adding to wallet"
          : "Wallet add failed",
      subtitle: `${t.provider} - ${t.status}`,
      direction: isSuccess ? "credit" : "neutral",
    };
  });

  const transferTransactions = p2pTransactions.map((t): TransactionItem => {
    const isReceived = t.toUserId === userId;
    const counterparty = isReceived ? t.fromUser : t.toUser;

    return {
      id: `p2p-${t.id}`,
      kind: "p2p",
      time: t.timestamp,
      amount: t.amount,
      title: isReceived ? "Received INR" : "Sent INR",
      subtitle: `${isReceived ? "From" : "To"} ${counterparty.name || counterparty.number}`,
      direction: isReceived ? "credit" : "debit",
    };
  });

  return [...walletTransactions, ...transferTransactions].sort(
    (a, b) => b.time.getTime() - a.time.getTime(),
  );
}
