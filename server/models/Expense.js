const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: ['Seeds', 'Fertilizer', 'Diesel', 'Labour', 'Pesticide', 'Irrigation', 'Other'],
                message: '{VALUE} is not a valid category',
            },
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount cannot be negative'],
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
            default: Date.now,
        },
        note: {
            type: String,
            trim: true,
            maxlength: [500, 'Note cannot exceed 500 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Index for fast user-specific queries
expenseSchema.index({ userId: 1, date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
