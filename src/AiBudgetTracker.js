import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, CreditCard, Brain, AlertCircle, Trash2 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AiBudgetTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [debts, setDebts] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddDebt, setShowAddDebt] = useState(false);

  const [transactionForm, setTransactionForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false
  });

  const [budgetForm, setBudgetForm] = useState({
    category: '',
    limit: '',
    period: 'monthly'
  });

  const [debtForm, setDebtForm] = useState({
    name: '',
    balance: '',
    interestRate: '',
    minimumPayment: '',
    dueDate: ''
  });

  useEffect(() => {
    const sampleTransactions = [
      { id: 1, type: 'income', amount: 5000, category: 'Salary', description: 'Monthly Salary', date: '2025-11-01', recurring: true },
      { id: 2, type: 'expense', amount: 1200, category: 'Rent', description: 'Monthly Rent', date: '2025-11-01', recurring: true },
      { id: 3, type: 'expense', amount: 150, category: 'Groceries', description: 'Weekly Shopping', date: '2025-11-02', recurring: false },
      { id: 4, type: 'expense', amount: 80, category: 'Utilities', description: 'Electric Bill', date: '2025-11-03', recurring: false },
      { id: 5, type: 'expense', amount: 200, category: 'Entertainment', description: 'Concert Tickets', date: '2025-11-04', recurring: false },
      { id: 6, type: 'income', amount: 500, category: 'Freelance', description: 'Design Project', date: '2025-11-05', recurring: false }
    ];

    const sampleBudgets = [
      { id: 1, category: 'Groceries', limit: 500, period: 'monthly', spent: 150 },
      { id: 2, category: 'Entertainment', limit: 300, period: 'monthly', spent: 200 },
      { id: 3, category: 'Utilities', limit: 200, period: 'monthly', spent: 80 },
      { id: 4, category: 'Transportation', limit: 250, period: 'monthly', spent: 0 }
    ];

    const sampleDebts = [
      { id: 1, name: 'Credit Card', balance: 2500, interestRate: 18.5, minimumPayment: 75, dueDate: '2025-11-15' },
      { id: 2, name: 'Student Loan', balance: 15000, interestRate: 5.5, minimumPayment: 200, dueDate: '2025-11-20' },
      { id: 3, name: 'Car Loan', balance: 8000, interestRate: 4.2, minimumPayment: 350, dueDate: '2025-11-10' }
    ];

    setTransactions(sampleTransactions);
    setBudgets(sampleBudgets);
    setDebts(sampleDebts);
    generateAiInsights(sampleTransactions, sampleBudgets, sampleDebts);
  }, []);

  const generateAiInsights = (trans, buds, deb) => {
    const insights = [];
    
    const totalExpenses = trans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = trans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1);

    insights.push({
      type: 'positive',
      title: 'Savings Rate',
      message: 'You are saving ' + savingsRate + '% of your income. Great job!'
    });

    buds.forEach(budget => {
      const percentage = (budget.spent / budget.limit * 100).toFixed(0);
      if (percentage > 80) {
        insights.push({
          type: 'warning',
          title: budget.category + ' Budget Alert',
          message: 'You have used ' + percentage + '% of your ' + budget.category + ' budget.'
        });
      }
    });

    const highInterestDebt = deb.filter(d => d.interestRate > 15);
    if (highInterestDebt.length > 0) {
      insights.push({
        type: 'alert',
        title: 'High Interest Debt',
        message: 'Consider paying off ' + highInterestDebt[0].name + ' first (' + highInterestDebt[0].interestRate + '% APR) to save on interest.'
      });
    }

    const avgDailySpending = totalExpenses / 5;
    const projectedMonthlySpending = avgDailySpending * 30;
    insights.push({
      type: 'info',
      title: 'Spending Forecast',
      message: 'Based on current trends, you will spend $' + projectedMonthlySpending.toFixed(0) + ' this month.'
    });

    setAiInsights(insights);
  };

  const addTransaction = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: Date.now(),
      type: transactionForm.type,
      amount: parseFloat(transactionForm.amount),
      category: transactionForm.category,
      description: transactionForm.description,
      date: transactionForm.date,
      recurring: transactionForm.recurring
    };
    const updated = [...transactions, newTransaction];
    setTransactions(updated);
    
    if (newTransaction.type === 'expense') {
      const updatedBudgets = budgets.map(b => {
        if (b.category === newTransaction.category) {
          return { ...b, spent: b.spent + newTransaction.amount };
        }
        return b;
      });
      setBudgets(updatedBudgets);
    }
    
    generateAiInsights(updated, budgets, debts);
    setShowAddTransaction(false);
    setTransactionForm({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      recurring: false
    });
  };

  const addBudget = (e) => {
    e.preventDefault();
    const newBudget = {
      id: Date.now(),
      category: budgetForm.category,
      limit: parseFloat(budgetForm.limit),
      period: budgetForm.period,
      spent: 0
    };
    const updated = [...budgets, newBudget];
    setBudgets(updated);
    generateAiInsights(transactions, updated, debts);
    setShowAddBudget(false);
    setBudgetForm({ category: '', limit: '', period: 'monthly' });
  };

  const addDebt = (e) => {
    e.preventDefault();
    const newDebt = {
      id: Date.now(),
      name: debtForm.name,
      balance: parseFloat(debtForm.balance),
      interestRate: parseFloat(debtForm.interestRate),
      minimumPayment: parseFloat(debtForm.minimumPayment),
      dueDate: debtForm.dueDate
    };
    const updated = [...debts, newDebt];
    setDebts(updated);
    generateAiInsights(transactions, budgets, updated);
    setShowAddDebt(false);
    setDebtForm({ name: '', balance: '', interestRate: '', minimumPayment: '', dueDate: '' });
  };

  const deleteTransaction = (id) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    generateAiInsights(updated, budgets, debts);
  };

  const deleteBudget = (id) => {
    const updated = budgets.filter(b => b.id !== id);
    setBudgets(updated);
    generateAiInsights(transactions, updated, debts);
  };

  const deleteDebt = (id) => {
    const updated = debts.filter(d => d.id !== id);
    setDebts(updated);
    generateAiInsights(transactions, budgets, updated);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netIncome = totalIncome - totalExpenses;
  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);

  const categoryData = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
  });
  const pieData = Object.keys(categoryData).map(key => ({
    name: key,
    value: categoryData[key]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Budget Tracker Pro</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Net Income</p>
                <p className={netIncome >= 0 ? 'text-xl font-bold text-green-600' : 'text-xl font-bold text-red-600'}>
                  ${netIncome.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {['dashboard', 'transactions', 'budgets', 'debts', 'insights'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Net Income</p>
                    <p className={netIncome >= 0 ? 'text-2xl font-bold text-green-600' : 'text-2xl font-bold text-red-600'}>
                      ${netIncome.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Debt</p>
                    <p className="text-2xl font-bold text-orange-600">${totalDebt.toFixed(2)}</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => name + ' ' + (percent * 100).toFixed(0) + '%'}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Budget vs Actual</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgets}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="limit" fill="#3b82f6" name="Budget" />
                    <Bar dataKey="spent" fill="#10b981" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                AI-Powered Insights
              </h3>
              <div className="space-y-3">
                {aiInsights.map((insight, idx) => {
                  const insightStyles = {
                    positive: 'bg-green-50 border-green-500',
                    warning: 'bg-yellow-50 border-yellow-500',
                    alert: 'bg-red-50 border-red-500',
                    info: 'bg-blue-50 border-blue-500'
                  };

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-l-4 ${insightStyles[insight.type] || insightStyles.info}`}
                    >
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Transactions</h2>
              <button
                onClick={() => setShowAddTransaction(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <PlusCircle className="w-5 h-5" />
                Add Transaction
              </button>
            </div>

            {showAddTransaction && (
              <form onSubmit={addTransaction} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={transactionForm.type}
                      onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={transactionForm.amount}
                      onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={transactionForm.category}
                      onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={transactionForm.date}
                      onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={transactionForm.description}
                      onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={transactionForm.recurring}
                        onChange={(e) => setTransactionForm({ ...transactionForm, recurring: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Recurring Transaction</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Add Transaction
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTransaction(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          t.type === 'income'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{t.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${t.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'budgets' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Budgets</h2>
              <button
                onClick={() => setShowAddBudget(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <PlusCircle className="w-5 h-5" />
                Add Budget
              </button>
            </div>

            {showAddBudget && (
              <form onSubmit={addBudget} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={budgetForm.category}
                      onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Limit</label>
                    <input
                      type="number"
                      step="0.01"
                      value={budgetForm.limit}
                      onChange={(e) => setBudgetForm({ ...budgetForm, limit: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                    <select
                      value={budgetForm.period}
                      onChange={(e) => setBudgetForm({ ...budgetForm, period: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Add Budget
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddBudget(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.map((budget) => {
                const percentage = (budget.spent / budget.limit * 100).toFixed(0);
                return (
                  <div key={budget.id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{budget.category}</h3>
                        <p className="text-sm text-gray-500 capitalize">{budget.period}</p>
                      </div>
                      <button
                        onClick={() => deleteBudget(budget.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent: ${budget.spent.toFixed(2)}</span>
                        <span>Limit: ${budget.limit.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            percentage > 90
                              ? 'bg-red-600'
                              : percentage > 70
                              ? 'bg-yellow-500'
                              : 'bg-green-600'
                          }`}
                          style={{ width: Math.min(percentage, 100) + '%' }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">{percentage}% used</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'debts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Debt Management</h2>
              <button
                onClick={() => setShowAddDebt(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <PlusCircle className="w-5 h-5" />
                Add Debt
              </button>
            </div>

            {showAddDebt && (
              <form onSubmit={addDebt} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={debtForm.name}
                      onChange={(e) => setDebtForm({ ...debtForm, name: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
                    <input
                      type="number"
                      step="0.01"
                      value={debtForm.balance}
                      onChange={(e) => setDebtForm({ ...debtForm, balance: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={debtForm.interestRate}
                      onChange={(e) => setDebtForm({ ...debtForm, interestRate: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Payment</label>
                    <input
                      type="number"
                      step="0.01"
                      value={debtForm.minimumPayment}
                      onChange={(e) => setDebtForm({ ...debtForm, minimumPayment: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={debtForm.dueDate}
                      onChange={(e) => setDebtForm({ ...debtForm, dueDate: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Add Debt
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddDebt(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 gap-4">
              {debts.map((debt) => (
                <div key={debt.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{debt.name}</h3>
                      <p className="text-sm text-gray-500">Due: {debt.dueDate}</p>
                    </div>
                    <button
                      onClick={() => deleteDebt(debt.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Balance</p>
                      <p className="text-lg font-semibold text-gray-900">${debt.balance.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <p className="text-lg font-semibold text-orange-600">{debt.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Min Payment</p>
                      <p className="text-lg font-semibold text-gray-900">${debt.minimumPayment.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Interest</p>
                      <p className="text-lg font-semibold text-red-600">
                        ${((debt.balance * debt.interestRate / 100) / 12).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">AI-Powered Financial Insights</h2>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Smart Recommendations
              </h3>
              <div className="space-y-3">
                {aiInsights.map((insight, idx) => {
                  const insightStyles = {
                    positive: 'bg-green-50 border-green-500',
                    warning: 'bg-yellow-50 border-yellow-500',
                    alert: 'bg-red-50 border-red-500',
                    info: 'bg-blue-50 border-blue-500'
                  };

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-l-4 ${insightStyles[insight.type] || insightStyles.info}`}
                    >
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Financial Health Score</h3>
                <div className="flex items-center justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="transform -rotate-90 w-40 h-40">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#10b981"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * 75) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">75</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Your financial health is Good. Keep up the great work!
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Debt Payoff Strategy</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Avalanche Method</p>
                      <p className="text-sm text-gray-600">Pay highest interest first</p>
                    </div>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Snowball Method</p>
                      <p className="text-sm text-gray-600">Pay smallest balance first</p>
                    </div>
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Recommended: Use Avalanche method to save ${((debts.reduce((sum, d) => sum + (d.balance * d.interestRate / 100), 0)) * 0.3).toFixed(0)} in interest over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AiBudgetTracker;