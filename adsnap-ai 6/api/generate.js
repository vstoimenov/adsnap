export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } }
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const API_KEY = process.env.KIE_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "API key not configured" });

  try {
    const { model, input } = req.body;
    
    // Build the request body for Kie.ai
    const kieBody = { model, input: { ...input } };
    
    // If product image is provided, format it for Kie.ai image-to-image
    if (input.image) {
      // Strip data:image/xxx;base64, prefix if present
      let imgData = input.image;
      if (imgData.startsWith("data:")) {
        imgData = imgData.split(",")[1];
      }
      
      // Send as images array (Kie.ai format for image editing)
      kieBody.input.images = [imgData];
      delete kieBody.input.image;
      
      // Enhance prompt for product-focused generation
      kieBody.input.prompt = `${input.prompt}, incorporate the provided product image seamlessly, keep the product recognizable and prominent`;
    }

    const response = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(kieBody),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to create task", details: e.message });
  }
}
