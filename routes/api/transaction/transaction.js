var models = require('../../../models');


exports.getTransaction = async function (req, res) {
    try{
        const transaction = await models.Transaction.findAll({
            where: {
                userId: req.user.id
            }
        });
        res.send({success: true, data: transaction});
    } catch(e) {
        console.log('error', e);
    }
}

exports.addTransaction = async function (req, res) {
    try{
        const {category, type, amount, notes, date} = req.body

        const transaction = await models.Transaction.create({category: category, amount: amount, type: type, notes: notes, date: date, userId: req.user.id});
        res.send({success: true, data: transaction});
    } catch(e) {
        console.log('error', e);
    }
}

exports.updateTransaction = async function (req, res) {
    try{
        const {id, category, type, amount, notes, date} = req.body
        
        const Transaction = await models.Transaction.update({category: category, amount: amount, type: type, notes: notes, date: date},
            { where: {
                id: req.params.id
            }}
        );
        res.send({success: true, data: Transaction});
    } catch(e) {
        console.log('error', e);
    }
}


exports.deleteTransaction = async function (req, res) {
    try{        
        const Transaction = await models.Transaction.destroy(
            { where: {
                id: req.params.id
            }}
        );
        res.send({success: true, data: Transaction});
    } catch(e) {
        console.log('error', e);
    }
}