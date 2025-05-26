const Expenserule = require("../models/expenserule")

module.exports.rulecreate = async (req, res) => {
    try {

        const { merchant, description, category } = req.body
        if (!description || !category || !merchant) {
            return res.status(400).json({ message: "Please fill in all fields" })
        }
        const body = {
            merchant: merchant,
            description: description,
            category: category,
            user: req.user.id,
        }
        const rule = await Expenserule.create(body)
        res.status(201).json({ message: "Rule created successfully", rule })
    } catch (err) {
        res.status(500).json({ message: "Error creating rule", error: err })
    }
}

module.exports.rulegetall = async (req, res) => {
    try {
        const rules = await Expenserule.find({ user: req.user?.id })
        res.json(rules)
    } catch (err) {
        res.status(500).json({ message: "Error retrieving rules", error: err })
    }
}

module.exports.updaterule = async (req, res) => {
    try {
        const { id } = req.params
        const rule = await Expenserule.findById(id)
        if (!rule) {
            return res.status(404).json({ message: "Expense Rule not found", })
        }
        const body = {}
        if (req.body) {
            body.merchant = req.body.merchant
            body.description = req.body.description
            body.category = req.body.category
        }
        const updatedRule = await Expenserule.findByIdAndUpdate(id, body, { new: true })
        res.json(updatedRule)
    }
    catch (err) {
        res.status(400).json({ message: "Invalid request body", error: err })
    }
}

module.exports.deleterule = async (req, res) => {
    try {
        const { id } = req.params
        const rule = await Expenserule.findById(id)
        if (!rule) {
            return res.status(404).json({ message: "Expense Rule not found", })
        }
        const deletedRule = await Expenserule.findByIdAndDelete(id)
        res.json(deletedRule)
    } catch (err) {
        res.status(500).json({ message: "Error deleting rule", error: err })
    }
}