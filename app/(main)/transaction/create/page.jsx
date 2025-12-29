import { defaultCategories } from "@/data/categories";
import { Card, CardContent } from "@/components/ui/card";

export default async function AddTransactionPage({ searchParams }) {
  // Mock accounts for demo
  const mockAccounts = [
    { id: 1, name: "Checking Account", balance: 5000 },
    { id: 2, name: "Savings Account", balance: 15000 },
  ];

  const editId = searchParams?.edit;

  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl gradient-title ">Add Transaction</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-600 text-center">Demo Mode - Transaction form would go here</p>
            
            {/* Demo Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input 
                  type="text" 
                  placeholder="Enter transaction description"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Account</label>
                <select className="w-full p-2 border rounded-md">
                  {mockAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} (${account.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select className="w-full p-2 border rounded-md">
                  {defaultCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <button className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
                {editId ? "Update Transaction" : "Add Transaction"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
