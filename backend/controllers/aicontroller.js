import generateResult from "../services/ai.service.js";


export async function getResult(req, res) {
  try {
    const { prompt } = req.body;
    const result = await generateResult(prompt);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}