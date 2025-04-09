
import { Feed, Article } from "@/types";
import { useAppStore } from "./store";

export const processFeed = async (
  feed: Feed,
  openRouterConfig: any,
  wordPressConfig: any
) => {
  const addArticle = useAppStore.getState().addArticle;
  const updateFeed = useAppStore.getState().updateFeed;
  
  try {
    // Use a CORS proxy to fetch the RSS feed
    const proxyUrl = "https://api.allorigins.win/raw?url=";
    const encodedFeedUrl = encodeURIComponent(feed.url);
    const response = await fetch(`${proxyUrl}${encodedFeedUrl}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }
    
    let feedData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (data.status === 'error' || !data.items || data.items.length === 0) {
        throw new Error(`RSS error: ${data.message || 'Invalid feed or no items found'}`);
      }
      
      feedData = data;
    } else {
      // Parse XML
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      // Extract items from XML
      const items = xmlDoc.querySelectorAll("item");
      
      if (items.length === 0) {
        throw new Error("No items found in the feed");
      }
      
      // Get the first item
      const firstItem = items[0];
      
      const title = firstItem.querySelector("title")?.textContent || "";
      const description = firstItem.querySelector("description")?.textContent || "";
      const link = firstItem.querySelector("link")?.textContent || "";
      
      if (!title || !link) {
        throw new Error("Missing required RSS item properties");
      }
      
      // Create a similar structure to the JSON format
      feedData = {
        items: [{
          title,
          description: description || title,
          link
        }]
      };
    }
    
    // Update last fetched timestamp
    updateFeed(feed.id, { lastFetched: new Date().toISOString() });
    
    if (feedData.items && feedData.items.length > 0) {
      const item = feedData.items[0];
      
      const title = `Analysis of: ${item.title}`;
      const topic = `${item.title}. ${item.description || ''}`;
      
      const modelToUse = openRouterConfig.freeModel || "meta-llama/llama-3.1-8b-instruct:free";
      
      const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openRouterConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            {
              role: "system",
              content: "You are a professional content writer who creates well-researched, informative articles. Write in clear, engaging prose with proper HTML formatting. Use h2, h3, h4 for headings, <ul> and <li> for lists, and <p> tags for paragraphs."
            },
            {
              role: "user",
              content: `Write a comprehensive article with the title: "${title}" about the topic: "${topic}". Format your response with proper HTML tags including h2, h3, h4 for headings, <ul> and <li> for lists, and <p> tags for paragraphs. Make it informative, factual, and engaging for readers.`
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error("AI API error response:", errorText);
        throw new Error(`AI API error: ${aiResponse.statusText}`);
      }
      
      const aiData = await aiResponse.json();
      // Fix for potential undefined error
      const content = aiData.choices && aiData.choices.length > 0 
        ? aiData.choices[0]?.message?.content || "" 
        : "";
      
      if (!content) {
        throw new Error("AI generated empty content");
      }
      
      // Remove any XML declarations from the content
      const cleanContent = content.replace(/<\?xml[^>]*\?>/g, '');
      
      const article = {
        title,
        content: cleanContent,
        feedId: feed.id,
        sourceTitle: item.title,
        sourceLink: item.link,
        status: "generated" as Article["status"],
      };
      
      addArticle(article);
      
      if (wordPressConfig.isConnected) {
        try {
          const wpResponse = await fetch(`${wordPressConfig.url}/wp-json/wp/v2/posts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + btoa(`${wordPressConfig.username}:${wordPressConfig.password}`),
            },
            body: JSON.stringify({
              title: title,
              content: cleanContent,
              status: 'publish',
            }),
          });

          if (!wpResponse.ok) {
            const errorData = await wpResponse.json();
            throw new Error(errorData.message || `WordPress error: ${wpResponse.statusText}`);
          }
        } catch (wpError) {
          console.error("WordPress publishing error:", wpError);
          throw wpError;
        }
      }
      
      return { success: true };
    } else {
      throw new Error("No items found in the feed data");
    }
  } catch (error) {
    console.error("Feed processing error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};
