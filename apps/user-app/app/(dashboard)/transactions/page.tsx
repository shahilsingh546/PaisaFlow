import { getServerSession } from "next-auth";
import { TransactionsCard } from "../../../components/TransactionsCard";
import { getUserTransactions } from "../../lib/getTransactions";
import { authOptions } from "../../lib/auth";

async function getTransactions() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (!userId) {
    return [];
  }

  return getUserTransactions(userId);
}

export default async function () {
  const transactions = await getTransactions();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transactions
      </div>
      <div className="p-4 max-w-xl">
        <TransactionsCard transactions={transactions} />
      </div>
    </div>
  );
}
