const Product = require('../models/Product');
const SiteSettings = require('../models/SiteSettings');
const OpenAI = require('openai');
const cloudinary = require('../config/cloudinary');

exports.generatePoster = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch Product
    const product = await Product.findById(id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Fetch Settings for API Key
    const settings = await SiteSettings.findOne();
    const apiKey = settings?.openaiApiKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        message: 'OpenAI API Key is not configured in settings or environment'
      });
    }

    const openai = new OpenAI({ apiKey });

    // 2. GENERATE DALL-E PROMPT WITH GPT-4o (Vision)

    // Construct the user message content. If the product has an image, use vision.
    const userContent = [
      {
        type: "text",
        text: `Product Name: ${product.name}\nDescription: ${product.description}\nCategory: ${product.category?.name || 'General'}\nPrice: $${product.price || 'Contact for price'}`
      }
    ];

    if (product.images && product.images.length > 0) {
      userContent.push({
        type: "image_url",
        image_url: { url: product.images[0].url }
      });
    }

    const promptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert Luxury Jewelry Creative Director & High-End Social Media Ad Designer.
Your task is to write a highly detailed text prompt for DALL-E 3. 

You MUST use the exact structure and style of the template below, but ADAPT the text (Top, Middle, Bottom, SKU, CTA) and the visual description to perfectly match the provided product details and image. 

DALL-E 3 must be instructed to natively generate and integrate the product seamlessly inside the image with realistic lighting, shadows, and reflections.

TEMPLATE TO ADAPT FOR DALL-E 3:
"Create a premium social media poster for [Product Name].
The product must feel naturally integrated into the environment with lighting, shadows, and reflections matching the background perfectly. It should NOT look pasted on.

Design style:
- Minimalist luxury aesthetic
- Soft gradient or matte background (in a color that elevates the product)
- Subtle spotlight or glow under the product for depth
- Add realistic shadow and slight reflection for a premium feel

Composition:
- Center the product, slightly tilted for dimension
- Maintain strong negative space for elegance
- Add soft enhancements like subtle light flares to enhance brilliance (keep it elegant)

Text placement:
Top: “[Luxurious Headline based on product]”
Middle (small, refined): “[Key Feature/Material based on product]”
Bottom (bold highlight): “[Catchy Tagline]”

Include:
- CTA: “Shop Now | [EXACT Product Price]” -> DO NOT invent a price. Use the exact price provided in the details.
- Brand logo: use a clean “LOGO” placeholder

Typography:
- Clean, modern serif + sans-serif combination
- Thin, spaced lettering for luxury feel

Mood:
Elegant, premium, aspirational — NOT loud, NOT cluttered.

Output:
Instagram-ready square poster (1:1), ultra high resolution, realistic lighting, polished commercial quality."

Output ONLY the adapted DALL-E 3 prompt string.`
        },
        {
          role: "user",
          content: userContent
        }
      ],
      max_tokens: 500,
    });

    const imagePrompt = promptResponse.choices[0].message.content;
    console.log("IMAGE PROMPT:", imagePrompt);

    // 3. GENERATE POSTER WITH GPT-IMAGE-1.5 (using Edit for exact product matching)
    let imageResponse;
    if (product.images && product.images.length > 0) {
      const imageUrl = product.images[0].url;
      const fetchedImage = await fetch(imageUrl);
      const arrayBuffer = await fetchedImage.arrayBuffer();

      const { toFile } = require('openai');
      const file = await toFile(Buffer.from(arrayBuffer), 'product.png', { type: 'image/png' });

      imageResponse = await openai.images.edit({
        model: "gpt-image-1",
        image: [file], // New 2026 array reference pattern
        prompt: imagePrompt,
        size: "1024x1024",
      });
    } else {
      // Fallback for no product image
      imageResponse = await openai.images.generate({
        model: "gpt-image-1",
        prompt: imagePrompt,
        size: "1024x1024",
      });
    }

    // Extract base64 JSON format (new API behavior for GPT Image models)
    const b64Json = imageResponse.data[0].b64_json;
    const uploadInput = `data:image/png;base64,${b64Json}`;

    // 4. UPLOAD TO CLOUDINARY
    const uploadedBg = await cloudinary.uploader.upload(uploadInput, {
      folder: 'ai-posters',
    });

    // 5. RESPONSE
    res.json({
      message: 'Poster generated successfully',
      posterUrl: uploadedBg.secure_url,
      usedPrompt: imagePrompt
    });
    console.log("POSTER URL:", uploadedBg.secure_url);

  } catch (error) {
    console.error('Error generating poster:', error);
    res.status(500).json({
      message: 'Failed to generate poster',
      error: error.message
    });
  }
};