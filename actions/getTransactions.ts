"use server";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

// Function to extract number from ref_id
const extractNumberFromRefId = (ref_id) => {
  const regex = /(\d+)(?:[a-zA-Z]*)$/;
  const match = ref_id.match(regex);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 0;
};

// Function to get and process transactions with sorting and filtering by year and month
export const getTransactions = async (
  sortOrder = "desc",
  year = null,
  month = null
) => {
  try {
    await connectDB();

    // Build query object for filtering by year and month
    let filterQuery = {};
    if (year && month) {
      const startDate = new Date(year, month - 1, 1); // Start of the selected month
      const endDate = new Date(year, month, 0); // End of the selected month (last day)
      filterQuery = {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      };
    }

    // Sort transactions based on createdAt field in the specified order
    const sortOption = sortOrder === "asc" ? 1 : -1;
    const transactions = await Transaction.find(filterQuery).sort({ createdAt: sortOption });

    let totalGrossProfit = 0; // Initialize total gross profit

    const updatedTransactions = transactions.map((transaction) => {
      const transactionObj = transaction.toObject();
      const details = transactionObj.details;

      if (details && details.ref_id) {
        const ref_id = details.ref_id;
        const price = details.price;
        const numberFromRefId = extractNumberFromRefId(ref_id);
        const updatedPrice = price - numberFromRefId;
        const createdAtDate = new Date(transactionObj.createdAt);
        const indonesiaTime = new Date(createdAtDate.getTime() + 7 * 60 * 60 * 1000);

        const date = indonesiaTime.toISOString().split("T")[0];
        const time = indonesiaTime.toISOString().split("T")[1].split(".")[0];
        const formattedDateTime = `${date} ${time}`;

        const grossProfit = updatedPrice;

        totalGrossProfit += grossProfit; // Accumulate gross profit

        return {
          ...transactionObj,
          updatedPrice,
          formattedCreatedAt: formattedDateTime,
          grossProfit,
        };
      }

      return {
        ...transactionObj,
        formattedCreatedAt: new Date(transactionObj.createdAt).toISOString().replace("T", " ").split(".")[0],
      };
    });
    console.log(totalGrossProfit)
    return {
      transactions: updatedTransactions,
      totalGrossProfit, // Return total gross profit
    };
  } catch (error) {
    console.error(error);
    return { transactions: [], totalGrossProfit: 0 };
  }
};
