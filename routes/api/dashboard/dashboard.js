var models = require('../../../models');
const { Op } = require('sequelize');
const moment = require('moment'); 

exports.getExpense = async function (req, res) {
    try{
        try {
            // Get today's and last month's date ranges
            const todayStart = moment().startOf('day').toDate();
            const todayEnd = moment().endOf('day').toDate();
            const lastMonthStart = moment().subtract(1, 'months').startOf('month').toDate();
            const lastMonthEnd = moment().subtract(1, 'months').endOf('month').toDate();
    
            // Queries
    
            // 1. Last month's expenses
            const lastMonthExpense = await models.Transaction.sum('amount', {
                where: {
                    type: '1',
                    date: {
                        [Op.between]: [lastMonthStart, lastMonthEnd]
                    },
                    userId: req.user.id
                }
            });
    
            // 2. Last month's income
            const lastMonthIncome = await models.Transaction.sum('amount', {
                where: {
                    type: '0',
                    date: {
                        [Op.between]: [lastMonthStart, lastMonthEnd]
                    },
                    userId: req.user.id
                }
            });
    
            // 3. Today's expenses
            const todayExpense = await models.Transaction.sum('amount', {
                where: {
                    type: '1',
                    date: {
                        [Op.between]: [todayStart, todayEnd]
                    },
                    userId: req.user.id
                }
            });
    
            // 4. Today's income
            const todayIncome = await models.Transaction.sum('amount', {
                where: {
                    type: '0',
                    date: {
                        [Op.between]: [todayStart, todayEnd]
                    },
                    userId: req.user.id
                }
            });
    
            // 5. Total expenses
            const totalExpense = await models.Transaction.sum('amount', {
                where: {
                    type: '1',
                    userId: req.user.id
                }
                
            });
    
            // 6. Total income
            const totalIncome = await models.Transaction.sum('amount', {
                where: {
                    type: '0',
                    userId: req.user.id
                }
            });
    
            // Send the response as a JSON object
            return res.json({ success: true,
                data: {
                lastMonthExpense: lastMonthExpense || 0,
                lastMonthIncome: lastMonthIncome || 0,
                todayExpense: todayExpense || 0,
                todayIncome: todayIncome || 0,
                totalExpense: totalExpense || 0,
                totalIncome: totalIncome || 0
                }
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch(e) {
        console.log('Error in /api/category/', e);
        res.send({success: false, data:`error loading data ${e}`});

    }
}