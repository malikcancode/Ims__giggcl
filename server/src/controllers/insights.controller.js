import Category from "../schemas/category.model.js";
import Inventory from "../schemas/inventory.model.js";
import { catchErrors } from "../utils/index.js";

const getInsights = catchErrors(async (req, res) => {
  const { startDate, endDate } = req.query;

  // Optional date range match on purchaseDate
  const matchStage = {};
  if (startDate || endDate) {
    matchStage.purchaseDate = {};
    if (startDate) matchStage.purchaseDate.$gte = new Date(startDate);
    if (endDate) matchStage.purchaseDate.$lte = new Date(endDate);
  }

  const totalCategories = await Category.countDocuments();

  const totalInventories = Object.keys(matchStage).length
    ? await Inventory.countDocuments(matchStage)
    : await Inventory.countDocuments();

  const totalPayrolls = await Inventory.aggregate([
    ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
    {
      $group: {
        _id: null,
        totalPrice: { $sum: "$price" },
      },
    },
  ]);

  const totalPrice = totalPayrolls[0]?.totalPrice || 0;

  const totalInventoryByCategory = await Inventory.aggregate([
    ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
    {
      $group: {
        _id: "$category",
        totalQuantity: {
          $sum: "$quantity",
        },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    { $unwind: "$categoryInfo" },
    {
      $project: {
        _id: 0,
        categoryName: "$categoryInfo.name",
        totalQuantity: 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    insights: {
      totalCategories,
      totalInventories,
      totalInventoryByCategory,
      totalPrice,
    },
  });
});

export { getInsights };