import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator 
} from "react-native";
import { mockFetch } from "./mockApi"; //fake api

export default function App() {
  const [articles, setArticles] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
  (async () => {
    try {
      const data = await mockFetch("/page/post");

      const transformedArticles = data.map(post => ({
        id: post.id,
        title: post.from.name,
        description: post.message,
        image: post.attachments?.data[0]?.media?.image?.src || 'https://via.placeholder.com/800x400',
        time: new Date(post.created_time).toLocaleDateString(),
        category: 'News',
        url: post.permalink_url
      }));

      const filtered = [];
      for (const article of transformedArticles) {
        const hasKeywords = await areKeywordsFound(article.description);
        const hasPriorityKeywords = await arePriorityKeywordsFound(article.description)
        console.log("Sent to Paraphrasing AI");
        console.log("Parahrased caption, Changing Value...");

        if (hasKeywords) filtered.push(article);
        console.log("Send Notification to User");
        if (hasPriorityKeywords) {
        console.log("🚨!ACTIVATE ARDUINO ALARMS!🚨")
        }
      }

      setArticles(filtered);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  })();
}, []);


  const analyzeText = async (text) => {
    try {
      const response = await fetch(
        "https://keywordfinder-301895518339.asia-southeast1.run.app/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: input }),
        }
      );

      const data = await response.json();
      setResult(data); 
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const areKeywordsFound = async (text) => {
  try {
    const response = await fetch(
      "https://keywordfinder-301895518339.asia-southeast1.run.app/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }), 
      }
    );
    console.log("Connected to JAVA BACKEND")
    const data = await response.json();

    return data.count > 0; 
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
  };
  const arePriorityKeywordsFound = async (text) => {
  try {
    const response = await fetch(
      "https://keywordfinder-301895518339.asia-southeast1.run.app/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }), 
      }
    );
    console.log("Connected to JAVA BACKEND")
    const data = await response.json();

    return data.priority_keyword_count > 0; 
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
     
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerto-Marikeño News</Text>
      </View>

      {/* News Feed */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading news...</Text>
          </View>
        ) : (
          articles.map((article) => ( //loop/iterate the elements through the map
            <TouchableOpacity
              key={article.id}
              style={styles.articleCard}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: article.image }}
                style={styles.articleImage}
                resizeMode="cover"
              />
              <View style={styles.articleContent}>
                <View style={styles.articleMeta}>
                  <Text style={styles.category}>{article.category}</Text>
                  <Text style={styles.time}>{article.time}</Text>
                </View>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleDescription} numberOfLines={3}>
                  {article.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
       
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
  },
  articleCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  articleImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
  },
  articleContent: {
    padding: 16,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    textTransform: 'uppercase',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});