import { getServerSession } from "next-auth";
import Link from "next/link";
import prisma from "@repo/db/client";
import { Card } from "@repo/ui/card";
import { BalanceCard } from "../../../components/BalanceCard";
import { TransactionsCard } from "../../../components/TransactionsCard";
import type { TransactionItem } from "../../../components/TransactionsCard";
import { authOptions } from "../../lib/auth";
import { getUserTransactions } from "../../lib/getTransactions";

async function getBalance(userId: number) {
  const balance = await prisma.balance.findUnique({
    where: {
      userId,
    },
  });

  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

function formatAmount(amount: number) {
  return `Rs ${amount / 100}`;
}

function getTransactionTotal(
  transactions: TransactionItem[],
  predicate: (transaction: TransactionItem) => boolean,
) {
  return transactions
    .filter(predicate)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

function SummaryTile({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="pt-2 text-2xl font-semibold text-slate-900">{value}</div>
      <div className="pt-1 text-xs text-slate-500">{detail}</div>
    </div>
  );
}

function QuickAction({
  href,
  label,
  detail,
}: {
  href: string;
  label: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="block border-b border-slate-300 py-3 last:border-b-0 hover:text-[#6a51a6]"
    >
      <div className="font-medium text-slate-900">{label}</div>
      <div className="pt-1 text-sm text-slate-500">{detail}</div>
    </Link>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  const [balance, transactions] = userId
    ? await Promise.all([getBalance(userId), getUserTransactions(userId)])
    : [
        {
          amount: 0,
          locked: 0,
        },
        [],
      ];

  const addedToWallet = getTransactionTotal(
    transactions,
    (transaction) =>
      transaction.kind === "wallet" && transaction.direction === "credit",
  );
  const sentAmount = getTransactionTotal(
    transactions,
    (transaction) =>
      transaction.kind === "p2p" && transaction.direction === "debit",
  );
  const receivedAmount = getTransactionTotal(
    transactions,
    (transaction) =>
      transaction.kind === "p2p" && transaction.direction === "credit",
  );

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">Home</div>
      <div className="p-4 max-w-6xl">
        <div className="mb-5">
          <div className="text-2xl font-semibold text-slate-900">
            Welcome{session?.user?.name ? `, ${session.user.name}` : ""}
          </div>
          <div className="text-sm text-slate-600">
            Here is your wallet summary and latest activity.
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SummaryTile
            label="Available balance"
            value={formatAmount(balance.amount)}
            detail="Ready to transfer"
          />
          <SummaryTile
            label="Added to wallet"
            value={formatAmount(addedToWallet)}
            detail="Successful wallet loads"
          />
          <SummaryTile
            label="P2P received"
            value={formatAmount(receivedAmount)}
            detail={`Sent out: ${formatAmount(sentAmount)}`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
          <BalanceCard amount={balance.amount} locked={balance.locked} />

          <Card title="Quick Actions">
            <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3 lg:grid-cols-1">
              <QuickAction
                href="/transfer"
                label="Add Money"
                detail="Load funds into wallet"
              />
              <QuickAction
                href="/p2p"
                label="Send Money"
                detail="Transfer to another user"
              />
              <QuickAction
                href="/transactions"
                label="View Transactions"
                detail="Open full history"
              />
            </div>
          </Card>
        </div>

        <div className="pt-4 max-w-xl">
          <TransactionsCard transactions={transactions.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
