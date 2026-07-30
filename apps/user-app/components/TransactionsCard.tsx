import { Card } from "@repo/ui/card";

export type TransactionItem = {
  id: string;
  kind: "wallet" | "p2p";
  time: Date;
  amount: number;
  title: string;
  subtitle: string;
  direction: "credit" | "debit" | "neutral";
};

export const TransactionsCard = ({
  transactions,
}: {
  transactions: TransactionItem[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }

  return (
    <Card title="Recent Transactions">
      <div className="pt-2">
        {transactions.map((t) => (
          <div key={t.id} className="flex justify-between pb-2">
            <div>
              <div className="text-sm">{t.title}</div>
              <div className="text-slate-600 text-xs">
                {t.subtitle} - {t.time.toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              {t.direction === "neutral"
                ? ""
                : t.direction === "credit"
                  ? "+"
                  : "-"}{" "}
              Rs {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
