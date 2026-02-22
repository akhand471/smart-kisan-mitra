const asyncHandler = require('../middleware/asyncHandler');
const Expense = require('../models/Expense');

// ─── @desc   Add a new expense
// ─── @route  POST /api/expenses
// ─── @access Protected
const addExpense = asyncHandler(async (req, res) => {
    const { category, amount, date, note } = req.body;

    if (!category || amount === undefined) {
        return res.status(400).json({ success: false, message: 'Category and amount are required' });
    }
    if (Number(amount) < 0) {
        return res.status(400).json({ success: false, message: 'Amount cannot be negative' });
    }

    const expense = await Expense.create({
        userId: req.user._id,
        category,
        amount: Number(amount),
        date: date || Date.now(),
        note,
    });

    res.status(201).json({ success: true, message: 'Expense added', expense });
});

// ─── @desc   Get all expenses for logged-in user
// ─── @route  GET /api/expenses
// ─── @access Protected
const getExpenses = asyncHandler(async (req, res) => {
    const { month, year, category } = req.query;

    const filter = { userId: req.user._id };

    // Optional date filtering
    if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        filter.date = { $gte: startDate, $lte: endDate };
    }

    if (category) {
        filter.category = category;
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    // Calculate totals
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.status(200).json({
        success: true,
        count: expenses.length,
        total,
        expenses,
    });
});

// ─── @desc   Delete an expense by ID
// ─── @route  DELETE /api/expenses/:id
// ─── @access Protected
const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Ensure the expense belongs to the requesting user
    if (expense.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.status(200).json({ success: true, message: 'Expense deleted' });
});

module.exports = { addExpense, getExpenses, deleteExpense };
