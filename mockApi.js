export function mockFetch(endpoint) {
  return new Promise((resolve, reject) => {
    console.log(`Simulating fetch to ${endpoint}...`); 
    setTimeout(() => {
      if (endpoint === "/page/post") {
        resolve([  
          { //example post no.1
            id: "1234567890_54321",
            message: "We're launching our new app today! 🎉 Stay safe, Marikeño!",
            created_time: "2025-10-21T10:00:00+0000",
            permalink_url: "https://www.facebook.com/AlertoMarikeno/posts/54321",
            from: {
              name: "Alerto Marikeño",
              id: "1234567890",
            },
            attachments: {
              data: [
                {
                  media: { image: { src: "https://picsum.photos/800/400?random=1" } },
                  type: "photo",
                },
              ],
            },
          },
          {  //example post no.2
            id: "1234567890_54322",
            message: "Traffic update: Heavy traffic on Marcos Highway. Please take alternate routes.",
            created_time: "2025-10-20T14:30:00+0000",
            permalink_url: "https://www.facebook.com/AlertoMarikeno/posts/54322",
            from: {
              name: "Alerto Marikeño",
              id: "1234567890",
            },
            attachments: {
              data: [
                {
                  media: { image: { src: "https://picsum.photos/800/400?random=2" } },
                  type: "photo",
                },
              ],
            },
          },
          {  //example post no.3
            id: "1234567890_54323",
            message: "Reminder: Garbage collection schedule for Barangay Santa Elena is every Monday and Thursday.",
            created_time: "2025-10-19T08:00:00+0000",
            permalink_url: "https://www.facebook.com/AlertoMarikeno/posts/54323",
            from: {
              name: "Alerto Marikeño",
              id: "1234567890",
            },
            attachments: {
              data: [
                {
                  media: { image: { src: "https://picsum.photos/800/400?random=3" } },
                  type: "photo",
                },
              ],
            },
          },
        ]);
      } else {
        reject(new Error("Unknown endpoint"));
      }
    }, 1000); //delay to act like real call
  });
}