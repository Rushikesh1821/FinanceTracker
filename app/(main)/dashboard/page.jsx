import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  // Demo data - replace with real data when database is set up
  const mockAccounts = [
    { id: 1, name: "Checking Account", balance: 5000, type: "checking" },
    { id: 2, name: "Savings Account", balance: 15000, type: "savings" },
  ];

  const mockTransactions = [
    { id: 1, description: "Grocery Store", amount: -150, type: "expense" },
    { id: 2, description: "Salary", amount: 3000, type: "income" },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Demo Mode - Database not connected</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Balance</h3>
            <p className="text-2xl font-bold">$20,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-600">Monthly Income</h3>
            <p className="text-2xl font-bold text-green-600">$3,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-600">Monthly Expenses</h3>
            <p className="text-2xl font-bold text-red-600">$1,500</p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Accounts</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
          {mockAccounts.map((account) => (
            <Card key={account.id}>
              <CardContent className="p-6">
                <h3 className="font-semibold">{account.name}</h3>
                <p className="text-2xl font-bold">${account.balance.toLocaleString()}</p>
                <p className="text-sm text-gray-600 capitalize">{account.type}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <Card>
          <CardContent className="p-6">
            {mockTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span>{transaction.description}</span>
                <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : ''}${transaction.amount}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
