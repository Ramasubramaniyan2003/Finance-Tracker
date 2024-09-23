var models = require('../../../models');


exports.getTransaction = async function (req, res) {
    try {
        const transaction = await models.Transaction.findAll({
            include:[
                {
                    attributes:['id', 'name'],
                    model: models.Category,
                }
            ],
            where: {
                userId: req.user.id
            }
        });
        res.send({ success: true, data: transaction });
    } catch (e) {
        console.log('error', e);
        console.log('/api/transaction/getTransaction')
        res.send({ success: false, error:"Internal server error "+e  });
    }
}

exports.addTransaction = async function (req, res) {
    try {
        const { category, type, amount, notes, date } = req.body

        const transaction = await models.Transaction.create({ categoryId: category, amount, type, notes, date, userId: req.user.id });
        res.send({ success: true, data: transaction });
    } catch (e) {
        console.log('error', e);
        console.log('/api/transaction/addTransaction')
        res.send({ success: false, error:"Internal server error "+e  });
    }
}

exports.updateTransaction = async function (req, res) {
    try {
        const { id, category, type, amount, notes, date } = req.body

        const Transaction = await models.Transaction.update({ category: category, amount: amount, type: type, notes: notes, date: date },
            {
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            }
        );
        res.send({ success: true, data: Transaction });
    } catch (e) {
        console.log('error', e);
        console.log('/api/transaction/updateTransaction')
        res.send({ success: false, error:"Internal server error "+e  });

    }
}


exports.deleteTransaction = async function (req, res) {
    try {
        const Transaction = await models.Transaction.destroy(
            {
                where: {
                    id: req.params.id
                }
            }
        );
        res.send({ success: true, data: Transaction });
    } catch (e) {
        console.log('error', e);
        console.log('/api/transaction/deleteTransaction')
        res.send({ success: false, error:"Internal server error "+e  });
    }
}