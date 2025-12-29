import EmailTemplate from './template.jsx';

// Dummy data for preview
const PREVIEW_DATA = {
  monthlyReport: {
    userName: "John Doe",
    type: "monthly-report",
    data: {
      month: "December",
      stats: {
        totalIncome: 5000,
        totalExpenses: 3500,
        byCategory: {
          housing: 1500,
          groceries: 600,
          transportation: 400,
          entertainment: 300,
          utilities: 700,
        },
      },
      insights: [
        "Your housing expenses are 43% of your total spending - consider reviewing your housing costs.",
        "Great job keeping entertainment expenses under control this month!",
        "Setting up automatic savings could help you save 20% more of your income.",
      ],
    },
  },
  budgetAlert: {
    userName: "John Doe",
    type: "budget-alert",
    data: {
      percentageUsed: 85,
      budgetAmount: 4000,
      totalExpenses: 3400,
    },
  },
};

export default function EmailPreview() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Email Templates Preview</h2>
      
      <div style={{ marginBottom: '40px' }}>
        <h3>Monthly Report</h3>
        <EmailTemplate 
          userName={PREVIEW_DATA.monthlyReport.userName}
          type={PREVIEW_DATA.monthlyReport.type}
          data={PREVIEW_DATA.monthlyReport.data}
        />
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <h3>Budget Alert</h3>
        <EmailTemplate 
          userName={PREVIEW_DATA.budgetAlert.userName}
          type={PREVIEW_DATA.budgetAlert.type}
          data={PREVIEW_DATA.budgetAlert.data}
        />
      </div>
    </div>
  );
}
