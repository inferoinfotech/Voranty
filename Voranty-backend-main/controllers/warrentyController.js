const { default: mongoose } = require("mongoose");
const Warranty = require("../models/Warrenty");
const { sendWarrentyReminderEmail } = require("../utils/mailReminderUtils");
const { sendWarrentyReminderSMS } = require("../utils/smsReminderUtils");

module.exports.createWarranty = async (req, res) => {
  try {
    if (
      new Date(req.body.warrantyExpiryDate) <= new Date(req.body.purchaseDate)
    ) {
      return res.status(400).send({
        error: "Warranty expiry date must be after the purchase date.",
      });
    }
    const warranty = new Warranty(req.body);
    await warranty.save();
    res
      .status(201)
      .send({ message: "Warranty created successfully", warranty });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports.getAllWarrantys = async (req, res) => {
  try {
    const GetAllWarrantys = await Warranty.find();
    res.status(200).send(GetAllWarrantys);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports.getWarrantyById = async (req, res) => {
  try {
    const getwarranty = await Warranty.findById(req.params.id);
    if (!getwarranty) {
      return res.status(404).send({ error: "Warranty not found" });
    }
    res.status(200).send(getwarranty);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports.updateWarranty = async (req, res) => {
    try {
        if (new Date(req.body.warrantyExpiryDate) <= new Date(req.body.purchaseDate)) {
            return res.status(400).send({
                error: "Warranty expiry date must be after the purchase date.",
            });
        }
        const warranty = await Warranty.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true, 
        });
        if (!warranty) {
            return res.status(404).send({ error: "Warranty not found" });
        }
        res.status(200).send({ message: "Warranty updated successfully", warranty });
    } 
    catch (error) {
        res.status(400).send({ error: error.message });
    }
};

module.exports.deleteWarranty = async (req, res) => {
  try {
    const deletewarranty = await Warranty.findByIdAndDelete(req.params.id);
    if (!deletewarranty) {
      return res.status(404).send({ error: "Warranty not found" });
    }
    res
      .status(200)
      .send({ message: "Warranty deleted successfully", deletewarranty });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports.DueDateReminderWarrenty = async (req, res) => {
  const userId = req.user.id;
  const { email, phoneNumber } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ error: "Invalid user ID format." });
    }

    const userWarrenty = await Warranty.find({ user: userId });

    if (userWarrenty.length === 0) {
      return res
        .status(404)
        .send({ message: "No Warrenty found for the user." });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueWarrenty = userWarrenty.filter((warrenty) => {
      const dueDateObj = new Date(warrenty.warrantyExpiryDate);
      const reminderDate = new Date(dueDateObj);
      reminderDate.setDate(dueDateObj.getDate() - 1);
      reminderDate.setHours(0, 0, 0, 0);

      return today.getTime() === reminderDate.getTime();
    });

    console.log("Due Warrenty:", dueWarrenty);

    if (dueWarrenty.length === 0) {
      return res.status(200).send({ message: "No reminders needed today." });
    }

    console.log("Due Warrenty:", dueWarrenty);

    for (const warrenty of dueWarrenty) {
      const { warrantyExpiryDate, description } = warrenty;

      await sendWarrentyReminderEmail(email, warrantyExpiryDate, description);

      console.log(
        `Reminder sent for Warrenty ID: ${warrenty._id}, Description: ${description}`
      );
    }

    res
      .status(200)
      .send({ message: "Reminders sent successfully!", dueWarrenty });
  } catch (error) {
    console.error("Error sending reminders:", error);
    res.status(500).send({ error: "Internal server error." });
  }
};
