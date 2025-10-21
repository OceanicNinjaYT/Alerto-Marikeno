import static spark.Spark.*;
import com.google.gson.Gson;
import java.util.*;

public class keywordFinder {
  public static void main(String[] args) {
    port(Integer.parseInt(System.getenv().getOrDefault("PORT", "3000")));
    Gson gson = new Gson();

    // ✅ Allow CORS so Expo can access it
    options("/*", (req, res) -> {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      return "OK";
    });
    before((req, res) -> res.header("Access-Control-Allow-Origin", "*"));

    // 🧠 POST endpoint to analyze keywords
    post("/analyze", (req, res) -> {
      res.type("application/json");

      Map<String, String> body = gson.fromJson(req.body(), Map.class);
      String text = body.getOrDefault("text", "").toLowerCase();

      // Keywords to detect
        List<String> keywords = Arrays.asList(
            "flood", 
            "rain",
            "earthquake", 
            "storm", 
            "evacuation", 
            "alert", 
            "alarm", 
            "state of calamity", 
            "alarm level 1",
            "alarm level 2",
            "alarm level 3",
            "first alarm",
            "second alarm",
            "third alarm",
            "emergency"
        );
        List<String> priorityKeywords = Arrays.asList(
            "state of calamity",
            "first alarm",
            "second alarm",
            "third alarm",
            "alarm level 1",
            "alarm level 2",
            "alarm level 3",
            "emergency"
        );
        List<String> found = new ArrayList<>();
      for (String kw : keywords) {
        if (text.contains(kw)) {
          found.add(kw);
        }
      }
        List<String> priorityFound = new ArrayList<>();
        for (String pkw : priorityKeywords)
        if (text.contains(pkw)) {
            priorityFound.add(pkw);
        }

      Map<String, Object> result = new HashMap<>();
      result.put("original_text", text);
      result.put("keywords_found", found);
      result.put("priority_keywords_found", priorityFound);
      result.put("count", found.size());
      result.put("priority_keyword_count", priorityFound.size());

      return gson.toJson(result);
    });
  }
}
