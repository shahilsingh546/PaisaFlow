import { Card } from "@repo/ui/card";

export const P2PTransactions = ({
  transactions,
}: {
  transactions: {
    id: number;
    time: Date;
    amount: number;
    type: "sent" | "received";
    counterpartyName: string;
  }[];
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
          <div key={t.id} className="flex justify-between">
            <div>
              <div className="text-sm">
                {t.type === "received" ? "Received INR" : "Sent INR"}
              </div>
              <div className="text-slate-600 text-xs">
                {t.type === "received" ? "From" : "To"} {t.counterpartyName} -{" "}
                {t.time.toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              {t.type === "received" ? "+" : "-"} Rs {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
