export default async function handler(req, res) {
  const API_KEY = process.env.KIE_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "No key" });
  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: "No taskId" });
  try {
    const r = await fetch(
      "https://api.kie.ai/api/v1/jobs/recordInfo?taskId=" + taskId,
      { headers: { Authorization: "Bearer " + API_KEY } }
    );
    const data = await r.json();
    const d = data.data || {};
    const state = d.state || d.status || "pending";
    res.status(200).json({
      code: 200,
      data: {
        status: state,
        output: state === "success"
          ? { image_url: "/api/image?taskId=" + taskId }
          : null
      }
    });
  } catch (e) {
    res.status(200).json({ code: 200, data: { status: "pending" } });
  }
}
