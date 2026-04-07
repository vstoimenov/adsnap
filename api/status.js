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
    const txt = await r.text();
    const stateM = txt.match(/"state"\s*:\s*"(\w+)"/);
    const state = stateM ? stateM[1] : "pending";
    let img = null;
    if (state === "success") {
      img = "/api/image?taskId=" + taskId;
    }
    res.status(200).json({
      code: 200,
      data: { status: state, output: img ? { image_url: img } : null }
    });
  } catch (e) {
    res.status(200).json({ code: 200, data: { status: "error_" + e.message } });
  }
}
